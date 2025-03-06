import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock";

test("absorb", () => {
    const vdom = mockVdom();
    vdom.nestedParagraph1.absorb(vdom.nestedParagraph2);
    const len = vdom.nestedParagraph1.children.length;
    expect(vdom.nestedParagraph1.children[len-1]).toBe(vdom.span7);
    expect(vdom.nestedParagraph2.parent).toBe(null);
});
