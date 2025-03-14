import "@testing-library/jest-dom";
import { VDomNode } from "../vdom/vdom-node";

test("syncEditor", () => {
    // 테스트할 DOM 작성
    document.body.innerHTML = `
    <div id="@editor">Hello World!</div>
  `;

    const dom = document.getElementById("@editor") as HTMLDivElement;
    const vdomNode = VDomNode.createRootNode();
});
