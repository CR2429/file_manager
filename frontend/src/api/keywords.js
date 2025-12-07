import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001",
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