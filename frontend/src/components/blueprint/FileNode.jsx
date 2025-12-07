import React from "react";

export default function FileNode({ data }) {
    return (
        <div
            style={{
                background: "#e3ecf7",
                border: "2px solid #b9c7d5",
                borderRadius: 10,
                padding: "10px 15px",
                fontFamily: "serif",
                fontSize: 14,
                boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                cursor: "grab",
                minWidth: 120,
                textAlign: "center"
            }}
        >
            {data.title}
        </div>
    );
}
