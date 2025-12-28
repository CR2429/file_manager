// src/pages/BlueprintPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import BlueprintCanvas from "../components/blueprint/BlueprintCanvas";
import BlueprintToolbar from "../components/toolbar/BlueprintToolbar";
import { getFiles, updateFilePosition } from "../api/files";
import { getDraftKeywords } from "../api/keywords";
import { GRID_STEP } from "../constants/grid";
import CreateFileModal from "../components/file/CreateFileModal";
import EditFileModal from "../components/file/EditFileModal";
import ApiTokenModal from "../components/token/ApiTokenModal";
 

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
    const [apiTokenModalOpen, setApiTokenModalOpen] = useState(false);


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
                outputs: [
                    {
                        id: `out-keywords-${file.id}`,
                        type: "keyword"
                    }
                ]
            }));

            setNodes(loadedNodes);
        } catch (e) {
            console.error("Erreur lors du chargement des nodes :", e);
        }
    }, []);
    
    const loadKeywords = useCallback(async () => {
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
                inputs: [
                    {
                        id: `in-parent-${kw.id}`,
                        from: kw.file_id
                    }
                ],
                outputs: []
            }));

            setKeywords(keywordNodes);
        } catch (err) {
            console.error("Erreur chargement keywords :", err);
        }
    }, []);

    useEffect(() => {
        loadNodes();
        loadKeywords();
    }, [loadNodes, loadKeywords]);


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

    // Construire les liens entre fichiers et keywords
    function buildKeywordLinks(files, keywords) {
        return keywords.flatMap(keyword =>
            keyword.inputs
                .filter(input =>
                    files.some(file => file.id === input.from)
                )
                .map(input => ({
                    id: `${input.from}->${keyword.id}`,
                    from: input.from,
                    to: keyword.id,
                    fromPort: `out-keywords-${input.from}`,
                    toPort: input.id,
                    type: "keyword"
                }))
        );
    }
    useEffect(() => {
        if (!nodes.length || !keywords.length) return;

        const generatedLinks = buildKeywordLinks(nodes, keywords);
        setLinks(generatedLinks);
    }, [nodes, keywords]);
    useEffect(() => {
        console.log("FILES:", nodes);
        console.log("KEYWORDS:", keywords);
        console.log("LINKS:", links);
    }, [links]);

    // Gérer le déplacement d'un node (fichier ou keyword)
    function handleMoveNode(id, x, y, type) {
        if (type === "file") {
            setNodes(prev =>
                prev.map(n =>
                    n.id === id ? { ...n, x, y } : n
                )
            );
        }

        if (type === "keyword") {
            setKeywords(prev =>
                prev.map(k =>
                    k.id === id ? { ...k, x, y } : k
                )
            );
        }
    } 

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
                onOpenApiTokenModal={() => setApiTokenModalOpen(true)}
            />

            {/* Canvas Blueprint (Konva) */}
            <BlueprintCanvas
                stageRef={stageRef}
                nodes={nodes}
                links={links}
                camera={camera}
                mode={mode}
                gridEnabled={gridEnabled}
                updateCamera={updateCamera}
                onEditNode={(node) => setEditNode(node)}
                keywords={keywords}
                onMoveNode={handleMoveNode}
            />

            <CreateFileModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onFinished={() => {
                    setCreateOpen(false);
                    loadNodes();
                    loadKeywords();
                }}
                stageRef={stageRef}
            />

            <EditFileModal
                node={editNode}
                onClose={() => setEditNode(null)}
                onSaved={() => {
                    setEditNode(null);
                    loadNodes();
                    loadKeywords();
                }}
            />

            <ApiTokenModal
                isOpen={apiTokenModalOpen}
                onClose={() => setApiTokenModalOpen(false)}
            />

        </div>
    );
}
