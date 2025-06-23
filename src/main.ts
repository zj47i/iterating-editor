import { Editor } from "./editor";
import "./main.css";
import "./debug";
import { DomNode } from "./dom/dom-node";
import { EditorDebugger } from "./debug";
import { VDomNode } from "./vdom/vdom-node";
import { Synchronizer } from "./syncronizer/syncronizer";
import { CompositionStateMachine } from "./state-machine/composition.state-machine";
import { SelectionStateMachine } from "./state-machine/selection.state-machine";
import { Command } from "./command/command";

const editorDiv = document.getElementById("@editor");
if (!(editorDiv instanceof HTMLDivElement)) {
    throw new Error("editor element not found");
}
editorDiv.setAttribute("contenteditable", "true");

const dom = new DomNode(editorDiv);
const vDom = VDomNode.createRootNode();
const sync = new Synchronizer(dom, vDom);
const editor = new Editor(dom, vDom, sync);

const compositionStateMachine = new CompositionStateMachine(editorDiv);
const selectionStateMachine = new SelectionStateMachine();
sync.setSelectionStateMachine(selectionStateMachine);
const command = new Command(sync, editorDiv, compositionStateMachine, selectionStateMachine);

new EditorDebugger(editor);
