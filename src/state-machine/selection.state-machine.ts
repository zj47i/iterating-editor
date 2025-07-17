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
    private _targetElement: HTMLElement;
    private _listener: (event: Event) => void;

    constructor(targetElement: HTMLElement) {
        this._targetElement = targetElement;
        this._currentState = null as any;
        this._listener = (event: Event) => {
            const selection = document.getSelection();
            if (
                selection &&
                selection.anchorNode &&
                this._targetElement.contains(selection.anchorNode)
            ) {
                console.info("SelectionStateMachine: Transitioning state");
                this.transition(event);
            }
            else {
                console.warn("SelectionStateMachine: Event not in target element");
            }
        };
        document.addEventListener("selectionchange", this._listener);
    }

    transition(event: Event): void {
        const eventType = event.type;
        if (eventType !== "selectionchange") {
            throw new Error(`Unhandled event type: ${eventType}`);
        }
        // selectionchange가 발생한 시점에만 상태를 갱신
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
            this._currentState = null as any;
        }
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
