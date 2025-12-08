import { Group, Rect, Text, Circle } from "react-konva";
import { useState } from "react";

export default function BlueprintNode({ node, files, setFiles }) {
    const [pos, setPos] = useState({ x: node.x, y: node.y });

    function handleDragMove(e) {
        const x = e.target.x();
        const y = e.target.y();
        setPos({ x, y });

        setFiles(prev =>
            prev.map(n =>
                n.id === node.id ? { ...n, x, y } : n
            )
        );
    }

    const width = 220;
    const height = 110;

    return (
        <Group
            x={pos.x}
            y={pos.y}
            draggable
            onDragMove={handleDragMove}
        >
            {/* Node background */}
            <Rect
                width={width}
                height={height}
                fill="#1b263b"
                stroke="#778da9"
                strokeWidth={2}
                cornerRadius={6}
            />

            {/* Header */}
            <Rect
                width={width}
                height={30}
                fill="#415a77"
                cornerRadius={[6,6,0,0]}
            />

            <Text
                text={node.title}
                x={10}
                y={7}
                fill="white"
                fontSize={16}
                listening={false}
            />

            {/* Inputs */}
            {node.inputs?.map((p, i) => (
                <Circle
                    key={p.id}
                    x={0}
                    y={40 + i * 20}
                    radius={6}
                    fill={p.color || "#4ea8de"}
                />
            ))}

            {/* Outputs */}
            {node.outputs?.map((p, i) => (
                <Circle
                    key={p.id}
                    x={width}
                    y={40 + i * 20}
                    radius={6}
                    fill={p.color || "#4ea8de"}
                />
            ))}
        </Group>
    );
}
