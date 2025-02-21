import { Command } from "./command/command";
import { DomElement } from "./dom/dom-element";
import { StateNode } from "./state-node/state-node";
import { StateNodeDiff, StateNodeType } from "./state-node/state-node.enum";
import { Synchronizer } from "./syncronizer/syncronizer";

export class Editor {
    private state: StateNode;
    private sync: Synchronizer;
    private command: Command;

    constructor(private editorRoot: HTMLDivElement) {
        this.editorRoot.contentEditable = "true";
        this.state = StateNode.createRootState();
        this.sync = new Synchronizer(editorRoot, this.state);

        this.state.appendNode(new StateNode(StateNodeType.PARAGRAPH));
        this.sync.syncEditor();

        this.command = new Command(this.editorRoot, this.state);
        this.addEventListener();
    }

    addEventListener() {
        this.editorRoot.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                console.info("enter");
                const selection = this.getSelection();
                event.preventDefault();
                if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
                    console.info("textNodeEnter$");
                    const textNode = selection.anchorNode;
                    if (!(textNode instanceof Text)) {
                        console.error("textNode is not Text");
                        return;
                    }
                    const span = textNode.parentElement;
                    const p = span.parentElement;

                    const paragraphStateNode =
                        this.sync.findStateNodeMatchingElement(p);

                    const newParagraphStateNode = new StateNode(
                        StateNodeType.PARAGRAPH
                    );
                    paragraphStateNode.addNextSiblings([newParagraphStateNode]);

                    const textLength = textNode.textContent.length;
                    const cursorPosition = selection.anchorOffset;

                    if (cursorPosition !== textLength) {
                        const spanStateNode =
                            this.sync.findStateNodeMatchingElement(span);

                        if (cursorPosition === 0) {
                            spanStateNode.delete();
                            return;
                        }

                        spanStateNode.modifyText(
                            span.textContent.slice(0, cursorPosition)
                        );

                        const newSpanNode = new StateNode(StateNodeType.SPAN);
                        newSpanNode.setText(
                            textNode.textContent.slice(cursorPosition)
                        );
                        newSpanNode.diff = StateNodeDiff.INSERTED;
                        newParagraphStateNode.appendNode(newSpanNode);
                    }

                    this.sync.syncEditor();

                    if (cursorPosition === textLength) {
                        const newP = p.nextElementSibling;
                        const range = document.createRange();
                        range.setStart(newP, 0);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } else {
                        const newSpan = p.nextElementSibling.firstElementChild;
                        const range = document.createRange();
                        range.setStart(newSpan, 0);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                } else if (
                    selection.anchorNode instanceof HTMLElement &&
                    selection.anchorNode.nodeName === "P"
                ) {
                    console.info("paragraphEnter$");
                    const paragraph = selection.anchorNode;
                    const paragraphStateNode =
                        this.sync.findStateNodeMatchingElement(paragraph);
                    paragraphStateNode.addNextSiblings([
                        new StateNode(StateNodeType.PARAGRAPH),
                    ]);
                    this.sync.syncEditor();
                    const range = document.createRange();
                    range.setStart(paragraph.nextElementSibling, 0);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            } else if (event.key === "Backspace") {
                const selection = this.getSelection();
                if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
                    console.info("textNodeBackspace$");
                    const textNode = selection.anchorNode;
                    if (!(textNode instanceof Text)) {
                        console.error("textNode is not Text");
                        return;
                    }
                    if (textNode.textContent.length > 1) {
                        requestAnimationFrame(() => {
                            const span = textNode.parentElement;
                            this.sync.syncSpanStateNode(span);
                        });
                    } else {
                        const span = textNode.parentElement;
                        const paragraph = span.parentElement;
                        const spanStateNode =
                            this.sync.findStateNodeMatchingElement(span);
                        spanStateNode.delete();
                        console.log(spanStateNode);
                        this.sync.syncEditor();
                        const range = document.createRange();
                        range.setStart(paragraph, 0);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        console.log(paragraph.outerHTML)
                    }
                }
            } else if (event.key.length === 1) {
                console.info("typing");
                const selection = this.getSelection();
                if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
                    console.info("textNodeTyping$");
                    const textNode = selection.anchorNode;
                    if (!(textNode instanceof Text)) {
                        console.error("textNode is not Text");
                        return;
                    }
                    requestAnimationFrame(() => {
                        const span = textNode.parentElement;
                        this.sync.syncSpanStateNode(span);
                    });
                }
                if (selection.anchorNode.nodeName === "P") {
                    console.info("paragraphTyping$");
                    event.preventDefault();
                    const paragraph = selection.anchorNode;
                    if (
                        !(paragraph instanceof HTMLElement) ||
                        paragraph.nodeName !== "P"
                    ) {
                        console.error("paragraph is not paragraph element");
                        return;
                    }

                    if (!DomElement.elementHasBreakOnly(paragraph)) {
                        console.error("can not type in non-empty paragraph");
                    }

                    const paragraphStateNode =
                        this.sync.findStateNodeMatchingElement(paragraph);
                    const newSpanStateNode = new StateNode(StateNodeType.SPAN);
                    paragraphStateNode.appendNode(newSpanStateNode);
                    newSpanStateNode.setText(event.key);
                    this.sync.syncEditor();

                    const span = paragraph.firstElementChild;
                    const textNode = span.firstChild;
                    const range = document.createRange();
                    range.setStart(textNode, 1);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        });
    }

    private getSelection(): Selection {
        const selection = window.getSelection();
        if (!selection) {
            console.error("selection is null");
            return;
        }
        return selection;
    }
}
