import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandKeyboardEvent } from "./command.keyboard-event.enum";
import { DomNode } from "../dom/dom-node";
import { InputHandler } from "./input.handler.ts";
import { ShortcutFormat } from "./shortcut.format.ts";
import { TextFormat } from "../enum/text-format";
import { DeleteHandler } from "./delete.handler.ts";
import { ShortcutUndo } from "./shortcut.undo.ts";
import { BackspaceHandler } from "./backspace.handler.ts";
import { CompositionStateMachine } from "../state-machine/composition.state-machine.ts";
import { SelectionStateMachine } from "../state-machine/selection.state-machine.ts";
import { EnterHandler } from "./enter.handler.ts";

export class Command {
    private backspaceHandler: BackspaceHandler;
    private enterHandler: EnterHandler;
    constructor(
        private sync: Synchronizer,
        private target: EventTarget,
        private compositionStateMachine: CompositionStateMachine,
        private selectionStateMachine: SelectionStateMachine
    ) {
        this.backspaceHandler = new BackspaceHandler(sync);
        this.enterHandler = new EnterHandler(sync);
        this.target.addEventListener(
            "editorinput",
            (event: CustomEvent<InputEvent>) => {
                // CompositionInputStateMachine이 dispatch한 editorinput 이벤트 수신
                console.log("editorinput event:", event);
                if (!(event instanceof CustomEvent)) {
                    throw new Error("event is not InputEvent");
                }
                this.input(event);
            }
        );

        this.target.addEventListener("keydown", (event) => {
            if (!(event instanceof KeyboardEvent)) {
                throw new Error("event is not KeyboardEvent");
            }
            console.log("keydown event:", event);
            this.keydown(event);
        });

        this.target.addEventListener("input", (event) => {
            if (
                this.compositionStateMachine.getState().getName() !==
                "IdleState"
            ) {
                return;
            }

            if (!(event instanceof InputEvent)) {
                throw new Error("event is not InputEvent");
            }
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
                    this.enterHandler.handleTextNodeLineUp(
                        cursorState.startContainer,
                        cursorState.startOffset
                    );
                } else if (
                    cursorState.startContainer instanceof HTMLElement &&
                    cursorState.startContainer.nodeName === "P"
                ) {
                    this.enterHandler.handleParagraph(
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
                if (!(currentSelectionState.startContainer instanceof Text)) {
                    throw new Error("anchorNode is not Text");
                }
                this.backspaceHandler.handleTextNodeLineUp(
                    currentSelectionState.startContainer,
                    event
                );
            }
            if (
                currentSelectionState.startContainer.nodeType ===
                    Node.TEXT_NODE &&
                currentSelectionState.startOffset === 1
            ) {
                if (!(currentSelectionState.startContainer instanceof Text)) {
                    throw new Error("anchorNode is not Text");
                }
                event.preventDefault();
                this.backspaceHandler.handleEmptyTextNode(
                    currentSelectionState.startContainer
                );
            }
            if (currentSelectionState.startContainer.nodeName === "P") {
                if (
                    !(
                        currentSelectionState.startContainer instanceof
                        HTMLElement
                    )
                ) {
                    throw new Error("anchorNode is not HTMLElement");
                }
                this.backspaceHandler.handleParagraph(
                    DomNode.fromExistingElement(
                        currentSelectionState.startContainer
                    ),
                    event
                );
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

    input(event: CustomEvent<InputEvent> | InputEvent) {
        console.info("input$");
        const currentSelectionState = this.selectionStateMachine.getState();
        if (!currentSelectionState.startContainer) {
            throw new Error("Selection anchorNode is null");
        }
        const element = currentSelectionState.startContainer;
        if (element.nodeType === Node.TEXT_NODE) {
            if (!(element instanceof Text)) {
                throw new Error("element is not Text");
            }
            const textNode = element;
            if (textNode.parentElement === null) {
                throw new Error("textNode parentElement is null");
            }
            const parent = DomNode.fromExistingElement(textNode.parentElement);

            const inputHandler = InputHandler.getInstance<InputHandler>(
                this.sync
            );
            inputHandler.execute(textNode, parent);
            return;
        }
    }
}
