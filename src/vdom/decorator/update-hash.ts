import { VDomNode } from "../vdom-node";

const fnv1a = (str: string) => {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash +=
            (hash << 1) +
            (hash << 4) +
            (hash << 7) +
            (hash << 8) +
            (hash << 24);
    }
    return (hash >>> 0).toString(16);
};

export function UpdateHash() {
    return function (
        _target: Object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ): void {
        const original = descriptor.value!;
        descriptor.value = function (...args: any[]) {
            const result = original.apply(this, args);

            if (VDomNode.HASH_LOCKED) return result;

            const data = JSON.stringify({
                id: this.id,
                text: this.getText(),
                format: this.getFormats(),
                childrenHash: this.getChildren().map((c: any) => c.hash),
            });
            this.hash = fnv1a(data);
            let parent = this.parent;
            while (parent) {
                parent.hash = fnv1a(
                    JSON.stringify({
                        id: parent.id,
                        text: parent.getText(),
                        format: parent.getFormats(),
                        childrenHash: parent
                            .getChildren()
                            .map((c: any) => c.hash),
                    })
                );
                parent = parent.parent;
            }
            return result;
        };
    };
}
