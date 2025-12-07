import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "x-api-token": localStorage.getItem("apiToken") || ""
    }
});

export async function getFiles() {
    const res = await api.get("/draft/files");
    return res.data;
}

export async function updateFilePosition(id, pos) {
    return api.patch("/draft/position", {
        type: "file",
        id,
        ...pos
    });
}

export async function createFile(title, content = "") {
    const res = await api.post("/draft/files/create", {
        title,
        content
    });
    return res.data;
}

