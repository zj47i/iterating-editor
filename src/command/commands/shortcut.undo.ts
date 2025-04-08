import { Synchronizer } from "../../syncronizer/syncronizer";
import { CommandBase } from "../command.base";

export class ShortcutUndo extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(selection: Selection) {
        console.log("ShortcutUndo");
        this.sync.undo();
    }
}
