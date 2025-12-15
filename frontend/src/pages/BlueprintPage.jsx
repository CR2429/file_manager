// src/pages/BlueprintPage.jsx
import { useState, useEffect, useCallback } from "react";
import BlueprintCanvas from "../components/blueprint/BlueprintCanvas";
import BlueprintToolbar from "../components/toolbar/BlueprintToolbar";
import { getFiles, updateFilePosition } from "../api/files";
import { GRID_STEP } from "../constants/grid";

export default function BlueprintPage() {

    // Liste des nodes affichés dans l'éditeur Blueprint
    const [nodes, setNodes] = useState([]);

    // Liste des liens (sera utilisé plus tard)
    const [links, setLinks] = useState([]);

    // Caméra : position (x,y) + zoom (scale)
    // Cette caméra représente la position du Stage Konva dans l'espace
    const [camera, setCamera] = useState({
        x: 0,
        y: 0,
        scale: 1
    });

    // Mode d'interaction de l'utilisateur : select ou pan
    const [mode, setMode] = useState("pan");

    // Activation ou non de la grille d'arrière-plan
    const [gridEnabled, setGridEnabled] = useState(true);

    // Charger les nodes depuis ton backend
    useEffect(() => {
        async function load() {
            try {
                const data = await getFiles();
                if (!data) return;
                console.log("data : ", data);

                // On convertit les fichiers reçus en nodes affichables
                const loadedNodes = data.map(file => ({
                    id: file.id,
                    title: file.title,
                    type: "file",
                    headerColor: "#347bed",
                    content: file.content,

                    // conversion CASE → PIXEL
                    x: (file.pos_x ?? 0) * GRID_STEP,
                    y: (file.pos_y ?? 0) * GRID_STEP,

                    inputs: [],
                    outputs: []
                }));

                console.log("loadedNodes : ", loadedNodes);
                setNodes(loadedNodes);
            } catch (e) {
                console.error("Erreur lors du chargement des nodes :", e);
            }
        }

        load();
    }, []);

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
                onCreateFile={() => {}}
                onOpenApiTokenModal={() => {}}
            />

            {/* Canvas Blueprint (Konva) */}
            <BlueprintCanvas
                nodes={nodes}
                links={links}
                camera={camera}
                mode={mode}
                gridEnabled={gridEnabled}
                updateNodePosition={updateNodePosition}
                commitNodePosition={commitNodePosition}
                updateCamera={updateCamera}
            />
        </div>
    );
}
