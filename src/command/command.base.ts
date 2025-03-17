import { Synchronizer } from "../syncronizer/syncronizer";

export class CommandBase {
    protected static instance?: any;

    protected constructor(sync: Synchronizer) {}

    static getInstance<T extends CommandBase>(
        sync: Synchronizer
    ): T {
        if (!this.instance) {
            this.instance = new this(sync);
        }
        return this.instance;
    }
}
