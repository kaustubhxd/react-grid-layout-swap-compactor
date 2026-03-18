import {
  type Compactor,
  type Layout,
  type LayoutItem,
  verticalCompactor,
} from "react-grid-layout";

export interface DragState {
  draggedId: string;
  originX: number;
  originY: number;
}

/**
 * Find the swap sibling: the item that was at the target column,
 * in the same row, adjacent to the dragged item's origin.
 */
export function findSwapSibling(
  dragState: DragState,
  dragged: LayoutItem,
  preDragLayout: LayoutItem[],
): LayoutItem | undefined {
  // Only swap for horizontal moves within the same row
  if (dragged.x === dragState.originX || dragged.y !== dragState.originY)
    return undefined;

  return preDragLayout.find(
    (item) =>
      item.i !== dragState.draggedId &&
      item.x === dragged.x &&
      item.y === dragState.originY &&
      Math.abs(item.x - dragState.originX) <= 1,
  );
}

/**
 * Create a swap-aware compactor that wraps verticalCompactor.
 *
 * During a drag, if the dragged item lands on an adjacent same-row sibling,
 * the sibling swaps to the dragged item's origin instead of being pushed down.
 *
 * @param getDragState - Returns the current drag state (null when not dragging)
 * @param getPreDragLayout - Returns the layout snapshot from before the drag started
 */
export function createSwapCompactor(
  getDragState: () => DragState | null,
  getPreDragLayout: () => LayoutItem[],
): Compactor {
  return {
    type: "vertical",
    allowOverlap: false,
    compact(layout: Layout, cols: number): Layout {
      const compacted = [...verticalCompactor.compact([...layout], cols)];
      const ds = getDragState();
      if (!ds) return compacted;

      const dragged = compacted.find((item) => item.i === ds.draggedId);
      if (!dragged) return compacted;

      const sibling = findSwapSibling(ds, dragged, getPreDragLayout());
      if (!sibling) return compacted;

      return compacted.map((item) =>
        item.i === sibling.i
          ? { ...item, x: ds.originX, y: ds.originY }
          : item,
      );
    },
  };
}
