// root
// ├── paragraph1
// │   ├── span1
// │   ├── span2
// │   └── span3
// ├── paragraph2
// │   ├── span4
// │   ├── nestedParagraph1
// │   │   ├── span5
// │   │   └── span6
// │   └── nestedParagraph2
// │       ├── span7
// ├── paragraph3
// │   ├── span8
// │   ├── span9
// │   ├── span10
// │   ├── span11
// │   ├── span12
// │   ├── span13
// │   ├── span14
// │   └── span15
// ├── paragraph4
// │   ├── span16
// │   └── nestedParagraph3
// │       ├── span17
// │       └── span18
// └── paragraph5
//     ├── span19
//     └── span20

import { StateNode } from "../state-node/state-node";
import { StateNodeType } from "./state-node.enum";

export function mockStateTree() {
    const root = new StateNode(StateNodeType.ROOT);

    // paragraph1 구성
    const paragraph1 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph1);

    const span1 = new StateNode(StateNodeType.SPAN);
    span1.setText("span1");
    paragraph1.appendNode(span1);

    const span2 = new StateNode(StateNodeType.SPAN);
    span2.setText("span2");
    paragraph1.appendNode(span2);

    const span3 = new StateNode(StateNodeType.SPAN);
    span3.setText("span3");
    paragraph1.appendNode(span3);

    // paragraph2 구성
    const paragraph2 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph2);

    const span4 = new StateNode(StateNodeType.SPAN);
    span4.setText("span4");
    paragraph2.appendNode(span4);

    // 중첩 paragraph within paragraph2
    const nestedParagraph1 = new StateNode(StateNodeType.PARAGRAPH);
    paragraph2.appendNode(nestedParagraph1);

    const span5 = new StateNode(StateNodeType.SPAN);
    span5.setText("span5");
    nestedParagraph1.appendNode(span5);

    const span6 = new StateNode(StateNodeType.SPAN);
    span6.setText("span6");
    nestedParagraph1.appendNode(span6);

    const nestedParagraph2 = new StateNode(StateNodeType.PARAGRAPH);
    paragraph2.appendNode(nestedParagraph2);

    const span7 = new StateNode(StateNodeType.SPAN);
    span7.setText("span7");
    nestedParagraph2.appendNode(span7);

    // paragraph3 구성
    const paragraph3 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph3);

    const span8 = new StateNode(StateNodeType.SPAN);
    span8.setText("span8");
    paragraph3.appendNode(span8);

    // 위 for문 대신 풀어서
    const span9 = new StateNode(StateNodeType.SPAN);
    span9.setText("span9");
    paragraph3.appendNode(span9);

    const span10 = new StateNode(StateNodeType.SPAN);
    span10.setText("span10");
    paragraph3.appendNode(span10);

    const span11 = new StateNode(StateNodeType.SPAN);
    span11.setText("span11");
    paragraph3.appendNode(span11);

    const span12 = new StateNode(StateNodeType.SPAN);
    span12.setText("span12");
    paragraph3.appendNode(span12);

    const span13 = new StateNode(StateNodeType.SPAN);
    span13.setText("span13");
    paragraph3.appendNode(span13);

    const span14 = new StateNode(StateNodeType.SPAN);
    span14.setText("span14");
    paragraph3.appendNode(span14);

    const span15 = new StateNode(StateNodeType.SPAN);
    span15.setText("span15");
    paragraph3.appendNode(span15);

    // paragraph4 구성
    const paragraph4 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph4);

    const span16 = new StateNode(StateNodeType.SPAN);
    span16.setText("span16");
    paragraph4.appendNode(span16);

    // paragraph4 내 중첩 구조 추가
    const nestedParagraph3 = new StateNode(StateNodeType.PARAGRAPH);
    paragraph4.appendNode(nestedParagraph3);

    const span17 = new StateNode(StateNodeType.SPAN);
    span17.setText("span17");
    nestedParagraph3.appendNode(span17);

    const span18 = new StateNode(StateNodeType.SPAN);
    span18.setText("span18");
    nestedParagraph3.appendNode(span18);

    // paragraph5 구성
    const paragraph5 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph5);

    const span19 = new StateNode(StateNodeType.SPAN);
    span19.setText("span19");
    paragraph5.appendNode(span19);

    const span20 = new StateNode(StateNodeType.SPAN);
    span20.setText("span20");
    paragraph5.appendNode(span20);

    return {
        root,
        paragraph1,
        span1,
        span2,
        span3,
        paragraph2,
        span4,
        nestedParagraph1,
        span5,
        span6,
        nestedParagraph2,
        span7,
        paragraph3,
        span8,
        span9,
        span10,
        span11,
        span12,
        span13,
        span14,
        span15,
        paragraph4,
        span16,
        nestedParagraph3,
        span17,
        span18,
        paragraph5,
        span19,
        span20,
    };
}
