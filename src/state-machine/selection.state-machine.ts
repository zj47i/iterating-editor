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

/**
 * Factory class for creating State objects from selection data
 */
class StateFactory {
    static createFromSelection(): State | null {
        try {
            const range = getCurrentRange();
            const selection = document.getSelection();
            
            if (selection && selection.isCollapsed) {
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
        } catch (error) {
            // Return null if no valid selection is found
            return null;
        }
        return null;
    }
}

/**
 * Base state class with common onEvent implementation
 */
abstract class BaseState implements State {
    abstract startContainer: Node;
    abstract startOffset: number;
    abstract endContainer: Node;
    abstract endOffset: number;

    onEvent(input: string): State {
        if (input === "selectionchange") {
            const newState = StateFactory.createFromSelection();
            return newState || this;
        }
        return this;
    }

    abstract getName(): string;
}

class CursorState extends BaseState {
    startContainer: Node;
    startOffset: number;
    /**
     * 커서 상태에서는 endContainer, endOffset이 항상 start와 동일함
     */
    endContainer: Node;
    endOffset: number;

    constructor(container: Node, offset: number) {
        super();
        this.startContainer = container;
        this.startOffset = offset;
        this.endContainer = container;
        this.endOffset = offset;
    }

    getName(): string {
        return "CursorState";
    }
}

class RangeState extends BaseState {
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
        super();
        this.startContainer = startContainer;
        this.startOffset = startOffset;
        this.endContainer = endContainer;
        this.endOffset = endOffset;
        this.direction = direction;
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
            console.info("selectionchange: ", event);
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

    /**
     * Internal method to update state from current selection, with target element validation
     */
    private updateStateFromSelection(requireTargetElement: boolean = true): void {
        const selection = document.getSelection();
        
        // Check if selection is within target element when required
        if (requireTargetElement && 
            (!selection || 
             !selection.anchorNode || 
             !this._targetElement.contains(selection.anchorNode))) {
            return;
        }

        const newState = StateFactory.createFromSelection();
        if (newState) {
            this._currentState = newState;
        }
    }

    transition(event: Event): void {
        const eventType = event.type;
        if (eventType !== "selectionchange") {
            throw new Error(`Unhandled event type: ${eventType}`);
        }
        this.updateStateFromSelection(false);
    }

    getState(): State {
        return this._currentState;
    }

    /**
     * Forces an immediate update of the selection state by reading from the current DOM selection.
     * This is useful when we need up-to-date selection information before selectionchange events fire.
     */
    forceUpdate(): void {
        try {
            this.updateStateFromSelection(true);
        } catch (error) {
            // If there's no valid selection, keep the current state
            console.warn("SelectionStateMachine.forceUpdate(): No valid selection found", error);
        }
    }

    isCursor(): boolean {
        return this._currentState instanceof CursorState;
    }

    isRange(): boolean {
        return this._currentState instanceof RangeState;
    }
}
