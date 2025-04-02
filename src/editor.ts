import { Command } from "./command/command";
import { VDomNode } from "./vdom/vdom-node";
import { VDomNodeType } from "./vdom/vdom-node.enum";
import { Synchronizer } from "./syncronizer/syncronizer";
import { DomNode } from "./dom/dom-node";

export class Editor {
    private command: Command;

    constructor(private dom: DomNode, private vdom: VDomNode, private sync: Synchronizer) {

        this.sync.appendNewVDomNode(
            this.vdom,
            new VDomNode(VDomNodeType.PARAGRAPH)
        );

        this.command = new Command(this.sync);
        this.addEventListener();
    }

    addEventListener() {
        this.dom.getElement().addEventListener("keydown", (event) => {
            console.log("keydown event:", event);
            if (!(event instanceof KeyboardEvent)) {
                console.error("event is not KeyboardEvent");
                return;
            }
            this.command.keydown(event);
        });

        this.dom.getElement().addEventListener("input", (event) => {
            console.log("input event:", event);
            if (!(event instanceof InputEvent)) {
                console.error("event is not InputEvent");
                return;
            }
            this.command.input(event);
        });

        this.dom.getElement().addEventListener("click", (event) => {
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
