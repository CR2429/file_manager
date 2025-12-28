import axios from "axios";

// -------------------------------
//  Sélection auto du backend
// -------------------------------
const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : "";

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
//  UTIL
// -------------------------------
function safeExtract(res) {
    return res?.data ?? null;
}

// -------------------------------
//  GET — Récupérer les keywords
//  - tous
//  - ou par fileId
// -------------------------------
export async function getDraftKeywords(fileId) {
    const res = await api.get("/draft/keywords", {
        params: fileId ? { fileId } : {}
    });
    return safeExtract(res);
}

// -------------------------------
//  POST — Créer un keyword
// -------------------------------
export async function createDraftKeyword(payload) {
    const res = await api.post("/draft/keywords/create", payload);
    return safeExtract(res);
}

// -------------------------------
//  PATCH — Mettre à jour la position d'un keyword
// -------------------------------
export async function updateDraftKeywordPosition(id, pos_x, pos_y) {
    const res = await api.patch(`/draft/keywords/${id}/position`, {
        pos_x,
        pos_y
    });

    return safeExtract(res);
}

// -------------------------------
//  PATCH — Mettre à jour un keyword
// -------------------------------
export async function updateDraftKeyword(id, payload) {
    const res = await api.patch(`/draft/keywords/${id}`, payload);
    return safeExtract(res);
}

// -------------------------------
//  DELETE — Supprimer un keyword
// -------------------------------
export async function deleteDraftKeyword(id) {
    const res = await api.delete(`/draft/keywords/${id}`);
    return safeExtract(res);
}
