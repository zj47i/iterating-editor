import { Equatable } from "./equatable.interface";

export const LCS = <T extends Equatable<T>>(a: T[], b: T[]): T[] => {
    const i = a.length;
    const j = b.length;
    const dp = Array.from({ length: i + 1 }, () =>
        Array.from({ length: j + 1 }, () => 0)
    );
    for (let x = 1; x <= i; x++) {
        for (let y = 1; y <= j; y++) {
            if (a[x - 1].isEqual(b[y - 1])) {
                dp[x][y] = dp[x - 1][y - 1] + 1;
            } else {
                dp[x][y] = Math.max(dp[x - 1][y], dp[x][y - 1]);
            }
        }
    }
    const lcs: T[] = [];
    let x = i;
    let y = j;
    while (x > 0 && y > 0) {
        if (a[x - 1].isEqual(b[y - 1])) {
            lcs.unshift(a[x - 1]);
            x--;
            y--;
        } else if (dp[x - 1][y] > dp[x][y - 1]) {
            x--;
        } else {
            y--;
        }
    }
    return lcs;
};
