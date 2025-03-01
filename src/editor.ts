import { Command } from "./command/command";
import { StateNode } from "./state-node/state-node";
import { StateNodeType } from "./state-node/state-node.enum";
import { Synchronizer } from "./syncronizer/syncronizer";

export class Editor {
    private state: StateNode;
    private sync: Synchronizer;
    private command: Command;

    constructor(private editorRoot: HTMLDivElement) {
        this.editorRoot.contentEditable = "true";
        this.state = StateNode.createRootState();
        this.sync = new Synchronizer(editorRoot, this.state);
        this.updateSelection();

        const paragraphStateNode = new StateNode(StateNodeType.PARAGRAPH);
        this.sync.appendStateNode(this.state, paragraphStateNode);

        this.command = new Command(this.editorRoot, this.state, this.sync);
        this.addEventListener();
    }

    updateSelection() {
        setInterval(() => {
            const selection = getSelection();
            const s = document.getElementById("@selection");
            s.innerHTML = `anchorNode: ${selection.anchorNode.nodeName}<br>
                anchorOffset: ${selection.anchorOffset}<br>
                focusNode: ${selection.focusNode.nodeName}<br>
                focusOffset: ${selection.focusOffset}`;
        }, 200);
    }

    addEventListener() {
        this.editorRoot.addEventListener("keydown", (event) => {
            console.log("keydown event:", event);
            if (!(event instanceof KeyboardEvent)) {
                console.error("event is not KeyboardEvent");
                return;
            }
            this.command.keydown(event);
        });

        this.editorRoot.addEventListener("input", (event) => {
            console.log("input event:", event);
            if (!(event instanceof InputEvent)) {
                console.error("event is not InputEvent");
                return;
            }
            this.command.input(event as any);
        });
    }
}
