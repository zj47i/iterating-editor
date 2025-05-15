import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock.spec";

test("remove", () => {
    const vdom = mockVdom();
    vdom.paragraph2.detach(vdom.nestedParagraph1);
    expect(vdom.paragraph2.getChildren()[0]).toBe(vdom.span4);
    expect(vdom.paragraph2.getChildren()[1]).toBe(vdom.nestedParagraph2);
});
