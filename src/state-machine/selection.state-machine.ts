interface State {
    onEvent(input: string): State;
    getName(): string;
}

class IdleState implements State {
    name = "IdleState";
    onEvent(input: string): State {
        if (input === "selectionchange") {
            const selection = document.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (
                    range.startContainer === range.endContainer &&
                    range.startOffset === range.endOffset
                ) {
                    return new CursorState();
                } else {
                    return new RangeState(
                        range.startContainer,
                        range.endContainer,
                        range.startOffset,
                        range.endOffset
                    );
                }
            }
        }
        return this;
    }
    getName(): string {
        return this.name;
    }
}

class CursorState implements State {
    name = "CursorState";
    onEvent(input: string): State {
        if (input === "selectionchange") {
            const selection = document.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (
                    range.startContainer !== range.endContainer ||
                    range.startOffset !== range.endOffset
                ) {
                    return new RangeState(
                        range.startContainer,
                        range.endContainer,
                        range.startOffset,
                        range.endOffset
                    );
                }
            }
        }
        return this;
    }
    getName(): string {
        return this.name;
    }
}

class RangeState implements State {
    name = "RangeState";
    private startContainer: Node;
    private endContainer: Node;
    private startOffset: number;
    private endOffset: number;

    constructor(
        startContainer: Node,
        endContainer: Node,
        startOffset: number,
        endOffset: number
    ) {
        this.startContainer = startContainer;
        this.endContainer = endContainer;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
    }

    onEvent(input: string): State {
        if (input === "selectionchange") {
            const selection = document.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (
                    range.startContainer === range.endContainer &&
                    range.startOffset === range.endOffset
                ) {
                    return new CursorState();
                }
            }
        }
        return this;
    }

    getName(): string {
        return this.name;
    }

    getRangeDetails(): {
        startContainer: Node;
        endContainer: Node;
        startOffset: number;
        endOffset: number;
    } {
        return {
            startContainer: this.startContainer,
            endContainer: this.endContainer,
            startOffset: this.startOffset,
            endOffset: this.endOffset,
        };
    }
}

export class SelectionStateMachine {
    private _currentState: State;

    constructor() {
        this._currentState = new IdleState();
        document.addEventListener("selectionchange", (event) => {
            console.log("selectionchange event:", event);
            console.log(event.target);
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

        console.log(
            `Transitioning from ${this._currentState.getName()} to ${nextState.getName()} on event ${eventType}`
        );

        this._currentState = nextState;
    }

    getState(): State {
        return this._currentState;
    }

    isCursorSelection(): boolean {
        return this._currentState instanceof CursorState;
    }

    isRangeSelection(): boolean {
        return this._currentState instanceof RangeState;
    }

    getRangeDetails(): {
        startContainer: Node;
        endContainer: Node;
        startOffset: number;
        endOffset: number;
    } | null {
        if (this._currentState instanceof RangeState) {
            return this._currentState.getRangeDetails();
        }
        return null;
    }
}
