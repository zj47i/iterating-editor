import { Editor } from "./editor";
import "./style.css";
import "./debug";
import { DomNode } from "./dom/dom-node";

const editorDiv = document.getElementById("@editor");
if (!(editorDiv instanceof HTMLDivElement)) {
    console.error("editor element not found");
    throw new Error("editor element not found");
}

const dom = new DomNode(editorDiv);

new Editor(dom);
