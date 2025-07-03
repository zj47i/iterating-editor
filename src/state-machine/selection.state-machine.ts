export interface State {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
    /**
     * selectionchange 등 이벤트 발생 시 새로운 상태 객체를 반환
     */
    onEvent(input: string): State;
    getName(): string;
}

// selection에서 안전하게 range를 가져오는 헬퍼 함수
/**
 * 현재 selection에서 첫 번째 Range를 반환합니다.
 * selection이 없거나 rangeCount가 0이면 예외를 던집니다.
 * 디버깅을 위해 selection/rangeCount 상태를 에러 메시지에 포함합니다.
 */
function getCurrentRange(): Range {
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
    throw new Error(
        `No valid selection range found. selection: ${selection}, rangeCount: ${
            selection ? selection.rangeCount : "n/a"
        }`
    );
}

type SelectionDirection = "forward" | "backward" | "none";

function getSelectionDirection(
    selection: Selection | null
): SelectionDirection {
    if (!selection) return "none";
    if (
        selection.direction === "forward" ||
        selection.direction === "backward" ||
        selection.direction === "none"
    ) {
        return selection.direction;
    }
    return "none";
}

class CursorState implements State {
    startContainer: Node;
    startOffset: number;
    /**
     * 커서 상태에서는 endContainer, endOffset이 항상 start와 동일함
     */
    endContainer: Node;
    endOffset: number;

    constructor(container: Node, offset: number) {
        this.startContainer = container;
        this.startOffset = offset;
        this.endContainer = container;
        this.endOffset = offset;
    }

    onEvent(input: string): State {
        if (input === "selectionchange") {
            const range = getCurrentRange();
            const selection = document.getSelection();
            if (selection && selection.isCollapsed) {
                // 불변성: 항상 새 객체 반환
                return new CursorState(range.startContainer, range.startOffset);
            } else if (selection) {
                return new RangeState(
                    range.startContainer,
                    range.startOffset,
                    range.endContainer,
                    range.endOffset,
                    getSelectionDirection(selection)
                );
            }
        }
        return this;
    }

    getName(): string {
        return "CursorState";
    }
}

class RangeState implements State {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
    /**
     * selection 방향: "forward" | "backward" | "none"
     */
    direction: SelectionDirection;

    constructor(
        startContainer: Node,
        startOffset: number,
        endContainer: Node,
        endOffset: number,
        direction: SelectionDirection
    ) {
        this.startContainer = startContainer;
        this.startOffset = startOffset;
        this.endContainer = endContainer;
        this.endOffset = endOffset;
        this.direction = direction;
    }

    onEvent(input: string): State {
        if (input === "selectionchange") {
            const range = getCurrentRange();
            const selection = document.getSelection();
            if (selection && selection.isCollapsed) {
                return new CursorState(range.startContainer, range.startOffset);
            } else if (selection) {
                // 불변성: 항상 새 객체 반환
                return new RangeState(
                    range.startContainer,
                    range.startOffset,
                    range.endContainer,
                    range.endOffset,
                    getSelectionDirection(selection)
                );
            }
        }
        return this;
    }

    getName(): string {
        return "RangeState";
    }
}

export class SelectionStateMachine {
    private _currentState: State;

    constructor() {
        const range = getCurrentRange();
        const selection = document.getSelection();
        if (selection && selection.isCollapsed) {
            this._currentState = new CursorState(
                range.startContainer,
                range.startOffset
            );
        } else if (selection) {
            this._currentState = new RangeState(
                range.startContainer,
                range.startOffset,
                range.endContainer,
                range.endOffset,
                getSelectionDirection(selection)
            );
        } else {
            throw new Error(
                "No selection found during SelectionStateMachine initialization."
            );
        }
        document.addEventListener("selectionchange", (event) => {
            this.transition(event);
        });
    }

    transition(event: Event): void {
        const eventType = event.type;

        if (eventType !== "selectionchange") {
            throw new Error(`Unhandled event type: ${eventType}`);
        }

        const nextState = this._currentState.onEvent(eventType);
        this._currentState = nextState;
    }

    getState(): State {
        return this._currentState;
    }

    isCursor(): boolean {
        return this._currentState instanceof CursorState;
    }

    isRange(): boolean {
        return this._currentState instanceof RangeState;
    }
}
