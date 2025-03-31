import { Editor } from "./editor";
import "./style.css";
import "./debug";
import { DomNode } from "./dom/dom-node";
import { EditorDebugger } from "./debug";

const editorDiv = document.getElementById("@editor");
if (!(editorDiv instanceof HTMLDivElement)) {
    console.error("editor element not found");
    throw new Error("editor element not found");
}

const dom = new DomNode(editorDiv);

const editor = new Editor(dom);

const a = new EditorDebugger(editor);
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "d") {
        event.preventDefault(); // 브라우저 기본 Ctrl+D 동작 방지
        console.log(a.printTree())
    }
});