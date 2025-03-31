import { VDomNode } from "./vdom/vdom-node";

const observer = new MutationObserver((mutations) => {
    const elementTextarea = document.getElementById("@element");
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
observer.observe(document.getElementById("@editor"), {
    childList: true,
    subtree: true,
});

export class EditorDebugger {
    constructor(private editor: any) {}

    printTree() {
        const vdomRoot = this.getVdomRoot();
        vdomRoot.printTree();
    }

    private getVdomRoot(): VDomNode {
        // private 속성 우회 접근 (임시 디버깅 용도라면 허용 가능)
        return (this.editor as any)["vdom"];
    }
}
