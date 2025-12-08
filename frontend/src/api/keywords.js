import axios from "axios";

const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3001" // backend dev
        : ""; // en prod → même domaine

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "x-api-token": localStorage.getItem("apiToken") || ""
    }
});

export async function getKeywords() {
    const res = await api.get("/draft/keywords");
    return res.data;
}

export async function updateKeywordPosition(id, pos) {
    return api.patch("/draft/position", {
        type: "keyword",
        id,
        ...pos
    });
}