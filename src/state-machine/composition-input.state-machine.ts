// Q
// keydown -> compositionstart -> compositionupdate -> compositionend -> input

// 입력 이벤트 상태 정의
enum InputState {
    IDLE = "idle",
    KEYDOWN = "keydown",
    COMPOSITION_START = "compositionstart",
    COMPOSITION_UPDATE = "compositionupdate",
    COMPOSITION_END = "compositionend",
    INPUT = "input",
}

// 상태 인터페이스
interface State {
    name: string;
    transition(input: InputState): State;
}

class IdleState implements State {
    name = InputState.IDLE;

    transition(input: InputState): State {
        if (input === InputState.KEYDOWN) {
            return new KeydownState();
        }
        return this;
    }
}

// 각 상태 구현
class KeydownState implements State {
    name = InputState.KEYDOWN;

    transition(input: InputState): State {
        if (input === InputState.COMPOSITION_START) {
            return new CompositionStartState();
        }
        return this;
    }
}

class CompositionStartState implements State {
    name = InputState.COMPOSITION_START;

    transition(input: InputState): State {
        if (input === InputState.COMPOSITION_UPDATE) {
            return new CompositionUpdateState();
        }
        return this;
    }
}

class CompositionUpdateState implements State {
    name = InputState.COMPOSITION_UPDATE;

    transition(input: InputState): State {
        if (input === InputState.COMPOSITION_END) {
            return new CompositionEndState();
        }
        return this;
    }
}

class CompositionEndState implements State {
    name = InputState.COMPOSITION_END;

    transition(input: InputState): State {
        if (input === InputState.INPUT) {
            return new InputStateFinal();
        }
        return this;
    }
}

class InputStateFinal implements State {
    name = InputState.INPUT;

    transition(_: InputState): State {
        return this; // 종단 상태: 변하지 않음
    }
}

// 상태 기계 정의
export class CompositionInputStateMachine {
    private _currentState: State;

    constructor() {
        this._currentState = new IdleState(); // 초기 상태
    }

    public transition(input: InputState) {
        this._currentState = this._currentState.transition(input);
    }

    public get currentState(): string {
        return this._currentState.name;
    }

    public reset() {
        this._currentState = new IdleState();
    }
}
