interface VDomNode {
    type: string;
    attributes: {
        bold?: boolean;
        [key: string]: any;
    };
    next?: VDomNode;
}

interface Selection {
    start: VDomNode;
    end: VDomNode;
}
