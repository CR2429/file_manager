// src/components/blueprint/BlueprintKeyword.jsx
import { Group, Rect, Text, Circle } from "react-konva";
import { GRID_STEP } from "../../constants/grid";
import { updateDraftKeywordPosition } from "../../api/keywords";

export default function BlueprintKeyword({ node, onMoveNode }) {
    // Dimensions visuelles du node
    const paddingX = 14;
    const height = 28;
    const minWidth = 60;

    // Met à jour la position du node dans React lorsque l'utilisateur le déplace
    const handleDragEnd = (e) => {
        const xPx = e.target.x();
        const yPx = e.target.y();

        const gridX = Math.round(xPx / GRID_STEP);
        const gridY = Math.round(yPx / GRID_STEP);

        // Commit final → sauvegarde DB
        updateDraftKeywordPosition(node.id, gridX, gridY);
    };

    return (
        <Group
            x={node.x}
            y={node.y}
            draggable={true}
            onDragEnd={handleDragEnd}
            onDragMove={(e) => {
                onMoveNode(
                    node.id,
                    e.target.x(),
                    e.target.y(),
                    "keyword"
                );
            }}
            >
                {/* Fond */}
                <Rect
                    width={Math.max(minWidth, node.label.length * 8 + paddingX * 2)}
                    height={height}
                    cornerRadius={14}
                    fill="#24192f"
                    stroke="#9b59b6"
                    strokeWidth={1.5}
                />

                {/* Label */}
                <Text
                    text={node.label}
                    fontSize={13}
                    fill="#e8d9ff"
                    x={paddingX}
                    y={6}
                    fontStyle="bold"
                />

                {/* Pin gauche */}
                <Circle
                    x={-8}
                    y={height / 2}
                    radius={4}
                    fill="#9b59b6"
                />

                {/* Pin droite */}
                <Circle
                    x={Math.max(minWidth, node.label.length * 8 + paddingX * 2) + 8}
                    y={height / 2}
                    radius={4}
                    fill="#9b59b6"
                />
            </Group>
    );
}
