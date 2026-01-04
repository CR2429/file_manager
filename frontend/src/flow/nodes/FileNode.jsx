// src/blueprint/flow/nodes/FileNode.jsx
import { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";

export default function FileNode({ data }) {
  const headerColor = data.headerColor ?? "#347bed";

  return (
    <div style={{
      width: 260,
      borderRadius: 10,
      border: "1px solid #2a3a52",
      background: "#0f1724",
      color: "#dbe7ff",
      boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
      overflow: "hidden"
    }}>
      <div style={{
        padding: "10px 12px",
        background: headerColor,
        color: "#06101f",
        fontWeight: 800,
        fontSize: 14
      }}>
        {data.title ?? "Untitled"}
      </div>

      <div style={{ padding: 12, fontSize: 12, lineHeight: 1.35, opacity: 0.9 }}>
        {data.content ? String(data.content).slice(0, 180) : "No content"}
      </div>
      
      {/* output */}
      <Handle type="target" position={Position.Right} style={{ width: 10, height: 10 }} isConnectable={false} />

      {/* input */}
      <Handle type="source" position={Position.Left} style={{ width: 10, height: 10 }} isConnectable={true} />
    </div>
  );
}
