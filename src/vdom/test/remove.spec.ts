import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock";

test("remove", () => {
    const vdom = mockVdom();
    vdom.nestedParagraph1.remove();
    expect(vdom.paragraph2.children[0]).toBe(vdom.span4);
    expect(vdom.paragraph2.children[1]).toBe(vdom.nestedParagraph2);
});
