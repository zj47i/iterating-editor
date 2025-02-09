// hello-world.test.js
import "@testing-library/jest-dom";
import { Synchronizer } from "./syncronizer";
import { StateNode } from "../state-node/state-node";

test("syncEditor", () => {
    // 테스트할 DOM 작성
    document.body.innerHTML = `
    <div id="@editor">Hello World!</div>
  `;

    const dom = document.getElementById("@editor") as HTMLDivElement;
    const state = StateNode.createRootState();
});
