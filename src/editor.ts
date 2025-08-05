import { DomNode } from "./dom/dom-node";
import { VDomNode } from "./vdom/vdom-node";
import { Synchronizer } from "./syncronizer/syncronizer";
import { CompositionStateMachine } from "./state-machine/composition.state-machine";
import { SelectionStateMachine } from "./state-machine/selection.state-machine";
import { Command } from "./command/command";
import { BackspaceHandler } from "./command/backspace.handler";
import { EnterHandler } from "./command/enter.handler";
import { VDomNodeType } from "./vdom/vdom-node.enum";

export class Editor {
    public domRoot: DomNode;
    public vdomRoot: VDomNode;
    public sync: Synchronizer;
    public selectionStateMachine: SelectionStateMachine;
    public compositionStateMachine: CompositionStateMachine;
    public backspaceHandler: BackspaceHandler;
    public enterHandler: EnterHandler;
    public command: Command;

    constructor(editorId: string) {
        const editorDiv = document.getElementById(editorId);
        if (!(editorDiv instanceof HTMLDivElement)) {
            throw new Error("editor element not found");
        }
        editorDiv.setAttribute("contenteditable", "true");

        this.domRoot = new DomNode(editorDiv);
        this.vdomRoot = VDomNode.createRootNode();
        this.selectionStateMachine = new SelectionStateMachine(editorDiv);
        this.compositionStateMachine = new CompositionStateMachine(editorDiv);
        this.sync = new Synchronizer(
            this.domRoot,
            this.vdomRoot,
            this.selectionStateMachine
        );
        this.sync.appendNewVDomNodeWithoutHook(
            this.vdomRoot,
            new VDomNode(VDomNodeType.PARAGRAPH)
        );
        this.backspaceHandler = new BackspaceHandler(this.sync);
        this.enterHandler = new EnterHandler(this.sync);
        this.command = new Command(
            this.sync,
            editorDiv,
            this.compositionStateMachine,
            this.selectionStateMachine,
            this.backspaceHandler,
            this.enterHandler
        );
    }
}
