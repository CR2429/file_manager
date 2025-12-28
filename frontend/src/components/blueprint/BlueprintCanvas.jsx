// src/components/blueprint/BlueprintCanvas.jsx
import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Group, Line } from "react-konva";
import BlueprintFile from "./BlueprintFile";
import BlueprintOrigin from "./BlueprintOrigin";
import { GRID_STEP } from "../../constants/grid";
import BlueprintKeyword from "./BlueprintKeyword";

// Grille d'arrière-plan
function BlueprintGrid({ screenWidth, screenHeight, onEditNode }) {

    const GRID_SIZE = 5;

    const width = screenWidth * GRID_SIZE;
    const height = screenHeight * GRID_SIZE;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const smallStep = 24;
    const largeStep = 120;

    const lines = [];

    // --- Vertical lines (X axis) ---
    const startXSmall = Math.floor(-halfWidth / smallStep) * smallStep;
    const endXSmall = Math.ceil(halfWidth / smallStep) * smallStep;

    for (let x = startXSmall; x <= endXSmall; x += smallStep) {
        lines.push(
            <Line
                key={`sx-${x}`}
                points={[x, -halfHeight, x, halfHeight]}
                stroke="#1f2735"
                strokeWidth={1}
            />
        );
    }

    const startXLarge = Math.floor(-halfWidth / largeStep) * largeStep;
    const endXLarge = Math.ceil(halfWidth / largeStep) * largeStep;

    for (let x = startXLarge; x <= endXLarge; x += largeStep) {
        lines.push(
            <Line
                key={`lx-${x}`}
                points={[x, -halfHeight, x, halfHeight]}
                stroke="#2c3644"
                strokeWidth={1}
            />
        );
    }

    // --- Horizontal lines (Y axis) ---
    const startYSmall = Math.floor(-halfHeight / smallStep) * smallStep;
    const endYSmall = Math.ceil(halfHeight / smallStep) * smallStep;

    for (let y = startYSmall; y <= endYSmall; y += smallStep) {
        lines.push(
            <Line
                key={`sy-${y}`}
                points={[-halfWidth, y, halfWidth, y]}
                stroke="#1f2735"
                strokeWidth={1}
            />
        );
    }

    const startYLarge = Math.floor(-halfHeight / largeStep) * largeStep;
    const endYLarge = Math.ceil(halfHeight / largeStep) * largeStep;

    for (let y = startYLarge; y <= endYLarge; y += largeStep) {
        lines.push(
            <Line
                key={`ly-${y}`}
                points={[-halfWidth, y, halfWidth, y]}
                stroke="#2c3644"
                strokeWidth={1}
            />
        );
    }

    return <Group listening={false}>{lines}</Group>;
}

export default function BlueprintCanvas({
    nodes,
    keywords,
    links,
    camera,
    updateCamera,
    mode,
    gridEnabled,
    stageRef,
    onEditNode,
    onMoveNode
}) {

    // Mesure la taille de l'écran pour adapter le Stage
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Ajuste la taille en cas de redimensionnement de la fenêtre
    useEffect(() => {
        function onResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Appliquer la caméra sauvegardée au Stage
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        stage.x(camera.x);
        stage.y(camera.y);
        stage.scale({ x: camera.scale, y: camera.scale });
        stage.batchDraw();
    }, [camera]);

    // Gestion du zoom Konva (centré sur la souris)
    const handleWheel = (e) => {
        e.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const scaleBy = 1.1;
        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        // Position du pointeur transformée en coordonnées "monde"
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale
        };

        // Appliquer le zoom
        stage.scale({ x: newScale, y: newScale });
        stage.position({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale
        });

        // Enregistrer la caméra mise à jour
        updateCamera({
            x: stage.x(),
            y: stage.y(),
            scale: newScale
        });
    };

    // Lorsque l'utilisateur déplace la caméra (pan Konva natif)
    const handleDragMove = () => {
        const stage = stageRef.current;
        if (!stage) return;

        updateCamera({
            x: stage.x(),
            y: stage.y(),
            scale: stage.scaleX()
        });

        //logCameraCenter(stage);
    };

    // Fusionner nodes et keywords pour un accès par ID
    const allNodes = [...nodes, ...keywords];
    const nodeById = Object.fromEntries(
        allNodes.map(n => [n.id, n])
    );

    // Construire les liens entre fichiers et keywords
    function getPortPosition(node, isOutput) {
        if (node.type === "file") {
            return {
                x: node.x + 220, // largeur BlueprintFile
                y: node.y + 40   // centre vertical du header
            };
        }

        if (node.type === "keyword") {
            return {
                x: node.x,       // entrée à gauche
                y: node.y + 14
            };
        }

        return null;
    }

    

    return (
        <Stage
            ref={stageRef}
            width={size.width}
            height={size.height}
            draggable={mode === "pan"}  // Pan uniquement en mode "pan"
            onDragMove={handleDragMove}
            onWheel={handleWheel}
        >
            {/* Grille d'arrière-plan (optionnelle) */}
            <Layer listening={false}>
                {gridEnabled && (
                    <>
                        <BlueprintGrid
                            screenWidth={size.width}
                            screenHeight={size.height}
                            camera={camera}
                        />

                        {/* Repère visuel du point (0,0) */}
                        <BlueprintOrigin />
                    </>
                )}
            </Layer>

            {/* Links */}
            <Layer listening={false}>
                {links.map(link => {
                    const fromNode = nodeById[link.from];
                    const toNode = nodeById[link.to];

                    if (!fromNode || !toNode) return null;

                    const from = getPortPosition(fromNode, true);
                    const to = getPortPosition(toNode, false);

                    if (!from || !to) return null;

                    return (
                        <Line
                            key={link.id}
                            points={[
                                from.x, from.y,
                                to.x, to.y
                            ]}
                            stroke="#ffffffff"
                            strokeWidth={2}
                        />
                    );
                })}
            </Layer>

            
            {/* Nodes */}
            <Layer>
                {nodes.map((node) => (
                    <BlueprintFile
                        key={node.id}
                        node={node}
                        onEditNode={onEditNode}
                        onMoveNode={onMoveNode}
                    />
                ))}
                {keywords.map((keyword) => (
                    <BlueprintKeyword 
                        key={keyword.id}
                        node={keyword}
                        onMoveNode={onMoveNode}
                    />
                ))}
            </Layer>
        </Stage>
    );
}
