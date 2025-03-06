import { StateNode } from "../state-node";
import { mockVdom } from "./vdom.mock";
import { mockVdom2 } from "./vdom.mock2";

test("determineLeftRight", () => {
    const state = mockVdom();

    const [left1, right1] = StateNode.determineLeftRight(
        state.span2,
        state.paragraph4
    );

    expect(left1).toBe(state.span2);
    expect(right1).toBe(state.paragraph4);

    const [left2, right2] = StateNode.determineLeftRight(
        state.span19,
        state.span18
    );
    expect(left2).toBe(state.span18);
    expect(right2).toBe(state.span19);
});

test("determineLeftRight2", () => {
    const state = mockVdom2();

    const [left1, right1] = StateNode.determineLeftRight(
        state.span2,
        state.paragraph4
    );

    expect(left1).toBe(state.span2);
    expect(right1).toBe(state.paragraph4);

    const [left2, right2] = StateNode.determineLeftRight(
        state.span19,
        state.span13
    );
    expect(left2).toBe(state.span13);
    expect(right2).toBe(state.span19);
});

test("determineLeftRight3", () => {
    const state = mockVdom2();

    const [left1, right1] = StateNode.determineLeftRight(
        state.paragraph3,
        state.span10Child2Nested1
    );

    expect(left1).toBe(state.paragraph3);
    expect(right1).toBe(state.span10Child2Nested1);

    const [left2, right2] = StateNode.determineLeftRight(
        state.span10Child2Nested1,
        state.paragraph3
    );
    expect(left1).toBe(state.paragraph3);
    expect(right1).toBe(state.span10Child2Nested1);
});