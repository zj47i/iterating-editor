import { Editor } from "./editor";
import "./style.css";

const editorDiv = document.getElementById("@editor") as HTMLDivElement;
const editor = new Editor(editorDiv);
