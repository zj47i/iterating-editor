import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock.spec";

test("remove", () => {
    const vdom = mockVdom();
    vdom.nestedParagraph1.remove();
    expect(vdom.paragraph2.getChildren()[0]).toBe(vdom.span4);
    expect(vdom.paragraph2.getChildren()[1]).toBe(vdom.nestedParagraph2);
});
