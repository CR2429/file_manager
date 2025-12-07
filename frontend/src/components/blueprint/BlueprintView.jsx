import ReactFlow, { Background } from "reactflow";

export default function BlueprintView() {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ReactFlow>
                <Background color="#888" gap={20} />
            </ReactFlow>
        </div>
    );
}
