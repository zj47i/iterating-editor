import { Command } from "./command/command";
import { StateNode } from "./state-node/state-node";
import { StateNodeType } from "./state-node/state-node.enum";
import { Synchronizer } from "./syncronizer/syncronizer";

export class Editor {
    private state: StateNode;
    private sync: Synchronizer;
    private command: Command;

    constructor(private editorRoot: HTMLDivElement) {
        this.editorRoot.contentEditable = "true";
        this.state = StateNode.createRootState();
        this.sync = new Synchronizer(editorRoot, this.state);

        const paragraph = new StateNode(StateNodeType.PARAGRAPH);
        this.sync.append(this.editorRoot, this.state, paragraph);

        this.command = new Command(this.editorRoot, this.state, this.sync);
        this.addEventListener();
        // MutationObserver 인스턴스 생성
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    // 요소가 새로 추가됨
                    mutation.addedNodes.forEach((node) => {
                        console.log("추가된 요소:", node);
                    });

                    // 요소가 제거됨
                    mutation.removedNodes.forEach((node) => {
                        console.log("제거된 요소:", node);
                    });
                }
            });
        });

        // body와 그 하위 요소들의 childList 변경을 감시
        observer.observe(this.editorRoot, { childList: true, subtree: true });
    }

    addEventListener() {
        this.editorRoot.addEventListener("keydown", (event) => {
            console.log("keydown");
            console.log(getSelection());
            if (!(event instanceof KeyboardEvent)) {
                console.error("event is not KeyboardEvent");
                return;
            }
            this.command.keydown(event);
        });

        this.editorRoot.addEventListener("click", (event) => {
            console.log("click");
            const selection = getSelection();
            const s = document.getElementById("@selection");
            s.innerHTML = `anchorNode: ${selection.anchorNode.nodeName}<br>
                anchorOffset: ${selection.anchorOffset}<br>
                focusNode: ${selection.focusNode.nodeName}<br>
                focusOffset: ${selection.focusOffset}`;
        });
    }
}
