import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandKeyboardEvent } from "./command.keyboard-event.enum";
import { DomNode } from "../dom/dom-node";
import { EnterParagraph } from "./commands/enter.paragraph";
import { EnterTextNode } from "./commands/enter.text-node";
import { BackspaceParagraph } from "./commands/backspace.paragraph";
import { InputParagraph } from "./commands/input.paragraph";
import { InputTextNode } from "./commands/input.text-node";
import { ShortcutFormat } from "./commands/shortcut.format";
import { TextFormat } from "../enum/text-format";
import { BackspaceTextNode } from "./commands/backspace.text-node";
import { DeleteRange } from "./commands/delete.range";
import { ShortcutUndo } from "./commands/shortcut.undo";
import { BackspaceTextNodeEmpty } from "./commands/backspace.text-node.empty";
import { EditorSelection } from "../editor.selection";
import { Editor } from "../editor";

export class Command {
    constructor(private sync: Synchronizer) {}

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

    input(event: InputEvent) {
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
