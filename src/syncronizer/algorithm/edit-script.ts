import { Equatable } from "../../interface/equatable.interface";

export const editScript = <T extends Equatable<T>>(
    a: T[],
    b: T[],
    lcs: T[]
): { edit: "insert" | "delete" | "keep"; at: number; vnode?: T }[] => {
    let i = 0; // a index
    let j = 0; // b index
    let k = 0; // lcs index
    let pos = 0; // 가상의 현재 위치
    const script: {
        edit: "insert" | "delete" | "keep";
        at: number;
        vnode?: T;
    }[] = [];

    while (k < lcs.length) {
        const vl = lcs[k];

        // delete a[i] until a[i] == lcs[k]
        while (i < a.length && !a[i].isEqual(vl)) {
            script.push({ edit: "delete", at: pos });
            i++;
        }

        // insert b[j] until b[j] == lcs[k]
        while (j < b.length && !b[j].isEqual(vl)) {
            script.push({ edit: "insert", at: pos, vnode: b[j] });
            j++;
            pos++;
        }

        // keep
        if (i < a.length && j < b.length && a[i].isEqual(vl) && b[j].isEqual(vl)) {
            script.push({ edit: "keep", at: pos });
            i++;
            j++;
            k++;
            pos++;
        } else {
            break;
        }
    }

    // 남은 delete
    while (i < a.length) {
        script.push({ edit: "delete", at: pos });
        i++;
    }

    // 남은 insert
    while (j < b.length) {
        script.push({ edit: "insert", at: pos, vnode: b[j] });
        j++;
        pos++;
    }

    return script;
};
