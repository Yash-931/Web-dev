import { useDrag } from "react-dnd";

export function Card({ title, description, id }) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "card",
      item: { id, title, description },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    [],
  );

  return (
    <div
      ref={dragRef}
      style={{
        opacity,
        border: "1px solid gray",
        borderRadius: 10,
        padding: 20,
        margin: 20,
        cursor: "pointer",
      }}
    >
      <div style={{ margin: 10 }}>{title}</div>
      <div
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "black",
          margin: 2,
        }}
      ></div>

      <div style={{ margin: 10 }}>{description}</div>
    </div>
  );
}
