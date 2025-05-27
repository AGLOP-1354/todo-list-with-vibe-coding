# 📋 할 일 칸반보드 (Todo Kanban Board)

React와 Firebase를 사용한 드래그 앤 드롭 기능이 있는 할 일 관리 애플리케이션입니다.

## ✨ 주요 기능

- 📝 **할 일 관리**: 할 일 추가, 수정, 삭제
- 🎯 **칸반보드**: 드래그 앤 드롭으로 상태 변경 (할 일 → 진행 중 → 완료)
- 🏷️ **우선순위 설정**: 높음, 보통, 낮음 우선순위 지정
- 🔍 **필터링**: 상태별, 우선순위별 필터링
- 📊 **실시간 통계**: 각 상태별 할 일 개수 표시
- 💾 **실시간 동기화**: Firebase Firestore를 통한 실시간 데이터 동기화
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- 🛠️ **개발자 도구**: 연결 상태 확인, 샘플 데이터 생성

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript
- **스타일링**: Tailwind CSS
- **드래그 앤 드롭**: @dnd-kit
- **백엔드**: Firebase Firestore
- **아이콘**: React Icons
- **빌드 도구**: Create React App

## 📦 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd todo-list-with-vibe-coding
```

### 2. 의존성 설치

```bash
npm install
```

### 3. Firebase 설정

Firebase 설정이 필요합니다. 자세한 설정 방법은 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)를 참고하세요.

프로젝트 루트에 `.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 4. 애플리케이션 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 📋 사용 방법

### 할 일 추가

1. 우상단의 "➕ 새 할 일" 버튼 클릭
2. 제목, 설명, 우선순위 입력
3. "추가" 버튼 클릭

### 상태 변경

- 드래그 앤 드롭으로 할 일을 다른 컬럼으로 이동
- 할 일 → 진행 중 → 완료 순서로 진행

### 할 일 수정/삭제

- 할 일 카드의 "✏️" 버튼으로 수정
- 할 일 카드의 "🗑️" 버튼으로 삭제

### 필터링

- 상태별 필터: 전체, 할 일, 진행 중, 완료
- 우선순위별 필터: 전체, 높음, 보통, 낮음

## 🛠️ 개발자 도구

애플리케이션 우하단의 🛠️ 버튼을 클릭하여 개발자 도구에 접근할 수 있습니다:

- **연결 상태 확인**: Firebase 연결 상태 테스트
- **샘플 데이터 생성**: 테스트용 할 일 데이터 생성
- **모든 데이터 삭제**: 모든 할 일 데이터 삭제

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── todo/           # 할 일 관련 컴포넌트
│   ├── ui/             # UI 컴포넌트
│   └── KanbanBoard.tsx # 칸반보드 메인 컴포넌트
├── hooks/              # 커스텀 훅
├── services/           # Firebase 서비스
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── config/             # 설정 파일
└── styles/             # 스타일 파일
```

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 테스트 커버리지
npm test -- --coverage
```

## 🏗️ 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 파일 미리보기
npx serve -s build
```

## 🔧 문제 해결

일반적인 문제와 해결 방법은 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)를 참고하세요.

### 자주 발생하는 문제

1. **Firebase 연결 오류**

   - `.env.local` 파일의 환경 변수 확인
   - Firebase 프로젝트 설정 확인

2. **드래그 앤 드롭이 작동하지 않음**

   - 브라우저 호환성 확인
   - 터치 디바이스에서는 길게 누르기 후 드래그

3. **데이터가 저장되지 않음**
   - Firestore 보안 규칙 확인
   - 네트워크 연결 상태 확인

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말

- [Create React App](https://github.com/facebook/create-react-app) - React 애플리케이션 부트스트랩
- [Firebase](https://firebase.google.com/) - 백엔드 서비스
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [@dnd-kit](https://dndkit.com/) - 드래그 앤 드롭 라이브러리
- [React Icons](https://react-icons.github.io/react-icons/) - 아이콘 라이브러리

---

💡 **팁**: 개발 중에는 개발자 도구를 활용하여 Firebase 연결 상태를 확인하고 샘플 데이터로 테스트해보세요!
