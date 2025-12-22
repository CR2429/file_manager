// src/components/blueprint/BlueprintNode.jsx
import { Group, Rect, Text, Circle } from "react-konva";
import { GRID_STEP } from "../../constants/grid";

export default function BlueprintNode({ node, onPositionChange, onPositionCommit, onEditNode }) {
    // Dimensions visuelles du node
    const width = 260;
    const headerHeight = 32;
    const bodyHeight = 120;

    // Couleur du header (provisoire)
    const headerColor = node.headerColor || "#347bed";

    // Met à jour la position du node dans React lorsque l'utilisateur le déplace
    const handleDragMove = (e) => {
        // Position en pixels
        const xPx = e.target.x();
        const yPx = e.target.y();

        // Conversion pixels → cases (snap)
        const gridX = Math.round(xPx / GRID_STEP);
        const gridY = Math.round(yPx / GRID_STEP);

        // Mise à jour visuelle immédiate (snap)
        onPositionChange(
            node.id,
            gridX * GRID_STEP,
            gridY * GRID_STEP
        );
    };

    const handleDragEnd = (e) => {
        const xPx = e.target.x();
        const yPx = e.target.y();

        const gridX = Math.round(xPx / GRID_STEP);
        const gridY = Math.round(yPx / GRID_STEP);

        // Commit final → sauvegarde DB
        onPositionCommit(node.id, gridX, gridY);
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

    if (node.type === "keyword") {
        const paddingX = 14;
        const height = 28;
        const minWidth = 60;

        return (
            <Group
                x={node.x}
                y={node.y}
                draggable
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
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


    return (
        <Group
            x={node.x}
            y={node.y}
            draggable={true}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDblClick={() => onEditNode?.(node)}
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
