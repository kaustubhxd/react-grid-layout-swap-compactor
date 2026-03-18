import { verticalCompactor, } from "react-grid-layout";
/**
 * Find the swap sibling: the item that was at the target column,
 * in the same row, adjacent to the dragged item's origin.
 */
export function findSwapSibling(dragState, dragged, preDragLayout) {
    // Only swap for horizontal moves within the same row
    if (dragged.x === dragState.originX || dragged.y !== dragState.originY)
        return undefined;
    return preDragLayout.find((item) => item.i !== dragState.draggedId &&
        item.x === dragged.x &&
        item.y === dragState.originY &&
        Math.abs(item.x - dragState.originX) <= 1);
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
export function createSwapCompactor(getDragState, getPreDragLayout) {
    return {
        type: "vertical",
        allowOverlap: false,
        compact(layout, cols) {
            const compacted = [...verticalCompactor.compact([...layout], cols)];
            const ds = getDragState();
            if (!ds)
                return compacted;
            const dragged = compacted.find((item) => item.i === ds.draggedId);
            if (!dragged)
                return compacted;
            const sibling = findSwapSibling(ds, dragged, getPreDragLayout());
            if (!sibling)
                return compacted;
            return compacted.map((item) => item.i === sibling.i
                ? Object.assign(Object.assign({}, item), { x: ds.originX, y: ds.originY }) : item);
        },
    };
}
//# sourceMappingURL=index.js.map