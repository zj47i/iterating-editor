import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock.spec";

test("empty", () => {
    const vdom = mockVdom();
    vdom.paragraph3.empty();
    expect(vdom.paragraph3.getChildren().length).toEqual(0);
});
