import { useRef, useState, useEffect } from "react";
import { getFiles } from "../api/files";

import BlueprintToolbar from "../components/toolbar/BlueprintToolbar";
import CreateFileModal from "../components/file/CreateFileModal";
import ApiTokenModal from "../components/token/ApiTokenModal";
import BlueprintCanvas from "../components/blueprint/BlueprintCanvas";

import "./BlueprintPage.css";

export default function BlueprintPage() {
    const [files, setFiles] = useState([]);
    const [fileModalOpen, setFileModalOpen] = useState(false);
    const [apiModalOpen, setApiModalOpen] = useState(false);

    const [connections, setConnections] = useState([]);

    // Camera state for Konva
    const [camera, setCamera] = useState({
        x: 0,
        y: 0,
        scale: 1
    });

    function addFileToUI(file) {
        const index = files.length;

        const node = {
            id: file.id,
            title: file.name || "Untitled",
            x: 200 + index * 50,
            y: 200 + index * 50,
            inputs: [],
            outputs: [{ id: "out1", color: "#4ea8de" }],
            rawFile: file
        };

        setFiles(prev => [...prev, node]);
    }

    useEffect(() => {
        async function load() {
            try {
                const data = await getFiles();
                if (!data) return;

                const nodes = data.map((file, index) => ({
                    id: file.id,
                    title: file.name || "Untitled",
                    x: 200 + index * 50,
                    y: 200 + index * 50,
                    inputs: [],
                    outputs: [{ id: "out1", color: "#4ea8de" }],
                    rawFile: file
                }));

                setFiles(nodes);
            } catch (err) {
                console.error("Erreur chargement fichiers :", err);
            }
        }
        load();
    }, []);

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
                camera={camera}
            />

            <ApiTokenModal
                isOpen={apiModalOpen}
                onClose={() => setApiModalOpen(false)}
            />

            <div className="blueprint-root">
                <BlueprintCanvas
                    files={files}
                    setFiles={setFiles}
                    connections={connections}
                    setConnections={setConnections}
                    camera={camera}
                    setCamera={setCamera}
                />
            </div>
        </>
    );
}
