import { Equatable } from "../equatable.interface";
import { editScript } from "../edit-script";
import { LCS } from "../lcs";

class Char implements Equatable<Char> {
    constructor(public value: string) {}

    isEqual(other: Char): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}

describe("LCS", () => {
    const toCharArray = (s: string): Char[] =>
        s.split("").map((c) => new Char(c));

    test("1", () => {
        const a = toCharArray("ABCBDAB");
        const b = toCharArray("BDCAB");
        const lcs = LCS(a, b);
        const editscript = editScript(a, b, lcs);
        expect(editscript).toEqual([
            { edit: "delete", at: 0 },
            { edit: "keep", at: 0 },
            { edit: "delete", at: 1 },
            { edit: "delete", at: 1 },
            { edit: "keep", at: 1 },
            { edit: "insert", at: 2, vnode: new Char("C") },
            { edit: "keep", at: 3 },
            { edit: "keep", at: 4 },
        ]);
    });

    test("2", () => {
        const a = toCharArray("");
        const b = toCharArray("ABC");
        const lcs = LCS(a, b);
        const editscript = editScript(a, b, lcs);
        expect(editscript).toEqual([
            { edit: "insert", at: 0, vnode: new Char("A") },
            { edit: "insert", at: 1, vnode: new Char("B") },
            { edit: "insert", at: 2, vnode: new Char("C") },
        ]);
    });

    test("3", () => {
        const a = toCharArray("HELLO");
        const b = toCharArray("HELLO");
        const lcs = LCS(a, b);
        const editscript = editScript(a, b, lcs);
        expect(editscript).toEqual([
            { edit: "keep", at: 0 },
            { edit: "keep", at: 1 },
            { edit: "keep", at: 2 },
            { edit: "keep", at: 3 },
            { edit: "keep", at: 4 },
        ]);
    });

    test("4", () => {
        const a = toCharArray("ABC");
        const b = toCharArray("XYZ");
        const lcs = LCS(a, b);
        const editscript = editScript(a, b, lcs);
        expect(editscript).toEqual([
            { edit: "delete", at: 0 },
            { edit: "delete", at: 0 },
            { edit: "delete", at: 0 },
            { edit: "insert", at: 0, vnode: new Char("X") },
            { edit: "insert", at: 1, vnode: new Char("Y") },
            { edit: "insert", at: 2, vnode: new Char("Z") },
        ]);
    });

    test("5", () => {
        const a = toCharArray("AGGTAB");
        const b = toCharArray("GXTXAYB");
        const lcs = LCS(a, b);
        const editscript = editScript(a, b, lcs);
        expect(editscript).toEqual([
            { edit: "delete", at: 0 },
            { edit: "keep", at: 0 },
            { edit: "delete", at: 1 },
            { edit: "insert", at: 1, vnode: new Char("X") },
            { edit: "keep", at: 2 },
            { edit: "insert", at: 3, vnode: new Char("X") },
            { edit: "keep", at: 4 },
            { edit: "insert", at: 5, vnode: new Char("Y") },
            { edit: "keep", at: 6 },
        ]);
    });

    test("6", () => {
        const a = toCharArray("ABCDEFG");
        const b = toCharArray("ACEGXYZ");
        const lcs = LCS(a, b);
        const editscript = editScript(a, b, lcs);
        expect(editscript).toEqual([
            { edit: "keep", at: 0 },
            { edit: "delete", at: 1 },
            { edit: "keep", at: 1 },
            { edit: "delete", at: 2 },
            { edit: "keep", at: 2 },
            { edit: "delete", at: 3 },
            { edit: "keep", at: 3 },
            { edit: "insert", at: 4, vnode: new Char("X") },
            { edit: "insert", at: 5, vnode: new Char("Y") },
            { edit: "insert", at: 6, vnode: new Char("Z") },
        ]);
    });

    test("7", () => {
        const a = toCharArray("ABAZDC");
        const b = toCharArray("BACBAD");
        const lcs = LCS(a, b);
        const editscript = editScript(a, b, lcs);
        expect(editscript).toEqual([
            { edit: "insert", at: 0, vnode: new Char("B") },
            { edit: "keep", at: 1 },
            { edit: "insert", at: 2, vnode: new Char("C") },
            { edit: "keep", at: 3 },
            { edit: "keep", at: 4 },
            { edit: "delete", at: 5 },
            { edit: "keep", at: 5 },
            { edit: "delete", at: 6 },
        ]);
    });
});
