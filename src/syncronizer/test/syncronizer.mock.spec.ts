import { DomNode } from "../../dom/dom-node";
import { VDomNode } from "../../vdom/vdom-node";
import { VDomNodeType } from "../../vdom/vdom-node.enum";
import { Synchronizer } from "../syncronizer";

/**
 *
 * <div id="@editor">
 *  <p>
 *      <span>hello</span>
 *  </p>
 *  <p>
 *      <span>world</span>
 *  </p>
 * </div>
 */

export const mockSyncronizer = () => {
    document.body.innerHTML = `
    <div id="@editor"></div>
  `;

    const div = document.getElementById("@editor");
    const dom = new DomNode(div!);
    const vDom = VDomNode.createRootNode();
    const sync = new Synchronizer(dom, vDom);

    const vP1 = new VDomNode(VDomNodeType.PARAGRAPH);
    sync.appendNewVDomNode(vDom, vP1);
    const p1 = sync.findDomNodeFrom(vP1);

    const vSpan1 = VDomNode.createVSpan("hello");
    sync.appendNewVDomNode(vP1, vSpan1);
    const span1 = sync.findDomNodeFrom(vSpan1);

    const vP2 = new VDomNode(VDomNodeType.PARAGRAPH);
    sync.appendNewVDomNode(vDom, vP2);
    const p2 = sync.findDomNodeFrom(vP2);

    const vSpan2 = VDomNode.createVSpan("world");
    sync.appendNewVDomNode(vP2, vSpan2);
    const span2 = sync.findDomNodeFrom(vSpan2);

    return {
        dom,
        vDom,
        sync,
        vP1,
        p1,
        vSpan1,
        span1,
        vP2,
        p2,
        vSpan2,
        span2,
    };
};
