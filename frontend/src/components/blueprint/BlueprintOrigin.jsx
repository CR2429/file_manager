// src/components/blueprint/BlueprintOrigin.jsx

import { Group, Line, Circle } from "react-konva";

export default function BlueprintOrigin() {
    const AXIS_LENGTH = 20; // longueur visuelle des axes

    return (
        <Group listening={false}>
            {/* Axe X */}
            <Line
                points={[-AXIS_LENGTH, 0, AXIS_LENGTH, 0]}
                stroke="#3fa9f5"
                strokeWidth={1.5}
            />

            {/* Axe Y */}
            <Line
                points={[0, -AXIS_LENGTH, 0, AXIS_LENGTH]}
                stroke="#f54291"
                strokeWidth={1.5}
            />

            {/* Point central (0,0) */}
            <Circle
                x={0}
                y={0}
                radius={4}
                fill="#ffffff"
                stroke="#000"
                strokeWidth={1}
            />
        </Group>
    );
}
