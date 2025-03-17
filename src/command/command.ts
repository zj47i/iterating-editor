import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandKeyboardEvent } from "./command.keyboard-event.enum";
import { DomNode } from "../dom/dom-node";
import { EnterParagraph } from "./commands/enter.paragraph";
import { EnterTextNode } from "./commands/enter.text-node";
import { BackspaceParagraph } from "./commands/backspace.paragraph";
import { InputParagraph } from "./commands/input.paragraph";
import { InputTextNode } from "./commands/input.text-node";
import { ShortcutFormat } from "./commands/shortcut/format";
import { TextFormat } from "../enum/text-format";
import { BackspaceTextNode } from "./commands/backspace.text-node";

export class Command {
    constructor(private sync: Synchronizer) {}

    keydown(event: KeyboardEvent) {
        if (event.key === CommandKeyboardEvent.ENTER) {
            console.info(CommandKeyboardEvent.ENTER);
            event.preventDefault();
            const selection = getSelection();
            if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
                if (!(selection.anchorNode instanceof Text)) {
                    console.error("anchorNode is not Text");
                    return;
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
            const selection = getSelection();
            if (
                selection.anchorNode.nodeType === Node.TEXT_NODE &&
                selection.anchorOffset === 0
            ) {
                if (!(selection.anchorNode instanceof Text)) {
                    console.error("textNode is not Text");
                    return;
                }
                const backspaceTextNode =
                    BackspaceTextNode.getInstance<BackspaceTextNode>(this.sync);
                backspaceTextNode.execute(
                    selection,
                    selection.anchorNode,
                    event
                );
            }
            if (selection.anchorNode.nodeName === "P") {
                if (!(selection.anchorNode instanceof HTMLElement)) {
                    console.error("anchorNode is not HTMLElement");
                    return;
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

        if ((event.key === "B" || event.key === "b") && event.ctrlKey) {
            const shortcutFormat = ShortcutFormat.getInstance<ShortcutFormat>(
                this.sync
            );
            event.preventDefault();
            const selection = document.getSelection();
            shortcutFormat.execute(TextFormat.BOLD, selection);
        }
    }

    input(event: InputEvent) {
        const selection = getSelection();
        const element = selection.anchorNode;
        if (element.nodeType === Node.TEXT_NODE) {
            if (!(element instanceof Text)) {
                console.error("element is not Text");
                return;
            }
            const textNode = element;
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
