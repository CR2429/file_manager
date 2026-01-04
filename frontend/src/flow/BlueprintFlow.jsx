// src/blueprint/flow/BlueprintFlow.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, applyNodeChanges, applyEdgeChanges} from "reactflow";
import "reactflow/dist/style.css";
import FileNode from "./nodes/FileNode";
import KeywordNode from "./nodes/KeywordNode";
import { mapFilesToNodes, mapKeywordsToNodes, mapKeywordsToEdges, buildCoreEdges } from "./utils/mapToFlow";
import { getFiles, updateFilePosition } from "../api/files";
import { getDraftKeywords, updateDraftKeywordPosition } from "../api/keywords";
import CoreNode from "./nodes/CoreNode";
import BlueprintControls from "./BlueprintControls";
import ApiTokenModal from "../components/token/ApiTokenModal";

export default function BlueprintFlow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [apiTokenModalOpen, setApiTokenModalOpen] = useState(false);
  
  const nodeTypes = useMemo(() => ({
    file: FileNode,
    keyword: KeywordNode,
    core: CoreNode
  }), []);


  const loadAll = useCallback(async () => {
    const files = await getFiles();
    const keywords = await getDraftKeywords();

    const fileNodes = mapFilesToNodes(files ?? []);
    const keywordNodes = mapKeywordsToNodes(keywords ?? []);
    const keywordEdges = mapKeywordsToEdges(keywords ?? []);
    const coreEdges = buildCoreEdges(files, keywords);
    
    
    const CORE_NODE = {
      id: "core",
      type: "core",
      position: { x: 0, y: 0 },
      data: {},
      draggable: false,
      selectable: false
    };

    setNodes([
      CORE_NODE,
      ...fileNodes,
      ...keywordNodes
    ]);

    setEdges([
      ...keywordEdges,
      ...coreEdges
    ]);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Sauvegarde la nouvelle position d'un node après déplacement
  const onNodeDragStop = useCallback(async (_evt, node) => {
    if (node.id === "core") return;
    const isKeyword = node.id.startsWith("kw-");

    const pos_x = Math.round(node.position.x / 24);
    const pos_y = Math.round(node.position.y / 24);

    try {
      if (isKeyword) {
        const keywordId = node.id.replace("kw-", "");
        await updateDraftKeywordPosition(keywordId, pos_x, pos_y);
      } else {
        await updateFilePosition(node.id, pos_x, pos_y);
      }
    } catch (e) {
      console.error("Erreur sauvegarde position:", e);
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", background: "#0b1220" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background gap={24} size={1} />
        <BlueprintControls
          onOpenApiTokenModal={() => setApiTokenModalOpen(true)}
        />

        <ApiTokenModal
                isOpen={apiTokenModalOpen}
                onClose={() => setApiTokenModalOpen(false)}
            />
      </ReactFlow>
    </div>
  );
}
