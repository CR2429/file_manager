// src/blueprint/flow/nodes/CoreNode.jsx
import { Handle, Position } from "reactflow";

export default function CoreNode() {
  return (
    <div style={{
      width: 180,
      height: 60,
      borderRadius: 999,
      background: "radial-gradient(circle at top, #3b82f6, #1e3a8a)",
      color: "#eaf2ff",
      fontWeight: 900,
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      letterSpacing: 1,
      boxShadow: "0 0 40px rgba(59,130,246,0.6)",
      border: "1px solid rgba(255,255,255,0.15)"
    }}>
      NOYAU

      {/* Output uniquement */}
      <Handle
        type="target"
        position={Position.Right}
        style={{ width: 12, height: 12 }}
        isConnectable={true}
      />
    </div>
  );
}
