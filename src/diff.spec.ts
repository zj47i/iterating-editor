import diff from "fast-diff";

test("초기 vdomNode 확인", () => {
    const from = "초기 vdomNode 확인";
    const to = "초기 stateㅁㄴㅇ 확인";
    const result = diff(from, to);
    let n = "";
    result.forEach((item) => {
        if (item[0] === 0) {
            n = n.concat(item[1]);
        } else if (item[0] === 1) {
            n = n.concat(`${item[1]}`);
        }
    });
    expect(n).toBe(to);
});
