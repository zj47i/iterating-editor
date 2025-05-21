// idle -> compositionstart -> compositionupdate -> compositionend -> idle
interface State {
    onEvent(input: string): State;
    getName(): string;
}

class IdleState implements State {
    name = "IdleState";
    onEvent(input: string): State {
        if (input === "compositionstart") {
            return new CompositionStartState();
        }
        return this;
    }
    getName(): string {
        return this.name;
    }
}

class CompositionStartState implements State {
    name = "CompositionStartState";
    onEvent(input: string): State {
        if (input === "compositionupdate") {
            return new CompositionUpdateState();
        }
        return this;
    }
    getName(): string {
        return this.name;
    }
}

class CompositionUpdateState implements State {
    name = "CompositionUpdateState";
    onEvent(input: string): State {
        if (input === "compositionend") {
            // 오타 수정
            return new IdleState();
        }
        return this;
    }
    getName(): string {
        return this.name;
    }
}

// 상태 기계 정의
export class CompositionStateMachine {
    private _currentState: State;
    private _target: EventTarget;

    constructor(target: EventTarget) {
        this._currentState = new IdleState();
        this._target = target;
        this._target.addEventListener("compositionstart", (event) => {
            this.transition(event);
        });

        this._target.addEventListener("compositionupdate", (event) => {
            this.transition(event);
        });

        this._target.addEventListener("compositionend", (event) => {
            this.transition(event);
        });
    }

    transition(event: Event): void {
        const eventType = event.type;
        const nextState = this._currentState.onEvent(eventType);

        if (
            this._currentState instanceof CompositionUpdateState &&
            eventType === "compositionend"
        ) {
            const customEvent = new CustomEvent("editorinput", {
                detail: event,
            });
            this._target.dispatchEvent(customEvent);
        }

        this._currentState = nextState;
    }

    getState(): State {
        return this._currentState;
    }
}
