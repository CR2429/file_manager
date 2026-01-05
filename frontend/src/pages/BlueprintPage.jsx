// src/pages/BlueprintPage.jsx
import BlueprintFlow from "../flow/BlueprintFlow";
import { ReactFlowProvider } from "reactflow";

export default function BlueprintPage() {
  return (
    <ReactFlowProvider>
      <BlueprintFlow />
    </ReactFlowProvider>
  );
}