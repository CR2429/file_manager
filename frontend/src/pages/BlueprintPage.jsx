// src/pages/BlueprintPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import BlueprintCanvas from "../components/blueprint/BlueprintCanvas";
import BlueprintToolbar from "../components/toolbar/BlueprintToolbar";
import { getFiles, updateFilePosition } from "../api/files";
import { getDraftKeywords } from "../api/keywords";
import { GRID_STEP } from "../constants/grid";
import CreateFileModal from "../components/file/CreateFileModal";
import EditFileModal from "../components/file/EditFileModal";
import { updateDraftKeyword } from "../api/keywords";


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
    const [keywords, setKeywords] = useState([]);


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

    async function loadKeywords() {
        try {
            const data = await getDraftKeywords();

            const keywordNodes = data.map(kw => ({
                id: kw.id,
                type: "keyword",
                label: kw.label,
                fileId: kw.file_id,

                x: (kw.pos_x ?? 0) * GRID_STEP,
                y: (kw.pos_y ?? 0) * GRID_STEP,

                headerColor: "#9b59b6",
                inputs: [],
                outputs: []
            }));

            setKeywords(keywordNodes);
        } catch (err) {
            console.error("Erreur chargement keywords :", err);
        }
    }



    useEffect(() => {
        loadKeywords();
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

    const commitKeywordPosition = useCallback(async (id, gridX, gridY) => {
    try {
        await updateDraftKeyword(id, {
            pos_x: gridX,
            pos_y: gridY
        });
    } catch (e) {
        console.error("Erreur sauvegarde position keyword :", e);
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
                nodes={[...nodes, ...keywords]}
                links={links}
                camera={camera}
                mode={mode}
                gridEnabled={gridEnabled}
                updateNodePosition={updateNodePosition}
                commitNodePosition={commitNodePosition}
                updateCamera={updateCamera}
                onEditNode={(node) => setEditNode(node)}
                keywords={keywords}
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
