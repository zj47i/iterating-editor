import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock";

test("empty", () => {
    const vdom = mockVdom();
    vdom.paragraph3.empty();
    expect(vdom.paragraph3.children.length).toEqual(0);
});
