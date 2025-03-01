import { StateNode } from "../state-node/state-node";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandlerBackspace } from "./command.handler.backspace";
import { CommandHandlerEnter } from "./command.handler.enter";
import { CommandHandlerInput } from "./command.handler.input";
import { CommandHandler } from "./command.handler.interface";
import { CommandKeyboardEvent } from "./command.keyboard-event.enum";

export class Command {
    private keyHandlers: { [key: string]: CommandHandler } = {};
    private inputHandlers: { [key: string]: CommandHandler } = {};
    constructor(
        private editorDom: HTMLElement,
        private editorStateNode: StateNode,
        private sync: Synchronizer
    ) {
        this.keyHandlers["Enter"] = new CommandHandlerEnter(
            this.editorDom,
            this.editorStateNode,
            this.sync
        );
        this.keyHandlers["Backspace"] = new CommandHandlerBackspace(
            this.editorDom,
            this.editorStateNode,
            this.sync
        );
        this.inputHandlers["Input"] = new CommandHandlerInput(
            this.editorDom,
            this.editorStateNode,
            this.sync
        );
    }

    keydown(event: KeyboardEvent) {
        if (event.key === CommandKeyboardEvent.ENTER) {
            console.info(CommandKeyboardEvent.ENTER);
            event.preventDefault();
            this.keyHandlers[CommandKeyboardEvent.ENTER].handler(event);
        }

        if (event.key === CommandKeyboardEvent.BACKSPACE) {
            console.info(CommandKeyboardEvent.BACKSPACE);
            this.keyHandlers[CommandKeyboardEvent.BACKSPACE].handler(event);
        }
    }

    input(event: InputEvent) {
        this.inputHandlers["Input"].handler(event);
    }
}
