import { useEffect, useRef, useState } from "react";
import { getFiles, updateFilePosition } from "../api/files";
import BlueprintNode from "../components/blueprint/BlueprintNode";

export default function BlueprintPage() {
    const [files, setFiles] = useState([]);

    // Camera state
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    // Pan logic
    const isPanning = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        loadFiles();
    }, []);

    async function loadFiles() {
        const res = await getFiles();
        setFiles(res);
    }

    // === PANNING ===
    function handleMouseDown(e) {
        // Empêche le déplacement si on clique un node
        if (e.target.closest(".node")) return;

        isPanning.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseMove(e) {
        if (!isPanning.current) return;

        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;

        setOffset(o => clampCameraOffset({ x: o.x + dx, y: o.y + dy }, zoom));

        lastMouse.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseUp() {
        isPanning.current = false;
    }

    // === ZOOM ===
    function handleWheel(e) {
        e.preventDefault();

        const factor = e.deltaY > 0 ? 0.9 : 1.1;

        setZoom(z => {
            const newZoom = Math.min(5, Math.max(0.1, z * factor));

            // Recalcule la caméra après zoom
            setOffset(o => clampCameraOffset(o, newZoom));

            return newZoom;
        });
    }

    // === LIMIT CAMERA ===
    function clampCameraOffset(offset, zoom) {
        const WORLD_SIZE = 5000; // Total canvas
        const HALF = WORLD_SIZE / 2;

        const viewW = window.innerWidth / zoom;
        const viewH = window.innerHeight / zoom;

        const minX = -HALF + viewW / 2;
        const maxX = HALF - viewW / 2;

        const minY = -HALF + viewH / 2;
        const maxY = HALF - viewH / 2;

        return {
            x: Math.max(minX, Math.min(maxX, offset.x)),
            y: Math.max(minY, Math.min(maxY, offset.y)),
        };
    }

    // === UPDATE NODE
    async function moveNode(id, newPos) {
        await updateFilePosition(id, newPos);
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
        >
            {/* CANVAS */}
            <div
                style={{
                    position: "absolute",
                    width: "5000px",
                    height: "5000px",
                    left: "50%",
                    top: "50%",
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) translate(-50%, -50%)`,
                    transformOrigin: "0 0",
                    backgroundColor: "#222",
                    backgroundSize: `${20}px ${20}px`,
                    backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)",
                }}
            >
                {files.map(f => (
                    <BlueprintNode
                        key={f.id}
                        id={f.id}
                        x={f.pos_x}
                        y={f.pos_y}
                        title={f.title}
                        onMove={moveNode}
                    />
                ))}
            </div>
        </div>
    );
}
