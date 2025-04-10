import { VDomNode } from "../vdom-node";

export function UpdateHash() {
    return function (
        _target: Object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ): void {
        const original = descriptor.value!;
        descriptor.value = function (...args: any[]) {
            const result = original.apply(this, args);
            if (VDomNode.HASH_LOCKED) {
                console.info("hash locked");
            } else {
                this.setHash();
                let parent = this.parent;
                while (parent) {
                    parent.setHash();
                    parent = parent.parent;
                }
            }
            return result;
        };
    };
}
