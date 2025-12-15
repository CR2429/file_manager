import { useState, useEffect} from "react";
import { updateFileContent, deleteFile } from "../../api/files";
import RichTextEditor from "../richtext/RichTextEditor";
import "./EditFileModal.css";

export default function EditFileModal({ node, onClose, onSaved }) {
    const [title, setTitle] = useState("");
    const [contentHtml, setContentHtml] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Initialisation quand on ouvre le modal
    useEffect(() => {
        if (node) {
            setTitle(node.title?.replace(".txt", "") || "");
            setConfirmDelete(false);
        }
    }, [node]);
    
    if (!node) return null;
    
    async function handleDelete() {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        await deleteFile(node.id);
        onSaved();
    }

    async function handleSave() {
        const finalTitle = title.trim()
            ? title.trim().endsWith(".txt")
                ? title.trim()
                : `${title.trim()}.txt`
            : node.title;

        await updateFileContent(node.id, {
            title: finalTitle,
            content: contentHtml
        });

        onSaved();
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Éditer {title}</h2>

                <label className="modal-label">Titre</label>
                <input
                    className="modal-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre du fichier"
                />

                <label className="modal-label">Contenu</label>
                <RichTextEditor
                    key={node.id}
                    initialText={node.content || ""}
                    onChangeHtml={setContentHtml}
                />

                <div className="modal-buttons">
                    <button className="btn-cancel" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="btn-create" onClick={handleSave}>
                        Sauvegarder
                    </button>
                    <button className="btn-delete" onClick={handleDelete}>
                        {confirmDelete ? "Confirmer la suppression" : "Supprimer"}
                    </button>
                </div>
            </div>
        </div>
    );
}