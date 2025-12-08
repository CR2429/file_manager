// frontend/src/components/richtext/RichTextEditor.jsx
import React, { useCallback, useMemo } from "react";
import { createEditor, Text, Editor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import "./RichTextEditor.css";

/**
 * Editeur riche réutilisable
 * - Toolbar intégrée (B / I / U)
 * - Utilise Slate (uncontrolled) pour gérer le texte
 * - Emet du HTML via onChangeHtml à chaque changement
 *
 * Props:
 *  - initialText?: string
 *  - onChangeHtml?: (html: string) => void
 *  - placeholder?: string
 */
export default function RichTextEditor({
    initialText = "",
    onChangeHtml,
    placeholder = "Contenu…",
}) {
    // Instance unique de l'editor
    const editor = useMemo(
        () => withHistory(withReact(createEditor())),
        []
    );

    // Valeur de départ  → uniquement utilisée à la MONTÉE du composant
    const initialValue = useMemo(() => {
        if (typeof initialText !== "string") {
            initialText = "";
        }
        return [
            {
                type: "paragraph",
                children: [{ text: initialText }],
            },
        ];
    }, [initialText]);

    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

    // Slate gère sa propre value en interne (UNCONTROLLED)
    // Nous, on récupère juste la value pour générer du HTML
    const handleChange = useCallback(
        (newValue) => {
            if (!onChangeHtml) return;

            const html = newValue
                .map((node) => serializeNode(node) || "")
                .join("");

            onChangeHtml(html.trim());
        },
        [onChangeHtml]
    );

    return (
        <div className="rte-root">
            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={handleChange}
            >
                {/* Toolbar intégrée */}
                <Toolbar />

                {/* Zone éditable */}
                <Editable
                    className="rte-editor"
                    placeholder={placeholder}
                    renderLeaf={renderLeaf}
                    spellCheck
                    autoFocus
                />
            </Slate>
        </div>
    );
}

/* =======================
 * Toolbar + boutons
 * ======================= */

function Toolbar() {
    return (
        <div className="rte-toolbar">
            <MarkButton format="bold">
                <b>B</b>
            </MarkButton>
            <MarkButton format="italic">
                <i>I</i>
            </MarkButton>
            <MarkButton format="underline">
                <u>U</u>
            </MarkButton>

            {/* plus tard : bouton "Keyword" ici */}
        </div>
    );
}

function MarkButton({ format, children }) {
    const editor = useSlate();
    const active = isMarkActive(editor, format);

    return (
        <button
            type="button"
            className={`rte-btn ${active ? "rte-btn-active" : ""}`}
            onMouseDown={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            {children}
        </button>
    );
}

/* =======================
 * Leaf (= rendu d’un fragment de texte)
 * ======================= */

function Leaf({ attributes, children, leaf }) {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
        children = <em>{children}</em>;
    }
    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
}

/* =======================
 * Helpers Slate (marks)
 * ======================= */

function toggleMark(editor, format) {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
}

function isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
}

/* =======================
 * Sérialisation -> HTML simple
 * ======================= */

function serializeNode(node) {
    // -------- TEXT NODE ----------
    if (Text.isText(node)) {
        const safe = typeof node.text === "string" ? node.text : "";
        let text = escapeHtml(safe);

        if (node.bold) text = `<b>${text}</b>`;
        if (node.italic) text = `<i>${text}</i>`;
        if (node.underline) text = `<u>${text}</u>`;

        return text;
    }

    // -------- ELEMENT NODE ----------
    if (!node || !node.children) {
        return "";
    }

    const children = node.children
        .map((child) => serializeNode(child) || "")
        .join("");

    switch (node.type) {
        case "paragraph":
        default:
            return children;
    }
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
