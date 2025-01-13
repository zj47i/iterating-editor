// hello-world.test.js
import "@testing-library/jest-dom";
import { Synchronizer } from "./syncronizer";
import { StateNode } from "./state-node";

test("초기 state 확인", () => {
    // 테스트할 DOM 작성
    document.body.innerHTML = `
    <div id="@editor">Hello World!</div>
  `;

    const dom = document.getElementById("@editor") as HTMLDivElement;
    const state = StateNode.createDefaultState();

    const sync = new Synchronizer(dom, state);
    sync.syncDom();

    expect(dom.children.length).toBe(1);
    expect(dom.children[0].tagName).toBe("P");
    expect(dom.children[0].children.length).toBe(1);
    expect(dom.children[0].children[0].tagName).toBe("SPAN");
});
