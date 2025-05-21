import { EditorSelectionObject } from "../editor.selection.ts";
import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { CommandBase } from "./command.base.ts";

export class ShortcutUndo extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(selection: EditorSelectionObject) {
        console.log("ShortcutUndo$");
        this.sync.undo();
    }
}
