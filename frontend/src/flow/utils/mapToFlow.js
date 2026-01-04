// src/blueprint/flow/utils/mapToFlow.js
import { GRID_STEP } from "../../constants/grid";

// Mappe les fichiers en nodes pour React Flow
export function mapFilesToNodes(files) {
  return files.map(f => ({
    id: String(f.id),
    type: "file",
    position: {
      x: (f.pos_x ?? 0) * GRID_STEP,
      y: (f.pos_y ?? 0) * GRID_STEP
    },
    data: {
      title: f.title,
      content: f.content,
      headerColor: f.headerColor ?? "#347bed"
    }
  }));
}

// Mappe les keywords en nodes pour React Flow
export function mapKeywordsToNodes(keywords) {
  return keywords.map(k => ({
    id: `kw-${k.id}`,
    type: "keyword",
    position: {
      x: (k.pos_x ?? 0) * GRID_STEP,
      y: (k.pos_y ?? 0) * GRID_STEP
    },
    data: {
      label: k.label,
      fileId: String(k.file_id),
      start: k.start_index,
      end: k.end_index
    }
  }));
}

// Mappe les keywords en edges pour React Flow
export function mapKeywordsToEdges(keywords) {
  return keywords
    .filter(k => k.file_id != null)
    .map(k => ({
      id: `e-kw-${k.id}-file-${k.file_id}`,
      source: `kw-${k.id}`,
      target: String(k.file_id),
      type: "keyword",
      animated: false
    }));
}

// Ajout des edges entre le noyau et les fichiers non liés à des keywords
export function buildCoreEdges(files) {
  return files.map(f => ({
    id: `e-core-${f.id}`,
    target: "core",
    source: String(f.id),
    type: "core"
  }));
}
