import { useState } from 'react';

function App() {
  const [points, setPoints] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [curveType, setCurveType] = useState("quadratic");

  // Получение координат внутри SVG
  const getMousePos = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // Добавление точки (ПКМ)
  const handleRightClick = (e) => {
    e.preventDefault();
    const newPoint = getMousePos(e);
    setPoints([...points, newPoint]);
  };

  // Удаление точки (двойной клик)
  const handleDoubleClick = (index) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  // Начало перетаскивания
  const handleMouseDown = (index) => {
    setDraggingIndex(index);
  };

  // Перетаскивание точки
  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    const updatedPoints = [...points];
    updatedPoints[draggingIndex] = getMousePos(e);
    setPoints(updatedPoints);
  };

  // Завершение перетаскивания
  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  // Генерация кривой
  const generatePath = () => {
    if (points.length < 2) return "";
    let pathData = `M ${points[0].x} ${points[0].y}`;

    if (curveType === "quadratic") {
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const midX = (prev.x + points[i].x) / 2;
        const midY = (prev.y + points[i].y) / 2;
        pathData += ` Q ${midX} ${midY}, ${points[i].x} ${points[i].y}`;
      }
    } else {
      for (let i = 1; i < points.length - 1; i += 2) {
        const cp1 = points[i];
        const cp2 = points[i + 1] || cp1;
        const end = points[i + 2] || cp2;
        pathData += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
      }
    }

    return pathData;
  };

  return (
    <div>
      <button className="btn" onClick={() => setCurveType(curveType === "quadratic" ? "cubic" : "quadratic")}>
        {curveType === "quadratic" ? "Квадратичная" : "Кубическая"}
      </button>
      <svg
        width="100vw"
        height="90vh"
        style={{ background: "white", display: "block", border: "1px solid #ddd" }}
        onContextMenu={handleRightClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <path d={generatePath()} stroke="blue" fill="none" strokeWidth="2" />
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="red"
            onMouseDown={() => handleMouseDown(i)}
            onDoubleClick={() => handleDoubleClick(i)}
            style={{ cursor: "grab" }}
          />
        ))}
      </svg>
    </div>
  );
};

export default App;
