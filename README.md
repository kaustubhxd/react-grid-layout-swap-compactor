# react-grid-layout-swap-compactor

![GIF](https://github.com/user-attachments/assets/55ce1046-f2cd-4c91-84c3-b6b304de02d5)

A swap compactor for [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) v2. When you drag a node onto an adjacent same-row sibling, they **swap positions** instead of the sibling being pushed down.

## The Problem

With RGL's default `verticalCompactor`, dragging node A onto node B's position pushes B downward. This is confusing — users expect A and B to swap places.

## The Solution

This compactor wraps `verticalCompactor` (keeping normal grid snapping) and adds swap behavior: adjacent siblings in the same row exchange positions when one is dragged onto the other.

```
Before drag:  [A] [B] [C] [D]
Drag A → B:   [B] [A] [C] [D]  ← swap, not push
```

## Install

```bash
npm install react-grid-layout-swap-compactor
```

## Usage

```tsx
import { useRef, useMemo } from "react";
import ReactGridLayout from "react-grid-layout";
import { createSwapCompactor, findSwapSibling, type DragState } from "react-grid-layout-swap-compactor";

function MyGrid() {
  const dragStateRef = useRef<DragState | null>(null);
  const layoutBeforeDragRef = useRef<LayoutItem[]>([]);

  const swapCompactor = useMemo(
    () => createSwapCompactor(
      () => dragStateRef.current,
      () => layoutBeforeDragRef.current,
    ),
    [],
  );

  return (
    <ReactGridLayout
      compactor={swapCompactor}
      onDragStart={(_layout, _oldItem, newItem) => {
        dragStateRef.current = {
          draggedId: newItem.i,
          originX: newItem.x,
          originY: newItem.y,
        };
        layoutBeforeDragRef.current = layout.map(l => ({ ...l }));
      }}
      onDragStop={(_layout, _oldItem, newItem) => {
        const ds = dragStateRef.current;
        dragStateRef.current = null;

        if (ds) {
          const sibling = findSwapSibling(ds, newItem, layoutBeforeDragRef.current);
          if (sibling) {
            // Apply swap to your layout state:
            // - newItem goes to (newItem.x, ds.originY)
            // - sibling goes to (ds.originX, ds.originY)
          }
        }
      }}
    >
      {/* children */}
    </ReactGridLayout>
  );
}
```

## API

### `createSwapCompactor(getDragState, getPreDragLayout)`

Creates a `Compactor` that wraps `verticalCompactor` with swap behavior.

- `getDragState: () => DragState | null` — returns current drag state, or null when not dragging
- `getPreDragLayout: () => LayoutItem[]` — returns the layout snapshot from before the drag started

### `findSwapSibling(dragState, dragged, preDragLayout)`

Finds the sibling that should swap with the dragged item. Returns `undefined` if no swap should occur.

Swap only happens when:
- The move is **horizontal** (same row)
- The target column had an item that was **adjacent** to the dragged item's origin

### `DragState`

```ts
interface DragState {
  draggedId: string;
  originX: number;
  originY: number;
}
```

## Requirements

- `react-grid-layout` v2.0.0+

## License

MIT
