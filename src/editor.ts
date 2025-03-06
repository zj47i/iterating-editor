import { Command } from "./command/command";
import { StateNode } from "./vdom/state-node";
import { StateNodeType } from "./vdom/state-node.enum";
import { Synchronizer } from "./syncronizer/syncronizer";

export class Editor {
    private vdom: StateNode;
    private sync: Synchronizer;
    private command: Command;

    constructor(private dom: HTMLDivElement) {
        this.dom.contentEditable = "true";
        this.vdom = StateNode.createRootState();
        this.sync = new Synchronizer(dom, this.vdom);

        const paragraphStateNode = new StateNode(StateNodeType.PARAGRAPH);
        this.sync.appendStateNode(this.vdom, paragraphStateNode);

        this.command = new Command(this.dom, this.vdom, this.sync);
        this.addEventListener();
    }

    addEventListener() {
        this.dom.addEventListener("keydown", (event) => {
            console.log("keydown event:", event);
            if (!(event instanceof KeyboardEvent)) {
                console.error("event is not KeyboardEvent");
                return;
            }
            this.command.keydown(event);
        });

        this.dom.addEventListener("input", (event) => {
            console.log("input event:", event);
            if (!(event instanceof InputEvent)) {
                console.error("event is not InputEvent");
                return;
            }
            this.command.input(event as any);
        });

        this.dom.addEventListener("click", (event) => {
            document.addEventListener("selectionchange", () => {
                const selection = document.getSelection();
                const s = document.getElementById("@selection");
                s.innerHTML = `anchorNode: ${selection.anchorNode.nodeName}<br>
                anchorOffset: ${selection.anchorOffset}<br>
                focusNode: ${selection.focusNode.nodeName}<br>
                focusOffset: ${selection.focusOffset}<br>`;
            });
        });
    }
}
