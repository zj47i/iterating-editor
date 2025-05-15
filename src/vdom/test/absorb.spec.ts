import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock.spec";

test("absorb", () => {
    const vdom = mockVdom();
    vdom.nestedParagraph1.absorb(vdom.nestedParagraph2);
    const len = vdom.nestedParagraph1.getChildren().length;
    expect(vdom.nestedParagraph1.getChildren()[len - 1]).toBe(vdom.span7);
    expect(vdom.nestedParagraph2.getParent()).toBe(null);
});
