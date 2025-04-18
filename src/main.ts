import { Editor } from "./editor";
import "./main.css";
import "./debug";
import { DomNode } from "./dom/dom-node";
import { EditorDebugger } from "./debug";
import { VDomNode } from "./vdom/vdom-node";
import { Synchronizer } from "./syncronizer/syncronizer";

const editorDiv = document.getElementById("@editor");
if (!(editorDiv instanceof HTMLDivElement)) {
    throw new Error("editor element not found");
}

const dom = new DomNode(editorDiv);
dom.getElement().setAttribute("contenteditable", "true");
const vDom = VDomNode.createRootNode();
const sync = new Synchronizer(dom, vDom);
const editor = new Editor(dom, vDom, sync);


new EditorDebugger(editor);
