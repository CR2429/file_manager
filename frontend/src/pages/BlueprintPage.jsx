import { useRef, useState } from "react";
import BlueprintNode from "../components/blueprint/BlueprintNode";
import BlueprintToolbar from "../components/toolbar/BlueprintToolbar";
import CreateFileModal from "../components/file/CreateFileModal";
import ApiTokenModal from "../components/token/ApiTokenModal";

import "./BlueprintPage.css";

export default function BlueprintPage() {
    const [files, setFiles] = useState([]);
    const [fileModalOpen, setFileModalOpen] = useState(false);

    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const isPanning = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });

    const [apiModalOpen, setApiModalOpen] = useState(false);


    function addFileToUI(file) {
        setFiles(prev => [...prev, file]);
    }

    function handleMouseDown(e) {
        if (e.target.closest(".node")) return;
        isPanning.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseMove(e) {
        if (!isPanning.current) return;

        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;

        setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
        lastMouse.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseUp() {
        isPanning.current = false;
    }

    function handleWheel(e) {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom(z => Math.max(0.1, Math.min(5, z * factor)));
    }
    
    return (
        <>
            <BlueprintToolbar 
                onCreateFile={() => setFileModalOpen(true)} 
                onOpenApiTokenModal={() => setApiModalOpen(true)} 
            />

            <CreateFileModal
                open={fileModalOpen}
                onClose={() => setFileModalOpen(false)}
                onFinished={(nf) => {
                    addFileToUI(nf);
                    setFileModalOpen(false);
                }}
                camera={{ offset, zoom }}
            />

            <ApiTokenModal
                isOpen={apiModalOpen}
                onClose={() => setApiModalOpen(false)}
            />


            <div
                className="canvas-root"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
            >
                <div
                    className="canvas-world"
                    style={{
                        transform: `
                            translate(${offset.x}px, ${offset.y}px)
                            scale(${zoom})
                            translate(-50%, -50%)
                        `,
                    }}
                >
                    {files.map((f) => (
                        <BlueprintNode key={f.id} {...f} />
                    ))}
                </div>
            </div>
        </>
    );
}
