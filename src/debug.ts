import { Editor } from "./editor";
import { VDomNode } from "./vdom/vdom-node";

const observer = new MutationObserver((mutations) => {
    const elementTextarea = document.getElementById("@element");
    if (!elementTextarea) {
        throw new Error("textarea not found");
    }
    mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
            // 요소가 새로 추가됨

            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node instanceof HTMLElement) {
                        elementTextarea.textContent =
                            "추가된       요소: " +
                            node.outerHTML +
                            "\n" +
                            elementTextarea.textContent;
                    }
                } else if (node.nodeType === Node.TEXT_NODE) {
                    elementTextarea.textContent =
                        "추가된 텍스트 노드: " +
                        node.textContent +
                        "\n" +
                        elementTextarea.textContent;
                }
            });

            // 요소가 제거됨
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node instanceof HTMLElement) {
                        elementTextarea.textContent =
                            "제거된       요소: " +
                            node.outerHTML +
                            "\n" +
                            elementTextarea.textContent;
                    }
                } else if (node.nodeType === Node.TEXT_NODE) {
                    elementTextarea.textContent =
                        "제거된 텍스트 노드: " +
                        node.textContent +
                        "\n" +
                        elementTextarea.textContent;
                }
            });
        }
    });
    elementTextarea.textContent =
        "============================" +
        "\n" +
        elementTextarea.textContent +
        "\n";
});

// body와 그 하위 요소들의 childList 변경을 감시
const editor = document.getElementById("@editor");
if (!editor) {
    throw new Error("editor element not found");
}
observer.observe(editor, {
    childList: true,
    subtree: true,
});

export class EditorDebugger {
    constructor(private editor: Editor) {
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "d") {
                event.preventDefault(); // 브라우저 기본 Ctrl+D 동작 방지
                this.printTree();
            }
        });
        (editor as any).dom.getElement().addEventListener("click", (event) => {
            console.debug("debug click");
            document.addEventListener("selectionchange", () => {
                const selection = window.getSelection() as any;
                const s = document.getElementById("@selection")!;
                s.innerHTML = `anchorNode: ${selection.anchorNode.nodeName}<br>
                    anchorOffset: ${selection.anchorOffset}<br>
                    focusNode: ${selection.focusNode.nodeName}<br>
                    focusOffset: ${selection.focusOffset}<br>`;
            });
        });
    }

    printTree() {
        console.debug(
            "%cvdomRoot:==========================",
            "color: #cceeff; background-color: #222; padding: 2px 4px; border-radius: 3px; font-weight: bold;"
        );
        const vdomRoot = this.getVdomRoot();
        vdomRoot.printTree({ prefix: "   " });
 
        const undoStack = this.getUndoStack() as [];
        undoStack.slice(-3).forEach((item: any) => {
            console.debug("undoStack: ++++++++++++++++++++++++++");
            item.printTree({ prefix: "   " });
        });
    }

    private getVdomRoot(): VDomNode {
        // private 속성 우회 접근 (임시 디버깅 용도라면 허용 가능)
        return (this.editor as any)["vdom"];
    }

    private getUndoStack(): any {
        return (this.editor as any)["sync"]["undoStack"];
    }
}
