import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { position } from "./selection/position.ts";
import { DomVDomConverter } from "../shared/dom-vdom-converter.ts";
import { CommandBase } from "./command.base.ts";

export class BackspaceHandler extends CommandBase {
    private constructor(sync: Synchronizer) {
        super(sync);
    }

    handleParagraph(paragraph: DomNode, event: KeyboardEvent) {
        // 단락에서 백스페이스 처리
        console.info("BackspaceParagraph$", paragraph);
        const vParagraph = this.sync.findVDomNodeFrom(paragraph);
        const vPreviousParagraph = vParagraph.getPreviousSibling();
        if (vPreviousParagraph) {
            // 삭제 전에 이전 단락의 DOM과 커서 위치를 먼저 계산
            const previousParagraphDom = paragraph.getPreviousSibling();
            let setCursor = false;
            if (previousParagraphDom) {
                console.info("previousParagraphDom$", previousParagraphDom);
                const children = previousParagraphDom.getChildren();
                if (children.length > 0) {
                    const lastSpan = children[children.length - 1];
                    const textNode = lastSpan.getElement().firstChild;
                    if (textNode instanceof Text) {
                        position(textNode, textNode.length);
                        setCursor = true;
                    }
                }
            }
            // 만약 위에서 커서를 못 옮겼으면(비어있는 단락) 단락 자체에 커서
            if (!setCursor && previousParagraphDom) {
                position(previousParagraphDom.getElement(), 0);
            }
            // 마지막에 삭제
            this.sync.remove(vParagraph);
            event.preventDefault();
        } else {
            event.preventDefault();
        }
    }

    handleTextNodeLineUp(textNode: Text, event: KeyboardEvent) {
        console.info("BackspaceTextNodeLineUp$");
        if (textNode.parentElement === null) {
            throw new Error("textNode.parentElement is null");
        }
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const paragraph = span.getParent();
        if (paragraph === null) {
            throw new Error("span.getParent() is null");
        }
        const paragraphVDomNode = this.sync.findVDomNodeFrom(paragraph);
        const previousParagraphVDomNode =
            paragraphVDomNode.getPreviousSibling();
        if (previousParagraphVDomNode) {
            this.sync.merge(previousParagraphVDomNode, paragraphVDomNode);
            position(textNode, 0);
        }
        event.preventDefault();
    }

    handleTextNodeBackspace(textNode: Text, cursorPosition: number, event: KeyboardEvent) {
        console.info("BackspaceTextNodeBackspace$ at position", cursorPosition);
        if (textNode.parentElement === null) {
            throw new Error("textNode.parentElement is null");
        }
        if (textNode.textContent === null) {
            throw new Error("textNode.textContent is null");
        }
        
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const vSpan = this.sync.findVDomNodeFrom(span);
        
        // Remove the character before the cursor position
        const currentText = textNode.textContent;
        const newText = currentText.slice(0, cursorPosition - 1) + currentText.slice(cursorPosition);
        
        // Update the VDOM with the new text
        this.sync.setText(vSpan, newText);
        
        // Position cursor at the new location (one character back)
        const newPosition = cursorPosition - 1;
        
        // Find the updated text node and position cursor
        const updatedTextNode = span.getElement().firstChild;
        if (updatedTextNode instanceof Text) {
            position(updatedTextNode, newPosition);
        }
        
        event.preventDefault();
    }

    handleEmptyTextNode(textNode: Text) {
        // 비어있는 텍스트 노드에서 백스페이스 처리
        if (textNode.parentElement === null) {
            throw new Error("textNode.parentElement is null");
        }
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const vSpan = this.sync.findVDomNodeFrom(span);
        const previousVSpan = vSpan.getPreviousSibling();
        if (previousVSpan) {
            this.sync.merge(previousVSpan, vSpan);
            position(
                DomVDomConverter.createDomFromVDom(
                    previousVSpan
                ).getElement(),
                previousVSpan.getText().length
            );
        } else {
            const parent = span.getParent();
            if (parent === null) {
                throw new Error("span.getParent() is null");
            }
            const nextVSpan = vSpan.getNextSibling();
            this.sync.remove(vSpan);
            // position 함수는 외부에서 import 필요
            if (nextVSpan) {
                position(
                    DomVDomConverter.createDomFromVDom(
                        nextVSpan
                    ).getElement(),
                    0
                );
            } else {
                position(parent.getElement(), 0);
            }
        }
    }
}
