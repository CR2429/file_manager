// src/pages/BlueprintPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import BlueprintCanvas from "../components/blueprint/BlueprintCanvas";
import BlueprintToolbar from "../components/toolbar/BlueprintToolbar";
import { getFiles, updateFilePosition } from "../api/files";
import { GRID_STEP } from "../constants/grid";
import CreateFileModal from "../components/file/CreateFileModal";
import EditFileModal from "../components/file/EditFileModal";


export default function BlueprintPage() {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [camera, setCamera] = useState({
        x: 0,
        y: 0,
        scale: 1
    });
    const [mode, setMode] = useState("pan");
    const [gridEnabled, setGridEnabled] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [editNode, setEditNode] = useState(null);
    const stageRef = useRef(null);


    // Charger les nodes depuis ton backend
    const loadNodes = useCallback(async () => {
        try {
            const data = await getFiles();
            if (!data) return;

            const loadedNodes = data.map(file => ({
                id: file.id,
                title: file.title,
                type: "file",
                headerColor: "#347bed",
                content: file.content,

                x: (file.pos_x ?? 0) * GRID_STEP,
                y: (file.pos_y ?? 0) * GRID_STEP,

                inputs: [],
                outputs: []
            }));

            setNodes(loadedNodes);
        } catch (e) {
            console.error("Erreur lors du chargement des nodes :", e);
        }
    }, []);

    useEffect(() => {
        loadNodes();
    }, [loadNodes]);



    // Lorsque l'utilisateur déplace un node, cette fonction est appelée
    const updateNodePosition = useCallback((id, x, y) => {
        setNodes(prev =>
            prev.map(n => n.id === id ? { ...n, x, y } : n)
        );
    }, []);

    const commitNodePosition = useCallback(async (id, gridX, gridY) => {
        try {
            await updateFilePosition(id, gridX, gridY);
        } catch (e) {
            console.error("Erreur sauvegarde position :", e);
        }
    }, []);

    // Mettre à jour la caméra et sauvegarder sa position dans localStorage
    const updateCamera = useCallback((patch) => {
        setCamera(prev => {
            const updated = { ...prev, ...patch };
            localStorage.setItem("blueprintCamera", JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Au lancement : restaurer la caméra sauvegardée
    useEffect(() => {
        const saved = localStorage.getItem("blueprintCamera");
        if (saved) {
            setCamera(JSON.parse(saved));
        }
    }, []);

    // Fonctions de la toolbar (zoom, reset, grille)
    const zoomStep = 1.1;

    const handleZoomIn = () => updateCamera({ scale: camera.scale * zoomStep });
    const handleZoomOut = () => updateCamera({ scale: camera.scale / zoomStep });
    const handleResetView = () => updateCamera({ x: 0, y: 0, scale: 1 });
    const handleToggleGrid = () => setGridEnabled(g => !g);

    

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>

            {/* Toolbar flottante (boutons de création, zoom, grille, etc.) */}
            <BlueprintToolbar
                mode={mode}
                gridEnabled={gridEnabled}
                onModeSelect={() => setMode("select")}
                onModePan={() => setMode("pan")}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
                onToggleGrid={handleToggleGrid}
                onCreateFile={() => setCreateOpen(true)}
                onOpenApiTokenModal={() => {}}
            />

            {/* Canvas Blueprint (Konva) */}
            <BlueprintCanvas
                stageRef={stageRef}
                nodes={nodes}
                links={links}
                camera={camera}
                mode={mode}
                gridEnabled={gridEnabled}
                updateNodePosition={updateNodePosition}
                commitNodePosition={commitNodePosition}
                updateCamera={updateCamera}
                onEditNode={(node) => setEditNode(node)}
            />

            <CreateFileModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onFinished={() => {
                    setCreateOpen(false);
                    loadNodes();
                }}
                stageRef={stageRef}
            />

            <EditFileModal
                node={editNode}
                onClose={() => setEditNode(null)}
                onSaved={() => {
                    setEditNode(null);
                    loadNodes();
                }}
            />
        </div>
    );
}
