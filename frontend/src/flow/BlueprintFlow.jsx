// src/blueprint/flow/BlueprintFlow.jsx
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { ReactFlow, Background, applyNodeChanges, applyEdgeChanges, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import FileNode from "./nodes/FileNode";
import KeywordNode from "./nodes/KeywordNode";
import { mapFilesToNodes, mapKeywordsToNodes, mapKeywordsToEdges, buildCoreEdges } from "./utils/mapToFlow";
import { getFiles, updateFilePosition } from "../api/files";
import { getDraftKeywords, updateDraftKeywordPosition } from "../api/keywords";
import CoreNode from "./nodes/CoreNode";
import BlueprintControls from "./BlueprintControls";
import ApiTokenModal from "../components/token/ApiTokenModal";
import EditFileModal from "../components/file/EditFileModal";
import { createFile } from "../api/files";

export default function BlueprintFlow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [apiTokenModalOpen, setApiTokenModalOpen] = useState(false);
  const [editNode, setEditNode] = useState(null);
  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef(null);


  const nodeTypes = useMemo(() => ({
    file: FileNode,
    keyword: KeywordNode,
    core: CoreNode
  }), []);

  const onConnectStart = useCallback((_event, params) => {
    connectingNodeId.current = params.nodeId;
  }, []);
  
  const onConnectEnd = useCallback(
    async (event) => {
      if (!connectingNodeId.current) return;

      // sécurité : uniquement depuis le NOYAU
      if (connectingNodeId.current !== "core") {
        connectingNodeId.current = null;
        return;
      }

      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;

      const pos = screenToFlowPosition({ x: clientX, y: clientY });

      const snapped = {
        x: Math.round(pos.x / 24) * 24,
        y: Math.round(pos.y / 24) * 24,
      };
      console.log("Creating file at:", snapped);

      const file = await createFile({
        title: "",
        content: "",
        pos_x: snapped.x / 24,
        pos_y: snapped.y / 24,
      });

      if (!file) return;

      setNodes((nds) => [
        ...nds,
        {
          id: file.id,
          type: "file",
          position: snapped,
          data: { fileId: file.id }
        }
      ]);

      setEdges((eds) => [
        ...eds,
        {
          id: `e-core-${file.id}`,
          source: "core",
          target: file.id
        }
      ]);

      connectingNodeId.current = null;
      loadAll();
    },
    [screenToFlowPosition]
  );


  const onConnect = useCallback(() => {
    // volontairement vide
  }, []);

  const loadAll = useCallback(async () => {
    const files = await getFiles();
    const keywords = await getDraftKeywords();

    const fileNodes = mapFilesToNodes(files ?? [], (fileId) => {
      const node = files.find(f => String(f.id) === String(fileId));
      if (node) {
        setEditNode(node);
      }
    });
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
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onConnectStart={onConnectStart}
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

      {editNode && (
        <EditFileModal
          node={editNode}
          onClose={() => setEditNode(null)}
          onSaved={() => {
            setEditNode(null);
            loadAll();
          }}
        />
      )}

    </div>
  );
}
