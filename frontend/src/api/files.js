import axios from "axios";

// -------------------------------
//  Sélection auto du backend
// -------------------------------
const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3001"   // backend dev
        : "";                       // production → même domaine

// -------------------------------
//  Instance Axios configurée
// -------------------------------
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
        "x-api-token": localStorage.getItem("apiToken") || ""
    }
});

// -------------------------------
//  UTIL: meilleure gestion des erreurs
// -------------------------------
function safeExtract(res) {
    return res?.data ?? null;
}

// -------------------------------
//  GET — Récupérer tous les fichiers
// -------------------------------
export async function getFiles() {
    const res = await api.get("/draft/files");
    return safeExtract(res);
}

// -------------------------------
//  POST — Créer un fichier
// -------------------------------
export async function createFile(content) {
    const res = await api.post("/draft/files/create", {
        title: content.title,
        pos_x: content.x,
        pos_y: content.y,
        pos_z: 0,
        content: content.content
    });

    return safeExtract(res);
}

// -------------------------------
//  PATCH — Mettre à jour position
// -------------------------------
export async function updateFilePosition(id, pos_x, pos_y) {
    const res = await api.patch(`/draft/files/${id}/position`, {
        pos_x,
        pos_y
    });

    return safeExtract(res);
}

// -------------------------------
//  PATCH — Mettre à jour le contenu du fichier
// -------------------------------
export async function updateFileContent(id, { title, content }) {
    const res = await api.patch(`/draft/files/${id}/content`, {
        title,
        content
    });

    return safeExtract(res);
}

// -------------------------------
//  DELETE — Supprimer un fichier
// -------------------------------
export async function deleteFile(id) {
    const res = await api.delete(`/draft/files/${id}`);
    return safeExtract(res);
}
