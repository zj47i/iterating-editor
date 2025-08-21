import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandKeyboardEvent } from "./command.keyboard-event.enum";
import { DomNode } from "../dom/dom-node";
import { InputHandler, InputPayload } from "./input.handler.ts";
import { ShortcutFormat } from "./shortcut.format.ts";
import { TextFormat } from "../enum/text-format";
import { DeleteHandler } from "./delete.handler.ts";
import { ShortcutUndo } from "./shortcut.undo.ts";
import { BackspaceHandler } from "./backspace.handler.ts";
import { CompositionStateMachine } from "../state-machine/composition.state-machine.ts";
import { SelectionStateMachine } from "../state-machine/selection.state-machine.ts";
import { EnterHandler } from "./enter.handler.ts";

export class Command {
    constructor(
        private sync: Synchronizer,
        private target: EventTarget,
        private compositionStateMachine: CompositionStateMachine,
        private selectionStateMachine: SelectionStateMachine
    ) {
        this.target.addEventListener(
            "editorinput",
            (event: CustomEvent<InputEvent>) => {
                if (!(event instanceof CustomEvent)) {
                    throw new Error("event is not InputEvent");
                }
                console.info("editorinput event:", event);
                this.input(event);
            }
        );

        this.target.addEventListener("keydown", (event) => {
            if (!(event instanceof KeyboardEvent)) {
                throw new Error("event is not KeyboardEvent");
            }
            console.info("keydown event:", event);
            this.keydown(event);
        });

        this.target.addEventListener("input", (event) => {
            if (!(event instanceof InputEvent)) {
                throw new Error("event is not InputEvent");
            }

            if (
                this.compositionStateMachine.getState().getName() !==
                "IdleState"
            ) {
                return;
            }
            console.info("input event:", event);
            this.input(event);
        });
    }

    keydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            console.info("Enter key pressed");
            event.preventDefault();
            if (this.selectionStateMachine.isCursor()) {
                const cursorState = this.selectionStateMachine.getState();
                if (cursorState.startContainer instanceof Text) {
                    const enterHandler = EnterHandler.getInstance<EnterHandler>(this.sync);
                    enterHandler.handleTextNodeLineUp(
                        cursorState.startContainer,
                        cursorState.startOffset
                    );
                } else if (
                    cursorState.startContainer instanceof HTMLElement &&
                    cursorState.startContainer.nodeName === "P"
                ) {
                    const enterHandler = EnterHandler.getInstance<EnterHandler>(this.sync);
                    enterHandler.handleParagraph(
                        DomNode.fromExistingElement(cursorState.startContainer)
                    );
                }
            } else if (this.selectionStateMachine.isRange()) {
                const deleteHandler = DeleteHandler.getInstance<DeleteHandler>(
                    this.sync
                );
                deleteHandler.execute(this.selectionStateMachine);
                this.keydown(event); // 재귀 호출로 Enter 처리
            }
        }

        const currentSelectionState = this.selectionStateMachine.getState();

        if (event.key === CommandKeyboardEvent.BACKSPACE) {
            console.info("Backspace key pressed");
            if (
                currentSelectionState.startContainer.nodeType ===
                    Node.TEXT_NODE &&
                currentSelectionState.startOffset === 0
            ) {
                console.info("Handling backspace at start of text node");
                event.preventDefault();
                if (!(currentSelectionState.startContainer instanceof Text)) {
                    throw new Error("anchorNode is not Text");
                }
                const backspaceHandler = BackspaceHandler.getInstance<BackspaceHandler>(this.sync);
                backspaceHandler.handleTextNodeLineUp(
                    currentSelectionState.startContainer,
                    event
                );
            } else if (
                currentSelectionState.startContainer.nodeType ===
                    Node.TEXT_NODE &&
                currentSelectionState.startOffset === 1
            ) {
                console.info("Handling backspace at rear of first character");
                event.preventDefault();
                if (!(currentSelectionState.startContainer instanceof Text)) {
                    throw new Error("anchorNode is not Text");
                }
                const backspaceHandler = BackspaceHandler.getInstance<BackspaceHandler>(this.sync);
                backspaceHandler.handleEmptyTextNode(
                    currentSelectionState.startContainer
                );
            } else if (
                currentSelectionState.startContainer.nodeType ===
                    Node.TEXT_NODE &&
                currentSelectionState.startOffset > 1
            ) {
                console.info("Handling backspace in middle of text node");
                event.preventDefault();
                if (!(currentSelectionState.startContainer instanceof Text)) {
                    throw new Error("anchorNode is not Text");
                }
                const backspaceHandler = BackspaceHandler.getInstance<BackspaceHandler>(this.sync);
                backspaceHandler.handleTextNodeBackspace(
                    currentSelectionState.startContainer,
                    currentSelectionState.startOffset,
                    event
                );
            } else if (currentSelectionState.startContainer.nodeName === "P") {
                console.info("Handling backspace at paragraph");
                event.preventDefault();
                if (
                    !(
                        currentSelectionState.startContainer instanceof
                        HTMLElement
                    )
                ) {
                    throw new Error("anchorNode is not HTMLElement");
                }
                const backspaceHandler = BackspaceHandler.getInstance<BackspaceHandler>(this.sync);
                backspaceHandler.handleParagraph(
                    DomNode.fromExistingElement(
                        currentSelectionState.startContainer
                    ),
                    event
                );
                return;
            }
        }

        if (event.key.toUpperCase() === "B" && event.ctrlKey) {
            const shortcutFormat = ShortcutFormat.getInstance<ShortcutFormat>(
                this.sync
            );
            event.preventDefault();
            shortcutFormat.execute(TextFormat.BOLD, this.selectionStateMachine);
        }

        if (event.key.toUpperCase() === "Z" && event.ctrlKey) {
            const shortcutUndo = ShortcutUndo.getInstance<ShortcutUndo>(
                this.sync
            );
            event.preventDefault();
            shortcutUndo.execute();
        }

        if (event.key === CommandKeyboardEvent.DELETE) {
            event.preventDefault();
            const deleteHandler = DeleteHandler.getInstance<DeleteHandler>(
                this.sync
            );
            deleteHandler.execute(this.selectionStateMachine);
        }
    }

    input(event: InputEvent | CustomEvent<InputEvent>) {
        let data = "";
        if (event instanceof CustomEvent) {
            data = event.detail.data || "";
        } else if (event instanceof InputEvent) {
            data = event.data || "";
        }
        const payload: InputPayload = { data };
        const inputHandler = InputHandler.getInstance<InputHandler>(this.sync);
        inputHandler.execute(this.selectionStateMachine, payload);
    }
}
