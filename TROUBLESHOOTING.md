# Firebase 연결 문제 해결 가이드

이 문서는 Firebase 연결 문제를 진단하고 해결하는 방법을 안내합니다.

## 🔍 문제 진단 단계

### 1단계: 환경 변수 확인

```bash
# .env 파일이 프로젝트 루트에 있는지 확인
ls -la .env

# 환경 변수 내용 확인 (민감한 정보 주의)
cat .env
```

**확인 사항:**

- `.env` 파일이 프로젝트 루트 디렉토리에 있는가?
- 모든 필수 환경 변수가 설정되어 있는가?
- 환경 변수 이름이 `REACT_APP_`로 시작하는가?

### 2단계: Firebase 프로젝트 설정 확인

**Firebase Console에서 확인:**

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. 프로젝트 설정 > 일반 탭에서 웹 앱 설정 확인
4. Firestore Database가 생성되어 있는지 확인

### 3단계: 애플리케이션 진단 도구 사용

1. 애플리케이션 실행: `npm start`
2. 브라우저에서 `http://localhost:3000` 접속
3. 개발자 도구(F12) 열기
4. 콘솔 탭에서 Firebase 관련 로그 확인
5. 우하단 🛠️ 버튼 클릭하여 개발자 도구 열기
6. "환경 변수 확인" 버튼 클릭
7. "Firebase 연결 테스트" 버튼 클릭

## ❌ 일반적인 오류와 해결 방법

### 1. 환경 변수 인식 안됨

**증상:**

```
⚠️ 다음 환경 변수가 설정되지 않았습니다: [...]
```

**해결 방법:**

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 `REACT_APP_`로 시작하는지 확인
3. 애플리케이션 재시작: `npm start`

### 2. 권한 오류 (permission-denied)

**증상:**

```
🚫 권한 오류: Firestore 보안 규칙을 확인해주세요.
```

**해결 방법:**

1. Firebase Console > Firestore Database > 규칙 탭 이동
2. 다음 규칙으로 변경:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. "게시" 버튼 클릭

### 3. 프로젝트 찾을 수 없음 (not-found)

**증상:**

```
🔍 프로젝트 오류: Firebase 프로젝트 ID를 확인해주세요.
```

**해결 방법:**

1. Firebase Console에서 프로젝트 ID 확인
2. `.env` 파일의 `REACT_APP_FIREBASE_PROJECT_ID` 값 수정
3. 애플리케이션 재시작

### 4. Firestore 데이터베이스 미생성 (failed-precondition)

**증상:**

```
🏗️ Firestore 데이터베이스가 생성되지 않았습니다.
```

**해결 방법:**

1. Firebase Console > Firestore Database 메뉴 선택
2. "데이터베이스 만들기" 클릭
3. "테스트 모드에서 시작" 선택
4. 위치 선택 (아시아 태평양 권장: `asia-northeast3`)

### 5. 네트워크 오류 (unavailable)

**증상:**

```
🌐 네트워크 오류: 인터넷 연결을 확인해주세요.
```

**해결 방법:**

1. 인터넷 연결 상태 확인
2. 방화벽 설정 확인
3. VPN 사용 시 비활성화 후 재시도

## 🔧 고급 문제 해결

### Firebase 설정 초기화

```bash
# 1. node_modules 삭제
rm -rf node_modules

# 2. package-lock.json 삭제
rm package-lock.json

# 3. 의존성 재설치
npm install

# 4. 애플리케이션 재시작
npm start
```

### 브라우저 캐시 초기화

1. 개발자 도구(F12) 열기
2. Network 탭 선택
3. "Disable cache" 체크
4. 페이지 새로고침 (Ctrl+F5 또는 Cmd+Shift+R)

### Firebase CLI를 통한 프로젝트 확인

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 목록 확인
firebase projects:list

# 특정 프로젝트 정보 확인
firebase use your-project-id
firebase firestore:indexes
```

## 📞 추가 지원

### 로그 수집

문제가 지속될 경우 다음 정보를 수집해주세요:

1. **브라우저 콘솔 로그:**

   - F12 > Console 탭의 모든 메시지 복사

2. **환경 변수 확인:**

   ```bash
   # 민감한 정보는 마스킹하여 공유
   cat .env | sed 's/=.*/=***MASKED***/'
   ```

3. **시스템 정보:**
   - 운영체제 및 버전
   - Node.js 버전: `node --version`
   - npm 버전: `npm --version`
   - 브라우저 및 버전

### 유용한 링크

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 보안 규칙](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase 프로젝트 설정](https://firebase.google.com/docs/web/setup)

---

이 가이드로 문제가 해결되지 않으면 개발자에게 문의해주세요.
