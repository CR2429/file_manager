export default function ToolbarButton({ icon, label, onClick, active }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px",
                marginBottom: "8px",
                background: active ? "#1e90ff" : "#333",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                userSelect: "none",
            }}
        >
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{icon}</div>
            {label}
        </button>
    );
}
