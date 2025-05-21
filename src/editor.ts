import { VDomNode } from "./vdom/vdom-node";
import { VDomNodeType } from "./vdom/vdom-node.enum";
import { Synchronizer } from "./syncronizer/syncronizer";
import { DomNode } from "./dom/dom-node";

export class Editor {
    constructor(
        private dom: DomNode,
        private vdom: VDomNode,
        private sync: Synchronizer
    ) {
        this.sync.appendNewVDomNodeWithoutHook(
            this.vdom,
            new VDomNode(VDomNodeType.PARAGRAPH)
        );
    }
}
