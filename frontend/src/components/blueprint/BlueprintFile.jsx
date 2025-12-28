// src/components/blueprint/BlueprintFile.jsx
import { Group, Rect, Text, Circle } from "react-konva";
import { GRID_STEP } from "../../constants/grid";
import { updateFilePosition } from "../../api/files";
export default function BlueprintFile({ node, onEditNode, onMoveNode }) {
    // Dimensions visuelles du node
    const width = 260;
    const headerHeight = 32;
    const bodyHeight = 120;

    // Couleur du header (provisoire)
    const headerColor = node.headerColor || "#347bed";

    // Met à jour la position du node dans React lorsque l'utilisateur le déplace
    const handleDragEnd = (e) => {
        const xPx = e.target.x();
        const yPx = e.target.y();

        const gridX = Math.round(xPx / GRID_STEP);
        const gridY = Math.round(yPx / GRID_STEP);

        // Commit final → sauvegarde DB
        updateFilePosition(node.id, gridX, gridY);
    };

    // Position des "pins" (points de connexion)
    const inputPinY = headerHeight + 24;
    const outputPinY = headerHeight + 24;

    // Creer un preview du text
    const previewText = node.content
        ? node.content
            .replace(/<p>/g, "")
            .replace(/<\/p>/g, "\n")
            .replace(/<[^>]+>/g, "")
        : "No content";

    return (
        <Group
            x={node.x}
            y={node.y}
            draggable={true}
            onDragEnd={handleDragEnd}
            onDblClick={() => onEditNode?.(node)}
            onDragMove={(e) => {
                onMoveNode(
                    node.id,
                    e.target.x(),
                    e.target.y(),
                    "file"
                );
            }}
        >
            {/* Header du node */}
            <Rect
                width={width}
                height={headerHeight}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: width, y: 0 }}
                fillLinearGradientColorStops={[
                    0, headerColor,
                    1, "#1f75fe"
                ]}
                cornerRadius={[6, 6, 0, 0]}
                stroke="#6ea8ff"
                strokeWidth={1.5}
            />

            {/* Titre du node */}
            <Text
                text={node.title || "Node"}
                x={10}
                y={6}
                fill="white"
                fontSize={15}
                fontStyle="bold"
            />

            {/* Corps du node */}
            <Rect
                y={headerHeight}
                width={width}
                height={bodyHeight}
                fill="#151923"
                stroke="#6ea8ff"
                strokeWidth={1.5}
                cornerRadius={[0, 0, 6, 6]}
            />

            {/* Texte descriptif */}
            <Text
                text={previewText || "No content"}
                x={12}
                y={headerHeight + 10}
                width={width - 24}
                fill="#c5d1e5"
                fontSize={13}
                lineHeight={1.3}
                ellipsis
                height={bodyHeight - 20}
            />

            {/* Pin d'entrée (gauche) */}
            <Circle
                x={-10}
                y={inputPinY}
                radius={6}
                fill="white"
                stroke="#aaaaaa"
                strokeWidth={1}
            />

            {/* Pin de sortie (droite) */}
            <Circle
                x={width + 10}
                y={outputPinY}
                radius={6}
                fill="white"
                stroke="#aaaaaa"
                strokeWidth={1}
            />
        </Group>
    );
}
