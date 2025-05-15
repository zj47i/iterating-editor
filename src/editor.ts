import { Command } from "./command/command";
import { VDomNode } from "./vdom/vdom-node";
import { VDomNodeType } from "./vdom/vdom-node.enum";
import { Synchronizer } from "./syncronizer/syncronizer";
import { DomNode } from "./dom/dom-node";
import { CompositionInputStateMachine } from "./state-machine/composition-input.state-machine";

export class Editor extends EventTarget {
    private command: Command;
    private compositionInputStateMachine: CompositionInputStateMachine;

    constructor(
        private dom: DomNode,
        private vdom: VDomNode,
        private sync: Synchronizer
    ) {
        super();
        this.sync.appendNewVDomNodeOnInit(
            this.vdom,
            new VDomNode(VDomNodeType.PARAGRAPH)
        );

        this.command = new Command(this.sync);
        this.compositionInputStateMachine = new CompositionInputStateMachine(
            this
        ); // stateMachine을 저장
        this.setupEventListeners();
    }

    private setupEventListeners() {
        const element = this.dom.getElement();

        element.addEventListener("keydown", (event) => {
            if (!(event instanceof KeyboardEvent)) {
                throw new Error("event is not KeyboardEvent");
            }
            console.log("keydown event:", event);
            this.command.keydown(event);
        });

        element.addEventListener("compositionstart", (event) => {
            this.compositionInputStateMachine.transition(event);
        });

        element.addEventListener("compositionupdate", (event) => {
            this.compositionInputStateMachine.transition(event);
        });

        element.addEventListener("compositionend", (event) => {
            this.compositionInputStateMachine.transition(event);
        });

        element.addEventListener("input", (event) => {
            if (
                this.compositionInputStateMachine.getState().getName() !==
                "IdleState"
            ) {
                return;
            }

            if (!(event instanceof InputEvent)) {
                throw new Error("event is not InputEvent");
            }
            this.command.input(event);
        });

        this.addEventListener(
            "editorinput",
            (event: CustomEvent<InputEvent>) => {
                // CompositionInputStateMachine이 dispatch한 editorinput 이벤트 수신
                console.log("editorinput event:", event);
                if (!(event instanceof CustomEvent)) {
                    throw new Error("event is not InputEvent");
                }
                this.command.input(event);
            }
        );
    }
}
