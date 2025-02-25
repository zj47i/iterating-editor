import { StateNode } from "../state-node/state-node";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandlerBackspace } from "./command.handler.backspace";
import { CommandHandlerEnter } from "./command.handler.enter";
import { CommandHandler } from "./command.handler.interface";
import { CommandHandlerType } from "./command.handler.type";
import { CommandKeyboardEvent } from "./command.keyboard-event.enum";

export class Command {
    private keyHandlers: { [key: string]: CommandHandler } = {};
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
        this.keyHandlers["Type"] = new CommandHandlerType(
            this.editorDom,
            this.editorStateNode,
            this.sync
        );
    }

    public keydown(event: KeyboardEvent) {
        console.log(event);
        if (event.key === CommandKeyboardEvent.ENTER) {
            console.info(CommandKeyboardEvent.ENTER);
            event.preventDefault();
            this.keyHandlers[CommandKeyboardEvent.ENTER].handler(event);
        }

        if (event.key === CommandKeyboardEvent.BACKSPACE) {
            console.info(CommandKeyboardEvent.BACKSPACE);
            this.keyHandlers[CommandKeyboardEvent.BACKSPACE].handler(event);
        }

        if (event.key.length === 1) {
            console.info(CommandKeyboardEvent.TYPE);
            this.keyHandlers[CommandKeyboardEvent.TYPE].handler(event);
        }
    }
}
