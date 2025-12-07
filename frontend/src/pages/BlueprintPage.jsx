import { ReactFlowProvider } from "reactflow";
import BlueprintView from "../components/blueprint/BlueprintView";
import CreateFileModal from "../components/modals/CreateFileModal";
import { getFiles, createFile, updateFilePosition } from "../api/files";
import { useState, useEffect } from "react";

export default function BlueprintPage() {
    const [files, setFiles] = useState([]);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        loadFiles();
    }, []);

    async function loadFiles() {
        const list = await getFiles();
        setFiles(list);
    }

    async function handleCreate(title) {
        await createFile(title, "");
        setShowCreate(false);
        loadFiles();
    }

    async function handleFilePositionChange(fileId, pos) {
        await updateFilePosition(fileId, pos);
    }

    return (
        <ReactFlowProvider>
            <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
                
                <button
                    onClick={() => setShowCreate(true)}
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        zIndex: 20,
                        padding: "8px 14px",
                        background: "#00aaff",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer"
                    }}
                >
                    + Nouveau fichier
                </button>

                {showCreate && (
                    <CreateFileModal
                        onCreate={handleCreate}
                        onCancel={() => setShowCreate(false)}
                    />
                )}

                <BlueprintView
                    files={files}
                    onFilePositionChange={handleFilePositionChange}
                />
            </div>
        </ReactFlowProvider>
    );
}
