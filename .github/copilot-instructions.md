# Iterating Editor - Copilot Instructions

## 프로젝트 개요

Iterating Editor는 **가상 DOM(Virtual DOM)과 실제 DOM의 동기화**를 통해 효율적인 텍스트 편집 기능을 구현하는 TypeScript 프로젝트입니다. 이 프로젝트는 브라우저 기반 텍스트 에디터로, 다양한 텍스트 조작 명령과 키보드 단축키를 제공하며, 상태 머신을 통한 선택 및 조합 상태 관리를 지원합니다.

## 핵심 아키텍처

프로젝트는 **DOM-VDOM 동기화 패턴**을 중심으로 설계되었습니다:

1. **Virtual DOM (VDOM)**: 편집기의 내부 상태를 표현하는 가상 문서 구조
2. **Real DOM**: 실제 브라우저에 렌더링되는 HTML 요소들
3. **Synchronizer**: VDOM과 Real DOM 간의 상태를 동기화하는 핵심 컴포넌트
4. **Command System**: 사용자 입력을 처리하고 VDOM을 업데이트하는 명령 시스템

## 디렉토리 구조

### 📁 src/ - 주요 소스 코드
- **main.ts**: 애플리케이션 진입점. 에디터 인스턴스 생성 및 초기화
- **editor.ts**: 메인 Editor 클래스

#### 📁 src/dom/ - Real DOM 조작
실제 HTML DOM 요소들을 조작하고 관리하는 코드:
- DOM 노드 생성, 삭제, 수정
- DOM 트리 탐색 및 조작
- HTML 요소의 속성 및 스타일 관리

#### 📁 src/vdom/ - Virtual DOM 구현
편집기의 내부 상태를 표현하는 가상 DOM 구조:
- 가상 노드 클래스 정의 (`VDomNode`)
- 가상 DOM 트리 구조 관리
- 노드 타입 열거형 (`VDomNodeType`)

#### 📁 src/syncronizer/ - 동기화 알고리즘
VDOM과 Real DOM 간의 상태 동기화를 담당하는 핵심 모듈:
- **syncronizer.ts**: 메인 동기화 클래스
- **algorithm/**: LCS(Longest Common Subsequence) 및 편집 스크립트 알고리즘
- **undo-redo-manager.ts**: 실행 취소/다시 실행 기능
- 변경사항 감지 및 최소한의 DOM 업데이트 수행

#### 📁 src/command/ - 명령 시스템
사용자 입력 및 텍스트 조작 명령을 처리:
- **command.ts**: 메인 Command 클래스, 이벤트 리스너 관리
- **input.handler.ts**: 텍스트 입력 처리
- **delete.handler.ts**, **backspace.handler.ts**: 삭제 명령 처리
- **enter.handler.ts**: 엔터키 처리 (단락 나누기)
- **shortcut.format.ts**: 텍스트 포맷팅 단축키 (볼드, 이탤릭 등)
- **shortcut.undo.ts**: 실행 취소 단축키
- **selection/**: 커서 및 선택 영역 관리

#### 📁 src/state-machine/ - 상태 머신
편집기의 다양한 상태를 관리:
- **selection.state-machine.ts**: 텍스트 선택 상태 (커서/범위)
- **composition.state-machine.ts**: 한글 입력 등 조합 상태

#### 📁 src/enum/ - 열거형 및 타입
- **text-format.ts**: 텍스트 포맷 타입 정의 (볼드, 이탤릭 등)

#### 📁 src/interface/ - 인터페이스 정의
공통 인터페이스 및 타입 정의

## 주요 파일 및 역할

### 🚀 main.ts (애플리케이션 진입점)
```typescript
// 핵심 컴포넌트들을 초기화하고 연결
const dom = new DomNode(editorDiv);           // Real DOM 래퍼
const vDom = VDomNode.createRootNode();       // Virtual DOM 루트
const sync = new Synchronizer(dom, vDom);     // 동기화 관리자
const editor = new Editor(dom, vDom, sync);   // 메인 에디터

// 상태 머신들
const compositionStateMachine = new CompositionStateMachine(editorDiv);
const selectionStateMachine = new SelectionStateMachine();

// 명령 시스템
const command = new Command(sync, editorDiv, compositionStateMachine, selectionStateMachine);
```

### 🔄 Synchronizer (src/syncronizer/syncronizer.ts)
- VDOM과 Real DOM 간의 동기화를 담당하는 핵심 클래스
- LCS 알고리즘을 사용하여 최소한의 DOM 변경사항 계산
- 실행 취소/다시 실행을 위한 상태 저장
- 커서 위치 복원 기능

### 🎯 Command System (src/command/)
- 키보드 이벤트 및 사용자 입력을 처리
- Handler 패턴을 사용하여 각 명령을 모듈화
- Singleton 패턴으로 Handler 인스턴스 관리

## 기본 동작 흐름

1. **사용자 입력** → Command 시스템에서 감지
2. **Handler 실행** → 해당 입력에 맞는 Handler가 VDOM 업데이트
3. **동기화** → Synchronizer가 VDOM 변경사항을 감지하고 Real DOM에 반영
4. **상태 저장** → 실행 취소를 위한 상태 스냅샷 저장

## 개발 워크플로우

### 설치 및 실행
```bash
npm install          # 의존성 설치
npm run dev         # 개발 서버 실행 (Vite)
npm run build       # 프로덕션 빌드
npm run test        # Jest 테스트 실행
```

### 주요 기술 스택
- **TypeScript**: 타입 안전성을 위한 주 개발 언어
- **Vite**: 빌드 도구 및 개발 서버
- **Jest**: 단위 테스트 프레임워크
- **lodash**: 유틸리티 함수
- **RxJS**: 리액티브 프로그래밍 (일부 기능)

### 테스트 구조
- 각 모듈별로 `test/` 디렉토리에 테스트 파일 위치
- Jest를 사용한 단위 테스트
- Mock 객체를 활용한 동기화 테스트

## 코딩 컨벤션 및 패턴

### 주요 디자인 패턴
- **Observer Pattern**: 상태 변경 감지
- **Command Pattern**: 명령 시스템
- **Singleton Pattern**: Handler 클래스들
- **State Machine Pattern**: 선택 및 조합 상태 관리

### 명명 규칙
- 클래스: PascalCase (예: `VDomNode`, `Synchronizer`)
- 메서드/변수: camelCase (예: `getChildren`, `startContainer`)
- 파일명: kebab-case 또는 camelCase (예: `dom-node.ts`, `syncronizer.ts`)

### 에러 처리
- 명시적인 타입 체크 및 에러 throw
- null/undefined 검사를 통한 방어적 프로그래밍

## Copilot 작업 시 주의사항

1. **동기화 유지**: VDOM 변경 시 반드시 Synchronizer를 통해 Real DOM과 동기화
2. **상태 일관성**: 상태 머신의 상태 변경 시 다른 컴포넌트와의 일관성 유지
3. **메모리 관리**: 이벤트 리스너 및 참조 해제에 주의
4. **테스트 작성**: 새로운 기능 추가 시 해당 테스트 케이스 작성
5. **타입 안전성**: TypeScript의 타입 시스템을 적극 활용

이 문서는 GitHub Copilot이 iterating-editor 프로젝트를 이해하고 효과적으로 작업할 수 있도록 돕기 위해 작성되었습니다.