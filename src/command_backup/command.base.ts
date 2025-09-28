import { Synchronizer } from "../syncronizer/syncronizer";

export class CommandBase {
    protected static instance?: any;
    protected sync: Synchronizer;

    protected constructor(sync: Synchronizer) {
        this.sync = sync;
    }

    static getInstance<T extends CommandBase>(
        sync: Synchronizer
    ): T {
        if (!this.instance) {
            this.instance = new this(sync);
        }
        return this.instance;
    }
}
