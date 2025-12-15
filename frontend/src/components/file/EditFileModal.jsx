import { useState, useEffect} from "react";
import { updateFileContent, deleteFile } from "../../api/files";
import { getDraftKeywords, createDraftKeyword, updateDraftKeyword, deleteDraftKeyword } from "../../api/keywords";
import RichTextEditor from "../richtext/RichTextEditor";
import "./EditFileModal.css";

export default function EditFileModal({ node, onClose, onSaved }) {
    const [title, setTitle] = useState("");
    const [editorData, setEditorData] = useState({
        html: "",
        keywords: []
    });
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

        // 1️⃣ Sauver le fichier
        await updateFileContent(node.id, {
            title: finalTitle,
            content: editorData.html
        });

        // 2️⃣ Synchroniser les keywords
        await syncKeywords(node.id, editorData.keywords);

        onSaved();
    }


    async function syncKeywords(fileId, incomingKeywords) {
        const existing = await getDraftKeywords(fileId);

        const keyOf = k => `${k.start_index}-${k.end_index}`;

        const existingMap = new Map(
            existing.map(k => [keyOf(k), k])
        );

        const incomingMap = new Map(
            incomingKeywords.map(k => [keyOf(k), k])
        );

        // 🗑 SUPPRESSION : keywords supprimés du texte
        for (const [key, kw] of existingMap) {
            if (!incomingMap.has(key)) {
                await deleteDraftKeyword(kw.id);
            }
        }

        // ➕ CRÉATION : nouveaux keywords
        for (const [key, kw] of incomingMap) {
            if (!existingMap.has(key)) {
                await createDraftKeyword({
                    fileId,
                    label: kw.label,
                    start_index: kw.start_index,
                    end_index: kw.end_index
                });
            }
        }
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
                    onChange={setEditorData}
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