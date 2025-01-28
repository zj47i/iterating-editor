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

import { StateNode } from "./state-node";

export function mockStateTree2() {
    const root = new StateNode("root");

    // paragraph1 구성
    const paragraph1 = new StateNode("paragraph1", root);
    root.appendNode(paragraph1);

    const span1 = new StateNode("span1", paragraph1);
    span1.text = "Span1 - Paragraph1";
    paragraph1.appendNode(span1);

    const span2 = new StateNode("span2", paragraph1);
    span2.text = "Span2 - Paragraph1";
    paragraph1.appendNode(span2);

    const span3 = new StateNode("span3", paragraph1);
    span3.text = "Span3 - Paragraph1";
    paragraph1.appendNode(span3);

    // paragraph2 구성
    const paragraph2 = new StateNode("paragraph2", root);
    root.appendNode(paragraph2);

    const span4 = new StateNode("span4", paragraph2);
    span4.text = "Span4 - Paragraph2";
    paragraph2.appendNode(span4);

    const nestedParagraph1 = new StateNode("nestedParagraph1", paragraph2);
    paragraph2.appendNode(nestedParagraph1);

    const span5 = new StateNode("span5", nestedParagraph1);
    span5.text = "Span5 - NestedParagraph1";
    nestedParagraph1.appendNode(span5);

    const span6 = new StateNode("span6", nestedParagraph1);
    span6.text = "Span6 - NestedParagraph1";
    nestedParagraph1.appendNode(span6);

    const nestedParagraph2 = new StateNode("nestedParagraph2", paragraph2);
    paragraph2.appendNode(nestedParagraph2);

    const span7 = new StateNode("span7", nestedParagraph2);
    span7.text = "Span7 - NestedParagraph2";
    nestedParagraph2.appendNode(span7);

    const span8 = new StateNode("span8", nestedParagraph2);
    span8.text = "Span8 - NestedParagraph2";
    nestedParagraph2.appendNode(span8);

    // paragraph3 구성
    const paragraph3 = new StateNode("paragraph3", root);
    root.appendNode(paragraph3);

    const span9 = new StateNode("span9", paragraph3);
    span9.text = "Span9 - Paragraph3";
    paragraph3.appendNode(span9);

    const span9Child1 = new StateNode("span9Child1", span9);
    span9Child1.text = "Span9Child1 - Span9";
    span9.appendNode(span9Child1);

    const span9Child2 = new StateNode("span9Child2", span9);
    span9Child2.text = "Span9Child2 - Span9";
    span9.appendNode(span9Child2);

    const span10 = new StateNode("span10", paragraph3);
    span10.text = "Span10 - Paragraph3";
    paragraph3.appendNode(span10);

    const span10Child1 = new StateNode("span10Child1", span10);
    span10Child1.text = "Span10Child1 - Span10";
    span10.appendNode(span10Child1);

    const span10Child2 = new StateNode("span10Child2", span10);
    span10Child2.text = "Span10Child2 - Span10";
    span10.appendNode(span10Child2);

    const span10Child2Nested1 = new StateNode(
        "span10Child2Nested1",
        span10Child2
    );
    span10Child2Nested1.text = "Span10Child2Nested1 - Span10Child2";
    span10Child2.appendNode(span10Child2Nested1);

    const span10Child2Nested2 = new StateNode(
        "span10Child2Nested2",
        span10Child2
    );
    span10Child2Nested2.text = "Span10Child2Nested2 - Span10Child2";
    span10Child2.appendNode(span10Child2Nested2);

    const nestedParagraph3 = new StateNode("nestedParagraph3", paragraph3);
    paragraph3.appendNode(nestedParagraph3);

    const span11 = new StateNode("span11", nestedParagraph3);
    span11.text = "Span11 - NestedParagraph3";
    nestedParagraph3.appendNode(span11);

    const span12 = new StateNode("span12", nestedParagraph3);
    span12.text = "Span12 - NestedParagraph3";
    nestedParagraph3.appendNode(span12);

    const deepNestedParagraph1 = new StateNode(
        "deepNestedParagraph1",
        nestedParagraph3
    );
    nestedParagraph3.appendNode(deepNestedParagraph1);

    const span13 = new StateNode("span13", deepNestedParagraph1);
    span13.text = "Span13 - DeepNestedParagraph1";
    deepNestedParagraph1.appendNode(span13);

    const span14 = new StateNode("span14", deepNestedParagraph1);
    span14.text = "Span14 - DeepNestedParagraph1";
    deepNestedParagraph1.appendNode(span14);

    // paragraph4 구성
    const paragraph4 = new StateNode("paragraph4", root);
    root.appendNode(paragraph4);

    const span15 = new StateNode("span15", paragraph4);
    span15.text = "Span15 - Paragraph4";
    paragraph4.appendNode(span15);

    const span16 = new StateNode("span16", paragraph4);
    span16.text = "Span16 - Paragraph4";
    paragraph4.appendNode(span16);

    const nestedParagraph4 = new StateNode("nestedParagraph4", paragraph4);
    paragraph4.appendNode(nestedParagraph4);

    const span17 = new StateNode("span17", nestedParagraph4);
    span17.text = "Span17 - NestedParagraph4";
    nestedParagraph4.appendNode(span17);

    const span18 = new StateNode("span18", nestedParagraph4);
    span18.text = "Span18 - NestedParagraph4";
    nestedParagraph4.appendNode(span18);

    const deeperNestedParagraph = new StateNode(
        "deeperNestedParagraph",
        nestedParagraph4
    );
    nestedParagraph4.appendNode(deeperNestedParagraph);

    const span19 = new StateNode("span19", deeperNestedParagraph);
    span19.text = "Span19 - DeeperNestedParagraph";
    deeperNestedParagraph.appendNode(span19);

    const span20 = new StateNode("span20", deeperNestedParagraph);
    span20.text = "Span20 - DeeperNestedParagraph";
    deeperNestedParagraph.appendNode(span20);

    // paragraph5 구성
    const paragraph5 = new StateNode("paragraph5", root);
    root.appendNode(paragraph5);

    const span21 = new StateNode("span21", paragraph5);
    span21.text = "Span21 - Paragraph5";
    paragraph5.appendNode(span21);

    const span22 = new StateNode("span22", paragraph5);
    span22.text = "Span22 - Paragraph5";
    paragraph5.appendNode(span22);

    const span23 = new StateNode("span23", paragraph5);
    span23.text = "Span23 - Paragraph5";
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
