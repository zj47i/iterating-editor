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

import { VDomNode } from "../vdom-node";
import { VDomNodeType } from "../vdom-node.enum";

export function mockVdom2() {
    const root = new VDomNode(VDomNodeType.ROOT);

    // paragraph1 구성
    const paragraph1 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph1);

    const span1 = new VDomNode(VDomNodeType.SPAN);
    span1.setText("Span1 - Paragraph1");
    paragraph1.attachLast(span1);

    const span2 = new VDomNode(VDomNodeType.SPAN);
    span2.setText("Span2 - Paragraph1");
    paragraph1.attachLast(span2);

    const span3 = new VDomNode(VDomNodeType.SPAN);
    span3.setText("Span3 - Paragraph1");
    paragraph1.attachLast(span3);

    // paragraph2 구성
    const paragraph2 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph2);

    const span4 = new VDomNode(VDomNodeType.SPAN);
    span4.setText("Span4 - Paragraph2");
    paragraph2.attachLast(span4);

    const nestedParagraph1 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph2.attachLast(nestedParagraph1);

    const span5 = new VDomNode(VDomNodeType.SPAN);
    span5.setText("Span5 - NestedParagraph1");
    nestedParagraph1.attachLast(span5);

    const span6 = new VDomNode(VDomNodeType.SPAN);
    span6.setText("Span6 - NestedParagraph1");
    nestedParagraph1.attachLast(span6);

    const nestedParagraph2 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph2.attachLast(nestedParagraph2);

    const span7 = new VDomNode(VDomNodeType.SPAN);
    span7.setText("Span7 - NestedParagraph2");
    nestedParagraph2.attachLast(span7);

    const span8 = new VDomNode(VDomNodeType.SPAN);
    span8.setText("Span8 - NestedParagraph2");
    nestedParagraph2.attachLast(span8);

    // paragraph3 구성
    const paragraph3 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph3);

    const span9 = new VDomNode(VDomNodeType.SPAN);
    span9.setText("Span9 - Paragraph3");
    paragraph3.attachLast(span9);

    const span9Child1 = new VDomNode(VDomNodeType.SPAN);
    span9Child1.setText("Span9Child1 - Span9");
    span9.attachLast(span9Child1);

    const span9Child2 = new VDomNode(VDomNodeType.SPAN);
    span9Child2.setText("Span9Child2 - Span9");
    span9.attachLast(span9Child2);

    const span10 = new VDomNode(VDomNodeType.SPAN);
    span10.setText("Span10 - Paragraph3");
    paragraph3.attachLast(span10);

    const span10Child1 = new VDomNode(VDomNodeType.SPAN);
    span10Child1.setText("Span10Child1 - Span10");
    span10.attachLast(span10Child1);

    const span10Child2 = new VDomNode(VDomNodeType.SPAN);
    span10Child2.setText("Span10Child2 - Span10");
    span10.attachLast(span10Child2);

    const span10Child2Nested1 = new VDomNode(VDomNodeType.SPAN);
    span10Child2Nested1.setText("Span10Child2Nested1 - Span10Child2");
    span10Child2.attachLast(span10Child2Nested1);

    const span10Child2Nested2 = new VDomNode(VDomNodeType.SPAN);
    span10Child2Nested2.setText("Span10Child2Nested2 - Span10Child2");
    span10Child2.attachLast(span10Child2Nested2);

    const nestedParagraph3 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph3.attachLast(nestedParagraph3);

    const span11 = new VDomNode(VDomNodeType.SPAN);
    span11.setText("Span11 - NestedParagraph3");
    nestedParagraph3.attachLast(span11);

    const span12 = new VDomNode(VDomNodeType.SPAN);
    span12.setText("Span12 - NestedParagraph3");
    nestedParagraph3.attachLast(span12);

    const deepNestedParagraph1 = new VDomNode(VDomNodeType.PARAGRAPH);
    nestedParagraph3.attachLast(deepNestedParagraph1);

    const span13 = new VDomNode(VDomNodeType.SPAN);
    span13.setText("Span13 - DeepNestedParagraph1");
    deepNestedParagraph1.attachLast(span13);

    const span14 = new VDomNode(VDomNodeType.SPAN);
    span14.setText("Span14 - DeepNestedParagraph1");
    deepNestedParagraph1.attachLast(span14);

    // paragraph4 구성
    const paragraph4 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph4);

    const span15 = new VDomNode(VDomNodeType.SPAN);
    span15.setText("Span15 - Paragraph4");
    paragraph4.attachLast(span15);

    const span16 = new VDomNode(VDomNodeType.SPAN);
    span16.setText("Span16 - Paragraph4");
    paragraph4.attachLast(span16);

    const nestedParagraph4 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph4.attachLast(nestedParagraph4);

    const span17 = new VDomNode(VDomNodeType.SPAN);
    span17.setText("Span17 - NestedParagraph4");
    nestedParagraph4.attachLast(span17);

    const span18 = new VDomNode(VDomNodeType.SPAN);
    span18.setText("Span18 - NestedParagraph4");
    nestedParagraph4.attachLast(span18);

    const deeperNestedParagraph = new VDomNode(VDomNodeType.PARAGRAPH);
    nestedParagraph4.attachLast(deeperNestedParagraph);

    const span19 = new VDomNode(VDomNodeType.SPAN);
    span19.setText("Span19 - DeeperNestedParagraph");
    deeperNestedParagraph.attachLast(span19);

    const span20 = new VDomNode(VDomNodeType.SPAN);
    span20.setText("Span20 - DeeperNestedParagraph");
    deeperNestedParagraph.attachLast(span20);

    // paragraph5 구성
    const paragraph5 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph5);

    const span21 = new VDomNode(VDomNodeType.SPAN);
    span21.setText("Span21 - Paragraph5");
    paragraph5.attachLast(span21);

    const span22 = new VDomNode(VDomNodeType.SPAN);
    span22.setText("Span22 - Paragraph5");
    paragraph5.attachLast(span22);

    const span23 = new VDomNode(VDomNodeType.SPAN);
    span23.setText("Span23 - Paragraph5");
    paragraph5.attachLast(span23);

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
