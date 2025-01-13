import { StateNode } from "./state-node";
import { Synchronizer } from "./syncronizer";

const ALL_EVENTS = ["keydown", "keyup"];
const CURSOR_ON_EVENTS = ["mouseup"];

/**
 * - 초기상태에서는 text를 담을 수 있는 block이 없기 때문에 글을 작성하는 순간 block이 생성되면서 text를 담게 된다.
 * - 텍스트는 span에 담는다.
 * -
 */
export class Editor {
    private state: StateNode;

    constructor(private editorRoot: HTMLDivElement, private plainState?: JSON) {
        this.registerPreventDefault();
        this.registerEventListener();
        this.editorRoot.contentEditable = "true";
        this.state = StateNode.createDefaultState();
        new Synchronizer(editorRoot, this.state).syncDom();
        this.editorRoot.addEventListener("mouseup", (e) => {
            console.log("mouseup 발생 요소:", e.target);
            const selection = window.getSelection();
            console.log("selection: ",selection);
            console.log(selection.rangeCount);
            console.log(selection.getRangeAt(0));
        });
    }

    getCursorProperties(): {
        anchorType: string;
        anchorOffset: number;

        focusType: string;
        focusOffset: number;
    } | null {
        const selection = window.getSelection();
        if (!selection || !selection.anchorNode || !selection.focusNode) {
            console.log("selection is null");
            return null;
        }

        return {
            anchorType: selection.anchorNode.nodeName || "",
            anchorOffset: selection.anchorOffset,
            focusType: selection.focusNode.nodeName || "",
            focusOffset: selection.focusOffset,
        };
    }

    registerPreventDefault() {
        this.editorRoot.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
    }

    private domSelection(
        evt: string,
        e: Event
    ): {
        anchorNode: Node;
        focusNode: Node;
        parent: HTMLElement;
        sibling: HTMLCollectionOf<Element>;
    } | void {
        const selection = window.getSelection();
        if (!selection) {
            console.error("selection is null");
            return;
        }
        const selectionDiv = document.getElementById(
            "@selection"
        ) as HTMLDivElement;
        selectionDiv.innerHTML = JSON.stringify(
            {
                ...this.getCursorProperties(),
                event: evt,
            },
            null,
            2
        );

        // 여기부터
        // 노드 구조를 찾기
        const anchorNode = selection.anchorNode;
        if (!anchorNode) {
            console.error("anchorNode is null");
            return;
        }

        const focusNode = selection.focusNode;
        if (!focusNode) {
            console.error("focusNode is null");
            return;
        }

        const parent = anchorNode.parentElement;
        if (!parent) {
            console.error("parent is null");
            return;
        }
        if (parent.getAttribute("id") === "@editor") {
            console.error("parent is root");
        }

        const sibling = parent.children;

        return {
            anchorNode,
            focusNode,
            parent,
            sibling,
        };
    }

    registerEventListener() {
        CURSOR_ON_EVENTS.forEach((evt) => {
            this.editorRoot.addEventListener(evt, (e) => {
                const dom = this.domSelection(evt, e);
                if (!dom) {
                    console.error("dom is null");
                    return;
                }
                console.log(dom);
                if (dom.anchorNode.nodeName != "SPAN") {
                    console.info(
                        "anchorNode is not span, so this next action might to be writing"
                    );
                    return;
                }
            });
        });
    }
}
