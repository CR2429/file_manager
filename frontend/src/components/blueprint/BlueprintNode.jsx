import { useState } from "react";

export default function BlueprintNode({ id, x, y, title, onMove }) {
    const [pos, setPos] = useState({ x, y });

    let dragging = false;
    let start = { x: 0, y: 0 };

    function onMouseDown(e) {
        dragging = true;
        start = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        e.stopPropagation();
    }

    function onMouseMove(e) {
        if (!dragging) return;
        const newPos = {
            x: e.clientX - start.x,
            y: e.clientY - start.y
        };
        setPos(newPos);
        onMove(id, newPos);
    }

    function onMouseUp() {
        dragging = false;
    }

    return (
        <div
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                padding: "10px 15px",
                borderRadius: "6px",
                background: "#2a2a2a",
                color: "white",
                border: "1px solid #444",
                cursor: "grab"
            }}
        >
            {title}
        </div>
    );
}
