import React, { useState } from "react";

export default function CreateFileModal({ onCreate, onCancel }) {
    const [title, setTitle] = useState("");

    const submit = () => {
        if (title.trim().length === 0) return;
        onCreate(title.trim());
        setTitle("");
    };

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20
            }}
        >
            <div
                style={{
                    background: "#ffffff",
                    padding: "30px 40px",
                    borderRadius: 12,
                    width: 380,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20
                }}
            >
                <h3 style={{ margin: 0, fontSize: 20, color: "#222", fontWeight: 600 }}>
                    Nouveau fichier
                </h3>

                <input
                    type="text"
                    placeholder="Titre du fichier"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        background: "#f2f2f2",
                        fontSize: 14,
                        outline: "none"
                    }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                        onClick={submit}
                        style={{
                            padding: "8px 16px",
                            background: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 14
                        }}
                    >
                        Créer
                    </button>

                    <button
                        onClick={onCancel}
                        style={{
                            padding: "8px 16px",
                            background: "#9e9e9e",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 14
                        }}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}
