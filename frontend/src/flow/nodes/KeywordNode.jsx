// src/blueprint/flow/nodes/KeywordNode.jsx
import { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";

export default function KeywordNode({ data }) {
  return (
    <div style={{
      width: 200,
      borderRadius: 999,
      border: "1px solid #30425c",
      background: "#111a28",
      color: "#e7f0ff",
      padding: "10px 14px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      fontSize: 12,
      fontWeight: 700
    }}>
      {data.label ?? "keyword"}

      {/* output */}
      <Handle type="source" position={Position.Right} style={{ width: 10, height: 10 }} isConnectable={true} />

      {/* input */}
      <Handle type="target" position={Position.Left} style={{ width: 10, height: 10 }} isConnectable={false} />
    </div>
  );
}
