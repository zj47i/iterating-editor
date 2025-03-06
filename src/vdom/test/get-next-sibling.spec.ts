import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock";

test("getNextSibling", () => {
    const vdom = mockVdom();
    expect(vdom.span5.getNextSibling()).toBe(vdom.span6);
    expect(vdom.paragraph3.getNextSibling()).toBe(vdom.paragraph4);
    expect(vdom.paragraph5.getNextSibling()).toBe(undefined);
});
