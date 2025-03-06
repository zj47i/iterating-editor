// Root Node (root)
// ├── Paragraph1 (paragraph1)
// │   ├── Span1 (span1)
// │   ├── Span2 (span2)
// │   └── Span3 (span3)
// ├── Paragraph2 (paragraph2)
// │   ├── Span4 (span4)
// │   ├── NestedParagraph1 (nestedParagraph1)
// │   │   ├── Span5 (span5)
// │   │   └── Span6 (span6)
// │   └── NestedParagraph2 (nestedParagraph2)
// │       ├── Span7 (span7)
// │       └── Span8 (span8)
// ├── Paragraph3 (paragraph3)
// │   ├── Span9 (span9)
// |   |   ├── Span9Child1 (span9Child1)
// |   |   ├── Span9Child2 (span9Child2)
// │   ├── Span10 (span10)
// │   │   ├── Span10Child1 (span10Child1)
// │   │   └── Span10Child2 (span10Child2)
// │   │       ├── Span10Child2Nested1 (span10Child2Nested1)
// │   │       └── Span10Child2Nested2 (span10Child2Nested2)
// │   └── NestedParagraph3 (nestedParagraph3)
// │       ├── Span11 (span11)
// │       ├── Span12 (span12)
// │       └── DeepNestedParagraph1 (deepNestedParagraph1)
// │           ├── Span13 (span13)
// │           └── Span14 (span14)
// ├── Paragraph4 (paragraph4)
// │   ├── Span15 (span15)
// │   ├── Span16 (span16)
// │   └── NestedParagraph4 (nestedParagraph4)
// │       ├── Span17 (span17)
// │       ├── Span18 (span18)
// │       └── DeeperNestedParagraph (deeperNestedParagraph)
// │           ├── Span19 (span19)
// │           └── Span20 (span20)
// └── Paragraph5 (paragraph5)
//     ├── Span21 (span21)
//     ├── Span22 (span22)
//     └── Span23 (span23)

import { StateNode } from "../state-node";
import { StateNodeType } from "../state-node.enum";

