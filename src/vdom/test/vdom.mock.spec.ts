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

    const span1 = new VDomNode(VDomNodeType.SPAN);
    span1.setText("span1");
    paragraph1.attachLast(span1);

    const span2 = new VDomNode(VDomNodeType.SPAN);
    span2.setText("span2");
    paragraph1.attachLast(span2);

    const span3 = new VDomNode(VDomNodeType.SPAN);
    span3.setText("span3");
    paragraph1.attachLast(span3);

    // paragraph2 구성
    const paragraph2 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph2);

    const span4 = new VDomNode(VDomNodeType.SPAN);
    span4.setText("span4");
    paragraph2.attachLast(span4);

    // 중첩 paragraph within paragraph2
    const nestedParagraph1 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph2.attachLast(nestedParagraph1);

    const span5 = new VDomNode(VDomNodeType.SPAN);
    span5.setText("span5");
    nestedParagraph1.attachLast(span5);

    const span6 = new VDomNode(VDomNodeType.SPAN);
    span6.setText("span6");
    nestedParagraph1.attachLast(span6);

    const nestedParagraph2 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph2.attachLast(nestedParagraph2);

    const span7 = new VDomNode(VDomNodeType.SPAN);
    span7.setText("span7");
    nestedParagraph2.attachLast(span7);

    // paragraph3 구성
    const paragraph3 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph3);

    const span8 = new VDomNode(VDomNodeType.SPAN);
    span8.setText("span8");
    paragraph3.attachLast(span8);

    // 위 for문 대신 풀어서
    const span9 = new VDomNode(VDomNodeType.SPAN);
    span9.setText("span9");
    paragraph3.attachLast(span9);

    const span10 = new VDomNode(VDomNodeType.SPAN);
    span10.setText("span10");
    paragraph3.attachLast(span10);

    const span11 = new VDomNode(VDomNodeType.SPAN);
    span11.setText("span11");
    paragraph3.attachLast(span11);

    const span12 = new VDomNode(VDomNodeType.SPAN);
    span12.setText("span12");
    paragraph3.attachLast(span12);

    const span13 = new VDomNode(VDomNodeType.SPAN);
    span13.setText("span13");
    paragraph3.attachLast(span13);

    const span14 = new VDomNode(VDomNodeType.SPAN);
    span14.setText("span14");
    paragraph3.attachLast(span14);

    const span15 = new VDomNode(VDomNodeType.SPAN);
    span15.setText("span15");
    paragraph3.attachLast(span15);

    // paragraph4 구성
    const paragraph4 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph4);

    const span16 = new VDomNode(VDomNodeType.SPAN);
    span16.setText("span16");
    paragraph4.attachLast(span16);

    // paragraph4 내 중첩 구조 추가
    const nestedParagraph3 = new VDomNode(VDomNodeType.PARAGRAPH);
    paragraph4.attachLast(nestedParagraph3);

    const span17 = new VDomNode(VDomNodeType.SPAN);
    span17.setText("span17");
    nestedParagraph3.attachLast(span17);

    const span18 = new VDomNode(VDomNodeType.SPAN);
    span18.setText("span18");
    nestedParagraph3.attachLast(span18);

    // paragraph5 구성
    const paragraph5 = new VDomNode(VDomNodeType.PARAGRAPH);
    root.attachLast(paragraph5);

    const span19 = new VDomNode(VDomNodeType.SPAN);
    span19.setText("span19");
    paragraph5.attachLast(span19);

    const span20 = new VDomNode(VDomNodeType.SPAN);
    span20.setText("span20");
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
