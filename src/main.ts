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
import { BackspaceHandler } from "./command/backspace.handler";
import { EnterHandler } from "./command/enter.handler";

const editorDiv = document.getElementById("@editor");
if (!(editorDiv instanceof HTMLDivElement)) {
    throw new Error("editor element not found");
}
editorDiv.setAttribute("contenteditable", "true");

const dom = new DomNode(editorDiv);
const vDom = VDomNode.createRootNode();

const selectionStateMachine = new SelectionStateMachine(editorDiv);
const sync = new Synchronizer(dom, vDom, selectionStateMachine);
const editor = new Editor(dom, vDom, sync);

// Create handlers for dependency injection
const backspaceHandler = new BackspaceHandler(sync);
const enterHandler = new EnterHandler(sync);

const compositionStateMachine = new CompositionStateMachine(editorDiv);
new Command(
    sync,
    editorDiv,
    compositionStateMachine,
    selectionStateMachine,
    backspaceHandler,
    enterHandler
);

new EditorDebugger(editor);