export function mockVdom2() {
    const root = new StateNode(StateNodeType.ROOT);

    // paragraph1 구성
    const paragraph1 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph1);

    const span1 = new StateNode(StateNodeType.SPAN);
    span1.setText("Span1 - Paragraph1");
    paragraph1.appendNode(span1);

    const span2 = new StateNode(StateNodeType.SPAN);
    span2.setText("Span2 - Paragraph1");
    paragraph1.appendNode(span2);

    const span3 = new StateNode(StateNodeType.SPAN);
    span3.setText("Span3 - Paragraph1");
    paragraph1.appendNode(span3);

    // paragraph2 구성
    const paragraph2 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph2);

    const span4 = new StateNode(StateNodeType.SPAN);
    span4.setText("Span4 - Paragraph2");
    paragraph2.appendNode(span4);

    const nestedParagraph1 = new StateNode(StateNodeType.PARAGRAPH);
    paragraph2.appendNode(nestedParagraph1);

    const span5 = new StateNode(StateNodeType.SPAN);
    span5.setText("Span5 - NestedParagraph1");
    nestedParagraph1.appendNode(span5);

    const span6 = new StateNode(StateNodeType.SPAN);
    span6.setText("Span6 - NestedParagraph1");
    nestedParagraph1.appendNode(span6);

    const nestedParagraph2 = new StateNode(StateNodeType.PARAGRAPH);
    paragraph2.appendNode(nestedParagraph2);

    const span7 = new StateNode(StateNodeType.SPAN);
    span7.setText("Span7 - NestedParagraph2");
    nestedParagraph2.appendNode(span7);

    const span8 = new StateNode(StateNodeType.SPAN);
    span8.setText("Span8 - NestedParagraph2");
    nestedParagraph2.appendNode(span8);

    // paragraph3 구성
    const paragraph3 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph3);

    const span9 = new StateNode(StateNodeType.SPAN);
    span9.setText("Span9 - Paragraph3");
    paragraph3.appendNode(span9);

    const span9Child1 = new StateNode(StateNodeType.SPAN);
    span9Child1.setText("Span9Child1 - Span9");
    span9.appendNode(span9Child1);

    const span9Child2 = new StateNode(StateNodeType.SPAN);
    span9Child2.setText("Span9Child2 - Span9");
    span9.appendNode(span9Child2);

    const span10 = new StateNode(StateNodeType.SPAN);
    span10.setText("Span10 - Paragraph3");
    paragraph3.appendNode(span10);

    const span10Child1 = new StateNode(StateNodeType.SPAN);
    span10Child1.setText("Span10Child1 - Span10");
    span10.appendNode(span10Child1);

    const span10Child2 = new StateNode(StateNodeType.SPAN);
    span10Child2.setText("Span10Child2 - Span10");
    span10.appendNode(span10Child2);

    const span10Child2Nested1 = new StateNode(StateNodeType.SPAN);
    span10Child2Nested1.setText("Span10Child2Nested1 - Span10Child2");
    span10Child2.appendNode(span10Child2Nested1);

    const span10Child2Nested2 = new StateNode(StateNodeType.SPAN);
    span10Child2Nested2.setText("Span10Child2Nested2 - Span10Child2");
    span10Child2.appendNode(span10Child2Nested2);

    const nestedParagraph3 = new StateNode(StateNodeType.PARAGRAPH);
    paragraph3.appendNode(nestedParagraph3);

    const span11 = new StateNode(StateNodeType.SPAN);
    span11.setText("Span11 - NestedParagraph3");
    nestedParagraph3.appendNode(span11);

    const span12 = new StateNode(StateNodeType.SPAN);
    span12.setText("Span12 - NestedParagraph3");
    nestedParagraph3.appendNode(span12);

    const deepNestedParagraph1 = new StateNode(StateNodeType.PARAGRAPH);
    nestedParagraph3.appendNode(deepNestedParagraph1);

    const span13 = new StateNode(StateNodeType.SPAN);
    span13.setText("Span13 - DeepNestedParagraph1");
    deepNestedParagraph1.appendNode(span13);

    const span14 = new StateNode(StateNodeType.SPAN);
    span14.setText("Span14 - DeepNestedParagraph1");
    deepNestedParagraph1.appendNode(span14);

    // paragraph4 구성
    const paragraph4 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph4);

    const span15 = new StateNode(StateNodeType.SPAN);
    span15.setText("Span15 - Paragraph4");
    paragraph4.appendNode(span15);

    const span16 = new StateNode(StateNodeType.SPAN);
    span16.setText("Span16 - Paragraph4");
    paragraph4.appendNode(span16);

    const nestedParagraph4 = new StateNode(StateNodeType.PARAGRAPH);
    paragraph4.appendNode(nestedParagraph4);

    const span17 = new StateNode(StateNodeType.SPAN);
    span17.setText("Span17 - NestedParagraph4");
    nestedParagraph4.appendNode(span17);

    const span18 = new StateNode(StateNodeType.SPAN);
    span18.setText("Span18 - NestedParagraph4");
    nestedParagraph4.appendNode(span18);

    const deeperNestedParagraph = new StateNode(StateNodeType.PARAGRAPH);
    nestedParagraph4.appendNode(deeperNestedParagraph);

    const span19 = new StateNode(StateNodeType.SPAN);
    span19.setText("Span19 - DeeperNestedParagraph");
    deeperNestedParagraph.appendNode(span19);

    const span20 = new StateNode(StateNodeType.SPAN);
    span20.setText("Span20 - DeeperNestedParagraph");
    deeperNestedParagraph.appendNode(span20);

    // paragraph5 구성
    const paragraph5 = new StateNode(StateNodeType.PARAGRAPH);
    root.appendNode(paragraph5);

    const span21 = new StateNode(StateNodeType.SPAN);
    span21.setText("Span21 - Paragraph5");
    paragraph5.appendNode(span21);

    const span22 = new StateNode(StateNodeType.SPAN);
    span22.setText("Span22 - Paragraph5");
    paragraph5.appendNode(span22);

    const span23 = new StateNode(StateNodeType.SPAN);
    span23.setText("Span23 - Paragraph5");
    paragraph5.appendNode(span23);

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
        span8,
        paragraph3,
        span9,
        span9Child1,
        span9Child2,
        span10,
        span10Child1,
        span10Child2,
        span10Child2Nested1,
        span10Child2Nested2,
        nestedParagraph3,
        span11,
        span12,
        deepNestedParagraph1,
        span13,
        span14,
        paragraph4,
        span15,
        span16,
        nestedParagraph4,
        span17,
        span18,
        deeperNestedParagraph,
        span19,
        span20,
        paragraph5,
        span21,
        span22,
        span23,
    };
}
