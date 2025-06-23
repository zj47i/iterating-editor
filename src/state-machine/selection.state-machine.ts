export interface State {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
    onEvent(input: string): State;
    getName(): string;
}

class CursorState implements State {
    startContainer: Node;
    startOffset: number;
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
            const selection = document.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (selection.isCollapsed) {
                    this.startContainer = range.startContainer;
                    this.startOffset = range.startOffset;
                    this.endContainer = range.startContainer;
                    this.endOffset = range.startOffset;
                } else {
                    return new RangeState(
                        range.startContainer,
                        range.startOffset,
                        range.endContainer,
                        range.endOffset,
                        selection.direction
                    );
                }
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
    direction: string;

    constructor(
        startContainer: Node,
        startOffset: number,
        endContainer: Node,
        endOffset: number,
        direction: string
    ) {
        this.startContainer = startContainer;
        this.startOffset = startOffset;
        this.endContainer = endContainer;
        this.endOffset = endOffset;
        this.direction = direction;
    }

    onEvent(input: string): State {
        if (input === "selectionchange") {
            const selection = document.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (selection.isCollapsed) {
                    return new CursorState(
                        range.startContainer,
                        range.startOffset
                    );
                } else {
                    this.startContainer = range.startContainer;
                    this.startOffset = range.startOffset;
                    this.endContainer = range.endContainer;
                    this.endOffset = range.endOffset;
                    this.direction = selection.direction;
                }
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
        this._currentState = new CursorState(document.body, 0);
        document.addEventListener("selectionchange", (event) => {
            this.transition(event);
        });
    }

    transition(event: Event): void {
        const eventType = event.type;

        if (eventType !== "selectionchange") {
            console.error(`Unhandled event type: ${eventType}`);
            return;
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
