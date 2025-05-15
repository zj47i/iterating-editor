import { Equatable } from "../../../interface/equatable.interface";
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
    const toString = (arr: Char[]): string =>
        arr.map((c) => c.toString()).join("");

    test("1", () => {
        const a = toCharArray("ABCBDAB");
        const b = toCharArray("BDCAB");
        const result = LCS(a, b);
        expect(toString(result)).toBe("BDAB");
    });

    test("2", () => {
        const a = toCharArray("");
        const b = toCharArray("ABC");
        const result = LCS(a, b);
        expect(toString(result)).toBe("");
    });

    test("3", () => {
        const a = toCharArray("HELLO");
        const b = toCharArray("HELLO");
        const result = LCS(a, b);
        expect(toString(result)).toBe("HELLO");
    });

    test("4", () => {
        const a = toCharArray("ABC");
        const b = toCharArray("XYZ");
        const result = LCS(a, b);
        expect(toString(result)).toBe("");
    });

    test("5", () => {
        const a = toCharArray("AGGTAB");
        const b = toCharArray("GXTXAYB");
        const result = LCS(a, b);
        expect(toString(result)).toBe("GTAB");
    });

    test("6", () => {
        const a = toCharArray("ABCDEFG");
        const b = toCharArray("ACEGXYZ");
        const result = LCS(a, b);
        expect(toString(result)).toBe("ACEG");
    });

    test("7", () => {
        const a = toCharArray("ABAZDC");
        const b = toCharArray("BACBAD");
        const result = LCS(a, b);
        expect(toString(result)).toBe("ABAD");
    });
});
