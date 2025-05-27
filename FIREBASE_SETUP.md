# Firebase 설정 가이드

이 문서는 투두리스트 애플리케이션에서 Firebase를 설정하는 방법을 안내합니다.

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속합니다.
2. "프로젝트 추가"를 클릭합니다.
3. 프로젝트 이름을 입력합니다 (예: `todo-list-app`).
4. Google Analytics 설정을 선택합니다 (선택사항).
5. 프로젝트를 생성합니다.

## 2. Firestore 데이터베이스 설정

1. Firebase Console에서 생성한 프로젝트를 선택합니다.
2. 왼쪽 메뉴에서 "Firestore Database"를 클릭합니다.
3. "데이터베이스 만들기"를 클릭합니다.
4. 보안 규칙을 선택합니다:
   - **개발 단계**: "테스트 모드에서 시작" 선택
   - **프로덕션**: "프로덕션 모드에서 시작" 선택
5. 데이터베이스 위치를 선택합니다 (아시아 태평양 권장: `asia-northeast3`).

## 3. 웹 앱 등록

1. Firebase Console에서 프로젝트 설정으로 이동합니다.
2. "일반" 탭에서 "앱 추가"를 클릭합니다.
3. 웹 아이콘 (`</>`)을 선택합니다.
4. 앱 닉네임을 입력합니다 (예: `todo-list-web`).
5. Firebase Hosting 설정은 나중에 할 수 있으므로 체크하지 않습니다.
6. "앱 등록"을 클릭합니다.

## 4. 환경 변수 설정

1. Firebase Console에서 제공하는 설정 정보를 복사합니다.
2. 프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
# .env.local 파일 생성
touch .env.local
```

3. `.env.local` 파일에 Firebase 설정을 추가합니다:

```env
# Firebase 설정
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# 개발 환경 설정
NODE_ENV=development
```

## 5. Firestore 보안 규칙 설정

1. Firebase Console에서 "Firestore Database" → "규칙" 탭으로 이동합니다.
2. 다음 규칙을 복사하여 붙여넣습니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      // 개발 단계에서는 모든 읽기/쓰기 허용
      allow read, write: if true;

      // 데이터 검증 규칙
      allow create: if isValidTodoData(request.resource.data);
      allow update: if isValidTodoData(request.resource.data);
    }
  }

  function isValidTodoData(data) {
    return data.keys().hasAll(['title', 'status', 'priority', 'completed']) &&
           data.title is string &&
           data.title.size() > 0 &&
           data.title.size() <= 100 &&
           data.status in ['todo', 'in-progress', 'completed'] &&
           data.priority in ['high', 'medium', 'low'] &&
           data.completed is bool &&
           (data.description == null || (data.description is string && data.description.size() <= 500));
  }
}
```

3. "게시"를 클릭하여 규칙을 적용합니다.

## 6. 인덱스 설정

Firestore에서 효율적인 쿼리를 위해 다음 인덱스를 생성합니다:

1. Firebase Console에서 "Firestore Database" → "인덱스" 탭으로 이동합니다.
2. "복합 인덱스 추가"를 클릭합니다.
3. 다음 인덱스들을 생성합니다:

### 인덱스 1: 생성일 기준 정렬

- 컬렉션 ID: `todos`
- 필드:
  - `createdAt` (내림차순)

### 인덱스 2: 상태별 필터링

- 컬렉션 ID: `todos`
- 필드:
  - `status` (오름차순)
  - `createdAt` (내림차순)

### 인덱스 3: 우선순위별 필터링

- 컬렉션 ID: `todos`
- 필드:
  - `priority` (오름차순)
  - `createdAt` (내림차순)

## 7. 애플리케이션 실행

1. 환경 변수 설정이 완료되면 애플리케이션을 실행합니다:

```bash
npm start
```

2. 브라우저에서 `http://localhost:3000`으로 접속합니다.

3. 개발자 도구(F12)를 열고 콘솔을 확인합니다:
   - ✅ Firebase 연결 성공 메시지 확인
   - ✅ 모든 Firebase 환경 변수가 설정되었습니다 메시지 확인

## 8. 개발자 도구 사용

애플리케이션 우하단에 있는 🛠️ 버튼을 클릭하여 개발자 도구를 열 수 있습니다:

- **연결 상태 확인**: Firebase 연결 상태를 테스트합니다.
- **샘플 데이터 생성**: 테스트용 할 일 데이터를 생성합니다.
- **모든 데이터 삭제**: 모든 할 일 데이터를 삭제합니다.

## 9. 문제 해결

### 환경 변수가 인식되지 않는 경우

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인합니다.
2. 환경 변수 이름이 `REACT_APP_`로 시작하는지 확인합니다.
3. 애플리케이션을 재시작합니다 (`npm start`).

### Firebase 연결 오류

1. Firebase 프로젝트 설정이 올바른지 확인합니다.
2. Firestore 데이터베이스가 활성화되어 있는지 확인합니다.
3. 보안 규칙이 올바르게 설정되어 있는지 확인합니다.

### 권한 오류

1. Firestore 보안 규칙을 확인합니다.
2. 개발 단계에서는 `allow read, write: if true;` 규칙을 사용합니다.

## 10. 프로덕션 배포 시 주의사항

1. **보안 규칙 강화**: 사용자 인증 기반으로 보안 규칙을 수정합니다.
2. **환경 변수 보안**: API 키 등 민감한 정보를 안전하게 관리합니다.
3. **인덱스 최적화**: 실제 사용 패턴에 맞게 인덱스를 최적화합니다.
4. **모니터링 설정**: Firebase 사용량과 성능을 모니터링합니다.

---

이 가이드를 따라 설정하면 Firebase와 연동된 투두리스트 애플리케이션을 사용할 수 있습니다. 추가 질문이 있으시면 언제든지 문의해 주세요!
