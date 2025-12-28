import { useState } from "react";

export default function ApiTokenModal({ isOpen, onClose }) {
    const [token, setToken] = useState(localStorage.getItem("apiToken") || "");

    if (!isOpen) return null;

    //sauvegarde le token et recharge la page
    function handleSave() {
        localStorage.setItem("apiToken", token);
        window.location.reload();
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h3 className="modal-title">Configurer la clé API</h3>

                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Entrez votre clé"
                    style={{ width: "100%", marginTop: "10px" }}
                    className="modal-input"
                />

                <div className="modal-buttons">
                    <button onClick={onClose} className="btn-cancel">Annuler</button>
                    <button onClick={handleSave} className="btn-create">Enregistrer</button>
                </div>
            </div>
        </div>
    );
}
