import { DomElement } from "./dom/dom-element";
import { StateNode } from "./state-node/state-node";
import { StateNodeDiff, StateNodeType } from "./state-node/state-node.enum";
import { Synchronizer } from "./syncronizer/syncronizer";

const CURSOR_ON_EVENTS = ["mouseup"];
const TYPE_EVENT = ["input"];

export class Editor {
    private state: StateNode;
    private sync: Synchronizer;

    constructor(private editorRoot: HTMLDivElement, private plainState?: JSON) {
        this.registerNewLine();
        this.registerEventListener();
        this.registerBold();
        this.editorRoot.contentEditable = "true";
        this.state = StateNode.createRootState();
        this.state.appendNode(new StateNode(StateNodeType.PARAGRAPH));
        this.sync = new Synchronizer(editorRoot, this.state);
        this.sync.syncEditor();
    }

    registerNewLine() {
        this.editorRoot.addEventListener("keydown", (e) => {
            const selection = this.getSelection();
            if (e.key === "Enter") {
                e.preventDefault();
                if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
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
                        newSpanNode.diff = StateNodeDiff.INSERT;
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

                    return;
                }

                if (selection.anchorNode instanceof HTMLElement) {
                    if (selection.anchorNode.nodeName === "P") {
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
                }
            } else {
                // TODO 엔터를 제외한 다른 키 눌림 - 분류가 필요하지만 일단은 텍스트 입력으로 간주
                if (selection.anchorNode instanceof HTMLElement) {
                    if (selection.anchorNode.nodeName === "P") {
                        e.preventDefault();
                        const paragraph = selection.anchorNode;
                        const paragraphStateNode =
                            this.sync.findStateNodeMatchingElement(paragraph);

                        if (!paragraphStateNode.isEmpty()) {
                            console.error(
                                "cursor can not be on paragraph when paragraph is not empty"
                            );
                            return;
                        }

                        const newSpan = new StateNode(StateNodeType.SPAN);
                        newSpan.setText(e.key);
                        paragraphStateNode.appendNode(newSpan);
                        this.sync.syncEditor();

                        const span = paragraph.firstElementChild;
                        const range = document.createRange();
                        range.setStart(span, 1);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        });
    }

    registerBold() {
        this.editorRoot.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
                e.preventDefault();
                console.info("Ctrl + B가 비활성화되었습니다.");
                const selection = this.getSelection();

                const sync = new Synchronizer(this.editorRoot, this.state);

                const anchorState = sync.findStateNodeMatchingElement(
                    selection.anchorNode.parentElement
                );
                const focusState = sync.findStateNodeMatchingElement(
                    selection.focusNode.parentElement
                );

                const states = StateNode.findStatesBetween(
                    anchorState,
                    focusState
                );
                // TODO 구현필요
                // states
                //     .filter((state) => state.type === "span")
                //     .forEach((state) => {
                //         if (!state.format) {
                //             state.format = ["bold"];
                //             state.diff = StateNodeDiff.MODIFY;
                //         } else {
                //             if (state.format.indexOf("bold") === -1) {
                //                 state.format.push("bold");
                //                 state.diff = StateNodeDiff.MODIFY;
                //             }
                //         }
                //     });
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

    registerEventListener() {
        CURSOR_ON_EVENTS.forEach((evt) => {
            this.editorRoot.addEventListener(evt, (e) => {
                const selection = this.getSelection();
            });
        });
        // TYPE_EVENT.forEach((evt) => {
        //     this.editorRoot.addEventListener(evt, (e) => {
        //         const selection = this.getSelection();
        //         const span = selection.anchorNode.parentElement;
        //         this.sync.syncStateNodeText();
        //     });
        // });
    }
}
