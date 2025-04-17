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

import { VDomNode } from "../vdom-node";
import { VDomNodeType } from "../vdom-node.enum";

export function mockVdom() {
    const root = new VDomNode(VDomNodeType.ROOT);

    // paragraph1 구성
    const paragraph1 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph1);

    const span1 = VDomNode.createVSpan("span1");
    paragraph1.attachLast(span1);

    const span2 = VDomNode.createVSpan("span2");
    paragraph1.attachLast(span2);

    const span3 = VDomNode.createVSpan("span3");
    paragraph1.attachLast(span3);

    // paragraph2 구성
    const paragraph2 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph2);

    const span4 = VDomNode.createVSpan("span4");
    paragraph2.attachLast(span4);

    // 중첩 paragraph within paragraph2
    const nestedParagraph1 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph2.attachLast(nestedParagraph1);

    const span5 = VDomNode.createVSpan("span5");
    nestedParagraph1.attachLast(span5);

    const span6 = VDomNode.createVSpan("span6");
    nestedParagraph1.attachLast(span6);

    const nestedParagraph2 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph2.attachLast(nestedParagraph2);

    const span7 = VDomNode.createVSpan("span7");
    nestedParagraph2.attachLast(span7);

    // paragraph3 구성
    const paragraph3 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph3);

    const span8 = VDomNode.createVSpan("span8");
    paragraph3.attachLast(span8);

    // 위 for문 대신 풀어서
    const span9 = VDomNode.createVSpan("span9");
    paragraph3.attachLast(span9);

    const span10 = VDomNode.createVSpan("span10");
    paragraph3.attachLast(span10);

    const span11 = VDomNode.createVSpan("span11");
    paragraph3.attachLast(span11);

    const span12 = VDomNode.createVSpan("span12");
    paragraph3.attachLast(span12);

    const span13 = VDomNode.createVSpan("span13");
    paragraph3.attachLast(span13);

    const span14 = VDomNode.createVSpan("span14");
    paragraph3.attachLast(span14);

    const span15 = VDomNode.createVSpan("span15");
    paragraph3.attachLast(span15);

    // paragraph4 구성
    const paragraph4 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph4);

    const span16 = VDomNode.createVSpan("span16");
    paragraph4.attachLast(span16);

    // paragraph4 내 중첩 구조 추가
    const nestedParagraph3 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph4.attachLast(nestedParagraph3);

    const span17 = VDomNode.createVSpan("span17");
    nestedParagraph3.attachLast(span17);

    const span18 = VDomNode.createVSpan("span18");
    nestedParagraph3.attachLast(span18);

    // paragraph5 구성
    const paragraph5 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph5);

    const span19 = VDomNode.createVSpan("span19");
    paragraph5.attachLast(span19);

    const span20 = VDomNode.createVSpan("span20");
    paragraph5.attachLast(span20);

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
