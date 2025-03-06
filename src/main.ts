import { Editor } from "./editor";
import "./style.css";
import "./debug";

const editorDiv = document.getElementById("@editor") as HTMLDivElement;
if (!(editorDiv instanceof HTMLDivElement)) {
    console.error("editor element not found");
    throw new Error("editor element not found");
}

new Editor(editorDiv);
