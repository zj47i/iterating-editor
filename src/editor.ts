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
    public readonly domRoot: DomNode;
    public readonly vdomRoot: VDomNode;
    public readonly sync: Synchronizer;
    public readonly selectionStateMachine: SelectionStateMachine;
    public readonly compositionStateMachine: CompositionStateMachine;
    public readonly backspaceHandler: BackspaceHandler;
    public readonly enterHandler: EnterHandler;
    public readonly command: Command;

    constructor(editorId: string) {
        const editorDiv = this.getEditorDiv(editorId);
        this.enableContentEditable(editorDiv);

        this.domRoot = new DomNode(editorDiv);
        this.vdomRoot = VDomNode.createRootNode();
        this.selectionStateMachine = new SelectionStateMachine(editorDiv);
        this.compositionStateMachine = new CompositionStateMachine(editorDiv);
        this.sync = new Synchronizer(
            this.domRoot,
            this.vdomRoot,
            this.selectionStateMachine
        );
        this.appendInitialParagraph();
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

    // Resolve and validate editor root element
    private getEditorDiv(editorId: string): HTMLDivElement {
        const editorDiv = document.getElementById(editorId);
        if (!(editorDiv instanceof HTMLDivElement)) {
            throw new Error(
                `Editor element with id '${editorId}' not found or is not a div element`
            );
        }
        return editorDiv;
    }

    // Enable editing on the root element
    private enableContentEditable(editorDiv: HTMLDivElement): void {
        editorDiv.setAttribute("contenteditable", "true");
    }

    // Create initial paragraph in the VDOM/DOM
    private appendInitialParagraph(): void {
        this.sync.appendNewVDomNodeWithoutHook(
            this.vdomRoot,
            new VDomNode(VDomNodeType.PARAGRAPH)
        );
    }
}
