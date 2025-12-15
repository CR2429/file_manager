import { useState, useEffect} from "react";
import { createFile } from "../../api/files";
import RichTextEditor from "../richtext/RichTextEditor";
import { GRID_STEP } from "../../constants/grid";
import "./CreateFileModal.css";

export default function CreateFileModal({ open, onClose, onFinished, stageRef }) {
    const [title, setTitle] = useState("");
    const [contentHtml, setContentHtml] = useState("");

    // Clear title
    useEffect(() => {
        if (open) {
            setTitle("");
            setContentHtml("");
        }
    }, [open]);
    
    if (!open) return null;
    
    function handleCreate() {
        if (!title.trim()) return;
        const stage = stageRef.current;
        if (!stage) return;

        // Centre écran
        const screenCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };

        // Conversion écran → monde via Konva
        const transform = stage.getAbsoluteTransform().copy().invert();
        const worldPos = transform.point(screenCenter);

        // Monde → grille
        const gridX = Math.round(worldPos.x / GRID_STEP);
        const gridY = Math.round(worldPos.y / GRID_STEP);

        createFile({
            title: `${title}.txt`,
            content: contentHtml,
            x: gridX,
            y: gridY,
        }).then(onFinished);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Créer un fichier</h2>

                <label className="modal-label">Titre</label>
                <input
                    className="modal-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre du fichier"
                />

                <label className="modal-label">Contenu</label>
                <RichTextEditor
                    initialText=""
                    onChange={setContentHtml}
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