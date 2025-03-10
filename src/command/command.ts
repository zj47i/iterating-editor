import { StateNode } from "../vdom/state-node";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandlerBackspace } from "./command.handler.backspace";
import { CommandHandlerEnter } from "./command.handler.enter";
import { CommandHandlerInput } from "./command.handler.input";
import { CommandHandler } from "./command.handler.interface";
import { ShortcutHandler } from "./command.handler/shortcut/shortcut";
import { CommandKeyboardEvent } from "./command.keyboard-event.enum";

export class Command {
    private enterHandler: CommandHandler;
    private backspaceHandler: CommandHandler;
    private inputHandler: CommandHandler;
    private shortcutHandler: CommandHandler;
    constructor(
        private dom: HTMLElement,
        private vdom: StateNode,
        private sync: Synchronizer
    ) {
        this.enterHandler = new CommandHandlerEnter(
            this.dom,
            this.vdom,
            this.sync
        );
        this.backspaceHandler = new CommandHandlerBackspace(
            this.dom,
            this.vdom,
            this.sync
        );
        this.inputHandler = new CommandHandlerInput(
            this.dom,
            this.vdom,
            this.sync
        );
        this.shortcutHandler = new ShortcutHandler(
            this.dom,
            this.vdom,
            this.sync
        );
    }

    keydown(event: KeyboardEvent) {
        if (event.key === CommandKeyboardEvent.ENTER) {
            console.info(CommandKeyboardEvent.ENTER);
            this.enterHandler.handle(event);
        }

        if (event.key === CommandKeyboardEvent.BACKSPACE) {
            console.info(CommandKeyboardEvent.BACKSPACE);
            this.backspaceHandler.handle(event);
        }

        if ((event.key === "B" || event.key === "b") && event.ctrlKey) {
            this.shortcutHandler.handle(event);
        }
    }

    input(event: InputEvent) {
        this.inputHandler.handle(event);
    }
}
