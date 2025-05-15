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

    const span1 = VDomNode.createVSpan("Span1 - Paragraph1");
    paragraph1.attachLast(span1);

    const span2 = VDomNode.createVSpan("Span2 - Paragraph1");
    paragraph1.attachLast(span2);

    const span3 = VDomNode.createVSpan("Span3 - Paragraph1");
    paragraph1.attachLast(span3);

    // paragraph2 구성
    const paragraph2 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph2);

    const span4 = VDomNode.createVSpan("Span4 - Paragraph2");
    paragraph2.attachLast(span4);

    const nestedParagraph1 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph2.attachLast(nestedParagraph1);

    const span5 = VDomNode.createVSpan("Span5 - NestedParagraph1");
    nestedParagraph1.attachLast(span5);

    const span6 = VDomNode.createVSpan("Span6 - NestedParagraph1");
    nestedParagraph1.attachLast(span6);

    const nestedParagraph2 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph2.attachLast(nestedParagraph2);

    const span7 = VDomNode.createVSpan("Span7 - NestedParagraph2");
    nestedParagraph2.attachLast(span7);

    const span8 = VDomNode.createVSpan("Span8 - NestedParagraph2");
    nestedParagraph2.attachLast(span8);

    // paragraph3 구성
    const paragraph3 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph3);

    const span9 = VDomNode.createVSpan("Span9 - Paragraph3");
    paragraph3.attachLast(span9);

    const span9Child1 = VDomNode.createVSpan("Span9Child1 - Span9");
    span9.attachLast(span9Child1);

    const span9Child2 = VDomNode.createVSpan("Span9Child2 - Span9");
    span9.attachLast(span9Child2);

    const span10 = VDomNode.createVSpan("Span10 - Paragraph3");
    paragraph3.attachLast(span10);

    const span10Child1 = VDomNode.createVSpan("Span10Child1 - Span10");
    span10.attachLast(span10Child1);

    const span10Child2 = VDomNode.createVSpan("Span10Child2 - Span10");
    span10.attachLast(span10Child2);

    const span10Child2Nested1 = VDomNode.createVSpan("Span10Child2Nested1 - Span10Child2");
    span10Child2.attachLast(span10Child2Nested1);

    const span10Child2Nested2 = VDomNode.createVSpan("Span10Child2Nested2 - Span10Child2");
    span10Child2.attachLast(span10Child2Nested2);

    const nestedParagraph3 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph3.attachLast(nestedParagraph3);

    const span11 = VDomNode.createVSpan("Span11 - NestedParagraph3");
    nestedParagraph3.attachLast(span11);

    const span12 = VDomNode.createVSpan("Span12 - NestedParagraph3");
    nestedParagraph3.attachLast(span12);

    const deepNestedParagraph1 = new VDomNode(VDomNodeType.PARAGRAPH);
    nestedParagraph3.attachLast(deepNestedParagraph1);

    const span13 = VDomNode.createVSpan("Span13 - DeepNestedParagraph1");
    deepNestedParagraph1.attachLast(span13);

    const span14 = VDomNode.createVSpan("Span14 - DeepNestedParagraph1");
    deepNestedParagraph1.attachLast(span14);

    // paragraph4 구성
    const paragraph4 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph4);

    const span15 = VDomNode.createVSpan("Span15 - Paragraph4");
    paragraph4.attachLast(span15);

    const span16 = VDomNode.createVSpan("Span16 - Paragraph4");
    paragraph4.attachLast(span16);

    const nestedParagraph4 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph4.attachLast(nestedParagraph4);

    const span17 = VDomNode.createVSpan("Span17 - NestedParagraph4");
    nestedParagraph4.attachLast(span17);

    const span18 = VDomNode.createVSpan("Span18 - NestedParagraph4");
    nestedParagraph4.attachLast(span18);

    const deeperNestedParagraph = new VDomNode(VDomNodeType.PARAGRAPH);
    nestedParagraph4.attachLast(deeperNestedParagraph);

    const span19 = VDomNode.createVSpan("Span19 - DeeperNestedParagraph");
    deeperNestedParagraph.attachLast(span19);

    const span20 = VDomNode.createVSpan("Span20 - DeeperNestedParagraph");
    deeperNestedParagraph.attachLast(span20);

    // paragraph5 구성
    const paragraph5 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph5);

    const span21 = VDomNode.createVSpan("Span21 - Paragraph5");
    paragraph5.attachLast(span21);

    const span22 = VDomNode.createVSpan("Span22 - Paragraph5");
    paragraph5.attachLast(span22);

    const span23 = VDomNode.createVSpan("Span23 - Paragraph5");
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
