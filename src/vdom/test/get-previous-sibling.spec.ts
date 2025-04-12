import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock.spec";

test("getPreviousSibling", () => {
    const vdom = mockVdom();
    expect(vdom.span6.getPreviousSibling()).toBe(vdom.span5);
    expect(vdom.paragraph4.getPreviousSibling()).toBe(vdom.paragraph3);
    expect(vdom.paragraph1.getPreviousSibling()).toBe(null);
});
