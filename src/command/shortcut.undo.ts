import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { CommandBase } from "./command.base.ts";

export class ShortcutUndo extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute() {
        console.info("ShortcutUndo$");
        this.sync.undo();
    }
}
