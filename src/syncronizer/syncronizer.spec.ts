// hello-world.test.js
import "@testing-library/jest-dom";
import { StateNode } from "../vdom/state-node";

test("syncEditor", () => {
    // 테스트할 DOM 작성
    document.body.innerHTML = `
    <div id="@editor">Hello World!</div>
  `;

    const dom = document.getElementById("@editor") as HTMLDivElement;
    const state = StateNode.createRootState();
});
