import ToolbarButton from "./ToolbarButton";

export default function BlueprintToolbar({
    onCreateFile,
    onModePan,
    onModeSelect,
    onZoomIn,
    onZoomOut,
    onResetView,
    onToggleGrid,
    mode,
    gridEnabled,
    onOpenApiTokenModal
}) {
    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                left: "20px",
                background: "#222",
                padding: "12px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                zIndex: 1000,
                border: "1px solid #444",
            }}
        >
            {/* Création */}
            <ToolbarButton
                icon="+"
                label="Fichier"
                onClick={onCreateFile}
            />

            <div style={{ height: "1px", background: "#555", margin: "6px 0" }} />

            {/* Mode caméra verrouillée / libre */}
            <ToolbarButton
                icon={mode === "pan" ? "🔓" : "🔒"}
                label={mode === "pan" ? "Camera libre" : "Camera verrouillée"}
                active={mode != "pan"}             
                onClick={() => {
                    if (mode === "pan") {
                        onModeSelect();  // bascule vers cámaras verrouillée
                    } else {
                        onModePan();     // bascule vers cámaras libre
                    }
                }}
            />

            <div style={{ height: "1px", background: "#555", margin: "6px 0" }} />

            {/* Zoom */}
            <ToolbarButton
                icon="＋"
                label="Zoom +"
                onClick={onZoomIn}
            />
            <ToolbarButton
                icon="−"
                label="Zoom -"
                onClick={onZoomOut}
            />
            <ToolbarButton
                icon="◎"
                label="Reset"
                onClick={onResetView}
            />

            <div style={{ height: "1px", background: "#555", margin: "6px 0" }} />

            {/* Grille */}
            <ToolbarButton
                icon="▫"
                label={gridEnabled ? "Grille ON" : "Grille OFF"}
                active={!gridEnabled}
                onClick={onToggleGrid}
            />

            <div style={{ height: "1px", background: "#555", margin: "6px 0" }} />

            {/* API Token */}
            <ToolbarButton
                icon="🔑"
                label="API Token"
                onClick={onOpenApiTokenModal}
            />

        </div>
    );
}
