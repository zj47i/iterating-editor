import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandKeyboardEvent } from "./command.keyboard-event.enum";
import { DomNode } from "../dom/dom-node";
import { EnterParagraph } from "./enter.paragraph.ts";
import { EnterTextNode } from "./enter.text-node.ts";
import { BackspaceParagraph } from "./backspace.paragraph.ts";
import { InputParagraph } from "./input.paragraph.ts";
import { InputTextNode } from "./input.text-node.ts";
import { ShortcutFormat } from "./shortcut.format.ts";
import { TextFormat } from "../enum/text-format";
import { BackspaceTextNode } from "./backspace.text-node.ts";
import { DeleteRange } from "./delete.range.ts";
import { ShortcutUndo } from "./shortcut.undo.ts";
import { BackspaceTextNodeEmpty } from "./backspace.text-node.empty.ts";
import { EditorSelection } from "../editor.selection";
import { CompositionStateMachine } from "../state-machine/composition.state-machine.ts";

export class Command {
    constructor(
        private sync: Synchronizer,
        private target: EventTarget,
        private compositionStateMachine: CompositionStateMachine
    ) {
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
        const selection = EditorSelection.getSelection();
        if (event.key === CommandKeyboardEvent.ENTER) {
            console.info(CommandKeyboardEvent.ENTER);
            event.preventDefault();
            if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
                if (!(selection.anchorNode instanceof Text)) {
                    throw new Error("anchorNode is not Text");
                }
                const enterTextNode = EnterTextNode.getInstance<EnterTextNode>(
                    this.sync
                );
                enterTextNode.execute(selection, selection.anchorNode);
            } else if (
                selection.anchorNode instanceof HTMLElement &&
                selection.anchorNode.nodeName === "P"
            ) {
                const enterParagraph =
                    EnterParagraph.getInstance<EnterParagraph>(this.sync);
                enterParagraph.execute(
                    selection,
                    DomNode.fromExistingElement(selection.anchorNode)
                );
            }
        }

        if (event.key === CommandKeyboardEvent.BACKSPACE) {
            console.info(CommandKeyboardEvent.BACKSPACE);
            if (
                selection.anchorNode.nodeType === Node.TEXT_NODE &&
                selection.anchorOffset === 0
            ) {
                if (!(selection.anchorNode instanceof Text)) {
                    throw new Error("anchorNode is not Text");
                }
                const backspaceTextNode =
                    BackspaceTextNode.getInstance<BackspaceTextNode>(this.sync);
                backspaceTextNode.execute(
                    selection,
                    selection.anchorNode,
                    event
                );
            }
            if (
                selection.anchorNode.nodeType === Node.TEXT_NODE &&
                selection.anchorOffset === 1
            ) {
                if (!(selection.anchorNode instanceof Text)) {
                    throw new Error("anchorNode is not Text");
                }
                event.preventDefault();
                const backspaceTextNodeEmpty =
                    BackspaceTextNodeEmpty.getInstance<BackspaceTextNodeEmpty>(
                        this.sync
                    );
                backspaceTextNodeEmpty.execute(
                    selection,
                    selection.anchorNode,
                    event
                );
            }
            if (selection.anchorNode.nodeName === "P") {
                if (!(selection.anchorNode instanceof HTMLElement)) {
                    throw new Error("anchorNode is not HTMLElement");
                }
                const backspaceParagraph =
                    BackspaceParagraph.getInstance<BackspaceParagraph>(
                        this.sync
                    );

                backspaceParagraph.execute(
                    DomNode.fromExistingElement(selection.anchorNode),
                    event
                );
            }
        }

        if (event.key.toUpperCase() === "B" && event.ctrlKey) {
            const shortcutFormat = ShortcutFormat.getInstance<ShortcutFormat>(
                this.sync
            );
            event.preventDefault();
            shortcutFormat.execute(TextFormat.BOLD, selection);
        }

        if (event.key.toUpperCase() === "Z" && event.ctrlKey) {
            const shortcutUndo = ShortcutUndo.getInstance<ShortcutUndo>(
                this.sync
            );
            event.preventDefault();
            shortcutUndo.execute(selection);
        }

        if (event.key === CommandKeyboardEvent.DELETE) {
            event.preventDefault();
            const deleteRange = DeleteRange.getInstance<DeleteRange>(this.sync);
            deleteRange.execute(selection);
        }
    }

    input(event: CustomEvent<InputEvent> | InputEvent) {
        const selection = EditorSelection.getSelection();
        const element = selection.anchorNode;
        if (element.nodeType === Node.TEXT_NODE) {
            if (!(element instanceof Text)) {
                throw new Error("element is not Text");
            }
            const textNode = element;
            if (textNode.parentElement === null) {
                throw new Error("textNode parentElement is null");
            }
            const parent = DomNode.fromExistingElement(textNode.parentElement);

            if (parent.getNodeName() === "P") {
                const inputParagraph =
                    InputParagraph.getInstance<InputParagraph>(this.sync);
                inputParagraph.execute(textNode, parent, selection);
                return;
            }

            if (parent.getNodeName() === "SPAN") {
                const inputTextNode = InputTextNode.getInstance<InputParagraph>(
                    this.sync
                );
                inputTextNode.execute(textNode, parent, selection);
                return;
            }
        }
    }
}
