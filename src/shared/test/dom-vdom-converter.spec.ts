import { DomVDomConverter } from '../dom-vdom-converter';
import { VDomNode } from '../../vdom/vdom-node';
import { VDomNodeType } from '../../vdom/vdom-node.enum';
import { DomNode } from '../../dom/dom-node';

describe('DomVDomConverter', () => {
    beforeEach(() => {
        // Reset VDOM ID sequence for consistent tests
        VDomNode.VDOM_ID_SEQ = 0;
    });

    describe('createDomFromVDom', () => {
        it('should create span DomNode from VDomNode', () => {
            const vdom = VDomNode.createVSpan('test text');
            const dom = DomVDomConverter.createDomFromVDom(vdom);
            
            expect(dom.getNodeName()).toBe('SPAN');
            expect(dom.getText()).toBe('test text');
        });

        it('should create paragraph DomNode from VDomNode', () => {
            const vdom = new VDomNode(VDomNodeType.PARAGRAPH);
            const dom = DomVDomConverter.createDomFromVDom(vdom);
            
            expect(dom.getNodeName()).toBe('P');
            expect(dom.getElement().innerHTML).toBe('<br>');
        });

        it('should throw error for unknown VDomNode type', () => {
            const vdom = new VDomNode(VDomNodeType.ROOT);
            expect(() => DomVDomConverter.createDomFromVDom(vdom)).toThrow('Unknown vdom node type: root');
        });
    });

    describe('createDomTreeFromVDom', () => {
        it('should create complete DOM tree from VDOM tree', () => {
            const vdomRoot = new VDomNode(VDomNodeType.PARAGRAPH);
            const vdomChild1 = VDomNode.createVSpan('child1');
            const vdomChild2 = VDomNode.createVSpan('child2');
            
            vdomRoot.attachLast(vdomChild1);
            vdomRoot.attachLast(vdomChild2);
            
            const domRoot = DomVDomConverter.createDomTreeFromVDom(vdomRoot);
            
            expect(domRoot.getNodeName()).toBe('P');
            expect(domRoot.getChildren().length).toBe(2);
            expect(domRoot.getChildren()[0].getText()).toBe('child1');
            expect(domRoot.getChildren()[1].getText()).toBe('child2');
        });
    });

    describe('createVDomFromElement', () => {
        it('should create VDomNode from paragraph element', () => {
            const element = document.createElement('p');
            const vdom = DomVDomConverter.createVDomFromElement(element);
            
            expect(vdom.type).toBe(VDomNodeType.PARAGRAPH);
        });

        it('should create VDomNode from span element', () => {
            const element = document.createElement('span');
            element.textContent = 'test text';
            const vdom = DomVDomConverter.createVDomFromElement(element);
            
            expect(vdom.type).toBe(VDomNodeType.SPAN);
            expect(vdom.getText()).toBe('test text');
        });

        it('should throw error for span with null textContent', () => {
            const element = document.createElement('span');
            element.textContent = null;
            expect(() => DomVDomConverter.createVDomFromElement(element)).toThrow('textContent is null');
        });

        it('should throw error for unknown element type', () => {
            const element = document.createElement('div');
            expect(() => DomVDomConverter.createVDomFromElement(element)).toThrow('Unknown element type: DIV');
        });
    });

    describe('createVDomTreeFromElement', () => {
        it('should create complete VDOM tree from DOM element', () => {
            const rootElement = document.createElement('p');
            const child1Element = document.createElement('span');
            const child2Element = document.createElement('span');
            
            child1Element.textContent = 'child1';
            child2Element.textContent = 'child2';
            
            rootElement.appendChild(child1Element);
            rootElement.appendChild(child2Element);
            
            const vdomRoot = DomVDomConverter.createVDomTreeFromElement(rootElement);
            
            expect(vdomRoot.type).toBe(VDomNodeType.PARAGRAPH);
            expect(vdomRoot.getChildren().length).toBe(2);
            expect(vdomRoot.getChildren()[0].getText()).toBe('child1');
            expect(vdomRoot.getChildren()[1].getText()).toBe('child2');
        });

        it('should filter out BR elements when creating VDOM tree', () => {
            const rootElement = document.createElement('p');
            const spanElement = document.createElement('span');
            const brElement = document.createElement('br');
            
            spanElement.textContent = 'text';
            rootElement.appendChild(spanElement);
            rootElement.appendChild(brElement);
            
            const vdomRoot = DomVDomConverter.createVDomTreeFromElement(rootElement);
            
            expect(vdomRoot.getChildren().length).toBe(1);
            expect(vdomRoot.getChildren()[0].getText()).toBe('text');
        });
    });
});