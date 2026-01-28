> 초기 설정부터 배포까지 단계별 절차
> 

---

## 준비 사항

### 필요한 계정

- Google 계정 (Gmail)
- GitHub 계정
- 텍스트 에디터 (VS Code 권장)

### 필요한 프로그램

- Node.js 16+ ([nodejs.org](https://nodejs.org/) 에서 다운로드)
- Git ([git-scm.com](https://git-scm.com/) 에서 다운로드)

### 확인 사항

```bash
# 터미널/명령 프롬프트에서 실행
node --version    # v16 이상 확인
npm --version     # 8 이상 확인
git --version     # 2.30 이상 확인
```

---

## 로컬 개발 환경 설정

### 1단계: GitHub에서 코드 다운로드

```bash
# GitHub 저장소 복제
git clone <https://github.com/your-username/raim-visitor-checkin.git>

# 폴더 진입
cd raim-visitor-checkin

# 의존성 설치
npm install

# 로컬 개발 서버 시작
npm run dev

```

브라우저에서 `http://localhost:5173` 접속 후 앱 실행 확인

### 2단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_PIN=1234

```

> 주의: .env.local은 .gitignore에 포함되어 있으므로 자동으로 git에 올라가지 않습니다.
> 

---

## Firebase 프로젝트 생성

### 1단계: Firebase 콘솔 접속

1. [https://console.firebase.google.com](https://console.firebase.google.com/) 방문
2. "프로젝트 추가" 클릭
3. 프로젝트명 입력: `raim-visitor-checkin`
4. "프로젝트 만들기" 클릭

### 2단계: Firestore Database 설정

1. 왼쪽 메뉴 → "Firestore Database"
2. "데이터베이스 만들기" 클릭
3. 모드 선택: **프로덕션 모드**
4. 위치: `asia-northeast3 (서울)`
5. "사용 설정" 클릭

### 3단계: Firestore 보안 규칙 설정

"규칙" 탭 → 다음 코드로 교체:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /visitors/{document=**} {
      allow read, write: if request.auth != null;
      allow delete: if false;
    }
  }
}

```

"게시" 클릭

### 4단계: 웹앱 등록

1. 프로젝트 설정 (⚙️)
2. "앱" 섹션
3. "</>" (웹앱) 선택
4. 앱 닉네임: `raim-web`
5. "앱 등록" 클릭

제공된 Firebase 설정값을 `.env.local`에 붙여넣기

### 5단계: 서비스 계정 생성 (Apps Script용)

1. 프로젝트 설정 → "서비스 계정"
2. "새 비공개 키 생성" → JSON 파일 다운로드
3. 파일 내용 저장:
    - `client_email`
    - `private_key`
    - `project_id`

---

## Google Sheets 및 Apps Script 설정

### 1단계: Google Sheets 생성

1. [https://sheets.google.com](https://sheets.google.com/) 접속
2. "새로 만들기 +" 클릭
3. 파일명: `방문자 데이터 백업`

### 2단계: Apps Script 연결

1. 메뉴 → "확장 프로그램" → "Apps Script"
2. `Code.gs` 내용 모두 삭제
3. `./public/app/script.txt` 내용 복사해서 붙여넣기

### 3단계: 설정값 수정

`Code.gs` 상단의 설정 섹션 수정:

```jsx
const CLIENT_EMAIL = "your-email@project.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\n...";
const PROJECT_ID = "your-project-id";
const COLLECTION_NAME = "visitors";
const SHEET_NAME = "시트1";
const ALERT_EMAIL = "your-email@gmail.com";
const TRIGGER_INTERVAL_HOURS = 3;

```

### 4단계: OAuth2 라이브러리 추가

1. Apps Script 왼쪽 → "라이브러리 +"
2. 스크립트 ID 입력:
    
    ```
    1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF
    
    ```
    
3. "조회" → "OAuth2" 선택 → 최신 버전 → "추가"

### 5단계: 초기 테스트

1. 함수 드롭다운에서 `backupAndDelete` 선택
2. "실행" 버튼 클릭
3. 권한 승인 팝업 → 계정 선택 → "허용"
4. 실행 로그 탭에서 성공 메시지 확인

### 6단계: 트리거 설정 (자동화)

1. 왼쪽 메뉴 → "트리거" (시계 아이콘)
2. "+ 트리거 추가" 클릭
3. 다음과 같이 설정:

| 항목 | 설정값 |
| --- | --- |
| 실행할 함수 | backupAndDelete |
| 이벤트 소스 | 시간 기반 타이머 |
| 타이머 종류 | 시간 |
| 시간 간격 | 3 |

"저장" 클릭

**권장 간격**: 3시간 (일일 1,000명+ 트래픽 대비)

---

## Vercel 배포

### 1단계: GitHub에 푸시

```bash
# 로컬 변경사항 커밋
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main

```

### 2단계: Vercel 연결

1. [https://vercel.com](https://vercel.com/) 접속
2. GitHub로 로그인
3. "New Project" 클릭
4. 저장소 선택: `raim-visitor-checkin`
5. "Import" 클릭

### 3단계: 환경 변수 설정

Vercel 프로젝트 설정에서:

1. "Settings" → "Environment Variables"
2. 다음 변수 추가 (`.env.local`에서 복사):
    - VITE_FIREBASE_API_KEY
    - VITE_FIREBASE_AUTH_DOMAIN
    - VITE_FIREBASE_PROJECT_ID
    - VITE_FIREBASE_STORAGE_BUCKET
    - VITE_FIREBASE_MESSAGING_SENDER_ID
    - VITE_FIREBASE_APP_ID
    - VITE_ADMIN_PIN

각 변수: Name, Value 입력 → Environment 모두 선택

### 4단계: 배포 실행

1. "Deployments" 탭
2. "Redeploy" 클릭 (또는 GitHub에 푸시)
3. 배포 완료 후 링크 클릭하여 앱 확인

### 향후 배포

변경사항이 생기면:

```bash
git add .
git commit -m "설명"
git push origin main

```

Vercel이 자동으로 감지하여 배포 시작

---

## 최종 확인

### 웹앱 테스트

1. Vercel 링크 접속
2. 관리자 화면 진입 (로고 3번 터치)
3. 관람실 선택 및 비밀번호 입력 (기본값: 1234)
4. 카메라 또는 수동 입력 테스트
5. "완료" 버튼 클릭 후 Firestore 저장 확인

### 자동화 테스트

1. Apps Script 대시보드 접속
2. 함수: `backupAndDelete` 선택
3. "실행" 버튼 클릭
4. 로그 확인:
    - "X개 문서 조회 및 백업 완료"
5. Google Sheets에 데이터 추가되었는지 확인

### 무료 사용량 확인

1. Firebase 콘솔 → "사용량" 탭
2. 읽기/쓰기 작업량 확인
3. 목표: 하루 40% 미만

---

## 트러블슈팅

### "VITE_FIREBASE_* 정의되지 않음" 오류

**원인**: 환경 변수 미설정

**해결책**:

1. `.env.local` 파일 존재 확인
2. 모든 Firebase 설정값 입력 확인
3. 개발 서버 재시작: `npm run dev`

### "OAuth2 함수를 찾을 수 없음" 오류

**원인**: OAuth2 라이브러리 미추가

**해결책**:

1. Apps Script → "라이브러리 +"
2. 스크립트 ID 입력 및 추가
3. 코드 재실행

### "SHEET_NAME '시트1' 찾을 수 없음" 오류

**원인**: Google Sheets 탭 이름 불일치

**해결책**:

1. Google Sheets 탭 이름 확인 (기본값: "시트1")
2. Apps Script의 SHEET_NAME 수정
3. 이름 변경 시 공백 및 특수문자 주의

### Firestore 쓰기 권한 오류

**원인**: 보안 규칙 오류

**해결책**:

1. Firebase 콘솔 → Firestore → "규칙" 탭
2. 규칙 코드 다시 확인 및 "게시"
3. 앱 새로고침

### Vercel 배포 실패

**원인**: 환경 변수 미설정 또는 빌드 오류

**해결책**:

1. Vercel 프로젝트 → "Settings" → "Environment Variables" 확인
2. 모든 변수 입력 확인
3. "Deployments" → "Redeploy" 시도

### "카메라 접근 권한 없음" 메시지

**원인**: 브라우저가 카메라 접근 허가 요청

**해결책**:

1. 브라우저 주소창 옆 카메라 아이콘 클릭
2. "허용" 선택
3. 페이지 새로고침

---