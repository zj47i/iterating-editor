# Copilot Instructions for Iterating Editor

## 프로젝트 개요

Iterating Editor는 Virtual DOM과 Real DOM의 동기화를 통해 효율적인 텍스트 편집 기능을 제공하는 TypeScript 기반 브라우저 에디터입니다.

## 핵심 아키텍처

-   **Virtual DOM (VDOM)**: 내부 편집 상태를 표현
-   **Real DOM**: 브라우저에 렌더링되는 실제 HTML 요소
-   **Synchronizer**: VDOM과 Real DOM 간의 동기화 담당
-   **Command System**: 사용자 입력 및 명령 처리
-   **State Machine**: 선택/조합 등 에디터 상태 관리

## main.ts 초기화 흐름

1. `editorDiv`를 가져와 `contenteditable` 속성 부여
2. `DomNode`, `VDomNode` 인스턴스 생성
3. `SelectionStateMachine`, `CompositionStateMachine` 초기화
4. `Synchronizer`, `Editor` 인스턴스 생성
5. 명령 핸들러(`BackspaceHandler`, `EnterHandler`) 생성
6. `Command` 시스템에 의존성 주입하여 초기화
7. `EditorDebugger` 연결

## 의존성 주입 및 초기화 예시

```typescript
// 핵심 컴포넌트들을 초기화하고 연결
const dom = new DomNode(editorDiv); // Real DOM 래퍼
const vDom = VDomNode.createRootNode(); // Virtual DOM 루트
const sync = new Synchronizer(dom, vDom, selectionStateMachine); // 동기화 관리자
const editor = new Editor(dom, vDom, sync); // 메인 에디터

// 상태 머신들
const compositionStateMachine = new CompositionStateMachine(editorDiv);
const selectionStateMachine = new SelectionStateMachine();

// 명령 핸들러들
const backspaceHandler = new BackspaceHandler(sync);
const enterHandler = new EnterHandler(sync);

// 명령 시스템 초기화
new Command(
    sync,
    editorDiv,
    compositionStateMachine,
    selectionStateMachine,
    backspaceHandler,
    enterHandler
);

new EditorDebugger(editor);
```

## 코딩 컨벤션

-   **클래스**: PascalCase
-   **메서드/변수**: camelCase
-   **파일명**: kebab-case 또는 camelCase
-   **주요 패턴**: Observer, Command, Singleton, State Machine
-   **타입 안전성**: TypeScript 적극 활용
-   **에러 처리**: 명시적 타입 체크, null/undefined 방어

## Copilot 작업 시 주의사항

1. **동기화 유지**: VDOM 변경 시 반드시 Synchronizer를 통해 Real DOM과 동기화
2. **상태 일관성**: 상태 머신의 상태 변경 시 다른 컴포넌트와의 일관성 유지
3. **메모리 관리**: 이벤트 리스너 및 참조 해제에 주의
4. **테스트 작성**: 새로운 기능 추가 시 Jest 기반 테스트 케이스 작성
5. **의존성 주입**: 핸들러 및 상태 머신은 생성자에서 명확히 주입
