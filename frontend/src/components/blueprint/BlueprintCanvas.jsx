import { useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import BlueprintNode from "./BlueprintNode";

export default function BlueprintCanvas({
    files,
    setFiles,
    connections,
    setConnections,
    camera,
    setCamera
}) {
    const stageRef = useRef(null);

    // Zoom
    function handleWheel(e) {
        e.evt.preventDefault();

        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const factor = 0.05 * direction;

        const newScale = Math.max(0.2, Math.min(5, oldScale + factor));

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale
        };

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale
        };

        stage.position(newPos);

        setCamera({
            x: newPos.x,
            y: newPos.y,
            scale: newScale
        });

        stage.batchDraw();
    }

    // Pan
    function handleMouseDown() {
        const stage = stageRef.current;
        stage.container().style.cursor = "grabbing";
    }

    function handleMouseUp() {
        const stage = stageRef.current;
        stage.container().style.cursor = "default";
    }

    function handleDragMove() {
        const stage = stageRef.current;

        setCamera({
            x: stage.x(),
            y: stage.y(),
            scale: stage.scaleX()
        });
    }

    // Grid lines
    const gridLines = [];
    const gridSize = 50;
    const gridCount = 200;

    for (let i = 0; i < gridCount; i++) {
        const pos = i * gridSize;

        gridLines.push(
            <Line
                key={"v" + i}
                points={[pos, 0, pos, gridCount * gridSize]}
                stroke="#c0c0c0"
                strokeWidth={1}
                listening={false}
            />
        );

        gridLines.push(
            <Line
                key={"h" + i}
                points={[0, pos, gridCount * gridSize, pos]}
                stroke="#c0c0c0"
                strokeWidth={1}
                listening={false}
            />
        );
    }

    return (
        <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            draggable
            x={camera.x}
            y={camera.y}
            scaleX={camera.scale}
            scaleY={camera.scale}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onDragMove={handleDragMove}
        >
            {/* Grid */}
            <Layer>{gridLines}</Layer>

            {/* Nodes */}
            <Layer>
                {files.map(f => (
                    <BlueprintNode
                        key={f.id}
                        node={f}
                        files={files}
                        setFiles={setFiles}
                    />
                ))}
            </Layer>

            {/* Future: cables */}
            <Layer>
                {connections.map((c, i) => (
                    <Line
                        key={i}
                        points={c.points}
                        stroke="#4ea8de"
                        strokeWidth={4}
                        tension={0.5}
                        lineCap="round"
                    />
                ))}
            </Layer>
        </Stage>
    );
}