// frontend/src/components/file/CreateFileModal.jsx
import { useState } from "react";
import { createFile } from "../../api/files";
import RichTextEditor from "../richtext/RichTextEditor";
import "./CreateFileModal.css";

export default function CreateFileModal({ open, onClose, onFinished, camera }) {
    const [title, setTitle] = useState("");
    const [contentHtml, setContentHtml] = useState("");

    if (!open) return null; // ce pattern est OK, il ne fait PAS crasher React

    function handleCreate() {
        if (!title.trim()) return;

        const worldX = (2500 - camera.offset.x) / camera.zoom - 2500;
        const worldY = (2500 - camera.offset.y) / camera.zoom - 2500;

        const storedTitle = `${title}.txt`;

        createFile({
            title: storedTitle,
            content: contentHtml,
            x: worldX,
            y: worldY,
        }).then((file) => {
            onFinished(file);
        });
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Créer un fichier</h2>

                <label className="modal-label">Titre</label>
                <input
                    type="text"
                    className="modal-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre du fichier (sans extension)"
                />

                <label className="modal-label">Contenu initial</label>

                <RichTextEditor
                    initialText=""
                    placeholder="Contenu du fichier…"
                    onChangeHtml={setContentHtml}
                />

                <div className="modal-buttons">
                    <button className="btn-cancel" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="btn-create" onClick={handleCreate}>
                        Créer
                    </button>
                </div>
            </div>
        </div>
    );
}
