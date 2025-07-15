import "./main.css";
import { Editor } from "./editor";
import { EditorDebugger } from "./debug";

// Editor가 모든 초기화 및 의존성 관리
const editor = new Editor("@editor");
const editorDebuffer = new EditorDebugger(editor);
