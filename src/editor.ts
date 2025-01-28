import { StateNode } from "./state-node/state-node";
import { Synchronizer } from "./syncronizer/syncronizer";

const ALL_EVENTS = ["keydown", "keyup"];
const CURSOR_ON_EVENTS = ["mouseup"];
const TYPE_EVENT = ["input"];

/**
 * - 초기상태에서는 text를 담을 수 있는 block이 없기 때문에 글을 작성하는 순간 block이 생성되면서 text를 담게 된다.
 * - 텍스트는 span에 담는다.
 * -
 */
export class Editor {
    private state: StateNode;

    constructor(private editorRoot: HTMLDivElement, private plainState?: JSON) {
        this.registerNewLine();
        this.registerEventListener();
        this.registerBold();
        this.editorRoot.contentEditable = "true";
        this.state = StateNode.createDefaultState();
        new Synchronizer(editorRoot, this.state).syncDom();
        this.editorRoot.addEventListener("mouseup", (e) => {
            const selection = window.getSelection();
        });
    }

    registerNewLine() {
        this.editorRoot.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
    }

    registerBold() {
        this.editorRoot.addEventListener("keydown", (e) => {
            console.log(e);
            if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
                e.preventDefault();
                console.log("Ctrl + B가 비활성화되었습니다.");
                const selection = this.getSelection();

                const sync = new Synchronizer(this.editorRoot, this.state);

                const anchorState = sync.findStateMatchingElement(
                    selection.anchorNode.parentElement
                );
                const focusState = sync.findStateMatchingElement(
                    selection.focusNode.parentElement
                );

                const states = StateNode.findStatesBetween(
                    anchorState,
                    focusState
                );

                console.log(states);

                states
                    .filter((state) => state.type === "span")
                    .forEach((state) => {
                        if (!state.format) {
                            state.format = ["bold"];
                        } else {
                            if (state.format.indexOf("bold") === -1) {
                                state.format.push("bold");
                            }
                        }
                    });
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
        TYPE_EVENT.forEach((evt) => {
            this.editorRoot.addEventListener(evt, (e) => {
                const selection = this.getSelection();
                const span = selection.anchorNode.parentElement;
                new Synchronizer(this.editorRoot, this.state).syncStateText();
            });
        });
    }
}
