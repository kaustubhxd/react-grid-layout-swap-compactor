import { type Compactor, type LayoutItem } from "react-grid-layout";
export interface DragState {
    draggedId: string;
    originX: number;
    originY: number;
}
/**
 * Find the swap sibling: the item that was at the target column,
 * in the same row, adjacent to the dragged item's origin.
 */
export declare function findSwapSibling(dragState: DragState, dragged: LayoutItem, preDragLayout: LayoutItem[]): LayoutItem | undefined;
/**
 * Create a swap-aware compactor that wraps verticalCompactor.
 *
 * During a drag, if the dragged item lands on an adjacent same-row sibling,
 * the sibling swaps to the dragged item's origin instead of being pushed down.
 *
 * @param getDragState - Returns the current drag state (null when not dragging)
 * @param getPreDragLayout - Returns the layout snapshot from before the drag started
 */
export declare function createSwapCompactor(getDragState: () => DragState | null, getPreDragLayout: () => LayoutItem[]): Compactor;
//# sourceMappingURL=index.d.ts.map