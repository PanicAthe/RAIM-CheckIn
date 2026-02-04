> 배포 후 운영을 위한 간단한 체크리스트
> 

## 권장 모니터링 사항

### 일일 (5분)

- 웹사이트 접속 확인
- Gmail 오류 알림 확인 (오류 알림이 왔다면 보수)
- Google Sheets 데이터 추가 확인
- 수동 백업 필요 시 관리자 대시보드의 "지금 백업 및 삭제 실행" 버튼으로 즉시 실행 가능

### 주간 (20분)

- Firebase 콘솔 → 사용량 확인 (목표: 40% 미만)
- Apps Script → 실행 로그 확인
- Google Sheets 데이터 추가 확인

### 월간 (1시간)

- 트리거 간격 최적화 (필요시 선택 사항)
- 데이터 백업 (Google Sheets → CSV 다운로드)
- Firebase Firestore 데이터 확인 (자동 삭제 여부 확인)

### 분기별 (2시간, 보안을 위한 선택 사항)

- 관리자 비밀번호 변경
- Firebase 서비스 계정 키 갱신
- Google Apps Script 배포 URL 검증
- 의존성 업데이트

---

## 모니터링 상세 항목

### 일일 체크리스트

```
[ ] 웹앱 로딩 <2초
[ ] 카메라 기능 정상
[ ] Gmail 오류 알림 확인
[ ] Firestore 신규 데이터 확인
[ ] Google Sheets 신규 행 확인
[ ] 필요시 관리자 대시보드에서 수동 백업 실행

```

### 주간 체크리스트

```
[ ] Firebase 사용량 확인
    - 읽기: 일 1,000~5,000회
    - 쓰기: 일 500~2,000회
[ ] Apps Script 로그 확인
    - 오류 없음
    - 타임아웃 없음
[ ] Google Sheets 용량 확인
    - 목표: 1,000만 셀 미만
    - 월 30,000명 = 약 360만 셀
[ ] 자동 백업 실행 확인 (설정된 간격마다 자동 실행)

```

### 월간 체크리스트

```
[ ] 총 방문자 수 정리
[ ] 무료 한도 사용률 확인
    - Firestore: 40% 미만
    - Google Sheets: 36% 미만
    - Apps Script: 90분 미만/일
[ ] 배포 로그 확인 (실패 있으면 원인 파악)
[ ] 데이터 백업 확인
    - Google Sheets에 최신 데이터 포함 여부
    - Firestore 삭제 여부 확인
    - CSV 다운로드 및 보관

```

### 분기별 체크리스트

```
[ ] 관리자 비밀번호 변경
    - VITE_ADMIN_PIN 수정
    - Vercel 환경 변수 업데이트
    - Git push
[ ] Firebase 서비스 계정 키 갱신
    - 새 키 생성
    - Apps Script의 CLIENT_EMAIL, PRIVATE_KEY, PROJECT_ID 수정
    - 테스트 실행 후 이전 키 삭제
[ ] Google Apps Script 배포 URL 유효성 검사
    - .env 파일의 VITE_GOOGLE_APPS_SCRIPT_URL 확인
    - 웹 앱 배포 상태 확인
    - 필요시 새 배포 생성
[ ] 의존성 업데이트
    - npm update
    - npm run build 테스트
    - Git push

```

---

## 데이터 백업 관리

### 자동 백업 (설정 간격마다)
- Google Apps Script 트리거로 자동 실행
- Firestore → Google Sheets로 데이터 이동
- 완료 후 Firestore 데이터 자동 삭제
- 오류 발생 시 설정된 이메일로 알림 전송

### 수동 백업 (필요시)
- 관리자 대시보드 진입 (로고 3번 탭)
- "데이터 백업 및 삭제" 섹션의 "지금 백업 및 삭제 실행" 버튼 클릭
- 2단계 확인 모달에서 "실행하기" 선택
- 백업 결과를 화면에서 즉시 확인 가능
- 성공: 녹색 메시지 표시
- 실패: 빨간색 에러 메시지 표시

### 트리거 설정 확인
**파일**: `public/script.txt`
- 함수: `backupAndDelete()`
- 실행 주기: 6시간마다 (권장) 또는 3시간마다
- 오류 알림: 매일 이메일 수신

---

## 연령대 및 관람실 수정

### 연령대 추가/수정

**파일 위치**: `src/constants.js`

**수정 방법**:

1. `ageGroups` 배열에서 연령대 추가/수정:

```jsx
export const ageGroups = [
  { label: "유아", sub: "0~6세", key: "infant" },
  { label: "어린이", sub: "7~12세", key: "child" },
  // 새 연령대 추가 예시:
  // { label: "청장년", sub: "30~50세", key: "adult" },
];

```

1. `AGE_GROUP_LABELS` 객체에 매핑 추가:

```jsx
export const AGE_GROUP_LABELS = {
  '유아': '유아(0~6세)',
  // 새 항목 추가 예시:
  // '청장년': '청장년(30~50세)',
};

```

1. 다국어 지원 추가 (`src/i18n/translations/ko.json`, `en.json`):

```json
{
  "ageGroups": {
    "infant": "유아",
    "infantSub": "0~6세"
    // 새 연령대 추가
  }
}

```

1. `npm run build` → `git push` (자동 배포)

### 관람실 추가/수정

**파일 위치**: `src/constants.js`

**수정 방법**:

1. `roomLocations` 배열 수정:

```jsx
export const roomLocations = [
  "상설전시",
  "기획전시",
  // 새 관람실 추가:
  "특별전시실",
  "다목적실-4"
];

```

1. `npm run build` → `git push` (자동 배포)

**커스텀 관람실 기능**:

- 관리자 대시보드에서 "직접 입력 (커스텀)" 옵션 선택 시 임의의 관람실 이름 입력 가능
- 커스텀 관람실은 코드 수정 없이 현장에서 즉시 사용 가능
- AdminLockScreen에서는 기본 목록만 선택 가능, 대시보드에서만 커스텀 입력 가능
- 커스텀 관람실도 데이터 전송 및 통계에 정상 반영됨

**주의사항**:

- 커스텀 관람실은 localStorage에 저장되며, 브라우저 데이터 삭제 시 초기화됨

---

## 트리거 간격 조정

방문자 수에 따라 트리거 간격 변경:

| 방문자 | 간격 | 사용률 |
| --- | --- | --- |
| <500명 | 6시간 | <20% |
| 500-1,000명 | 3시간 | <40% |
| 1,000-1,500명 | 3시간 | 40-60% |
| 1,500+명 | 1시간 | 60-80% |

**변경 방법:**

1. Apps Script → 트리거 (시계 아이콘)
2. 기존 트리거 삭제
3. 새 트리거 추가 (시간 간격 선택)
4. 저장

**Apps Script 코드 파일**: `./public/script.txt`

- Firebase 서비스 계정 정보 설정 필요
- OAuth2 라이브러리 추가 필수
- 상세 설치 가이드는 파일 내부 주석 참고

---

## 데이터 관리

### 자동 백업 (Apps Script)

- 주기: 설정된 간격 (1/3/6/12시간)
- 동작: Firestore → Google Sheets → Firestore 삭제

### 수동 백업 (주 1회 권장)

1. Google Sheets 열기
2. 파일 → 다운로드 → CSV로 다운로드
3. 로컬 저장: 방문자_날짜.csv

### 데이터 보관

- 기기 localStorage: 날짜별 관리 (앱 시작 시 과거 날짜 데이터 자동 삭제)
    - `visitorCount_[날짜]`: 날짜별 총 방문자 수
    - `todayVisitors_[날짜]`: 날짜별 상세 방문자 데이터
    - 관람실별로 데이터 저장 및 필터링
- Firestore: 설정된 간격 (3-12시간)
- Google Sheets: 무제한 (영구 기록)

---

## ⚠️ 문제 해결

### 1. 자동 백업 안 됨

**원인**: Apps Script 오류

**확인**:

1. Apps Script → 실행 로그 확인
2. 오류 메시지 확인

**해결 방법**:

```jsx
// Apps Script에서 backupAndDelete 수동 실행
// 오류가 표시되면 원인 파악

```

### 2. 방문자 증가로 인한 높은 API 사용량

**원인**: 트래픽 증가

**해결 방법**:

1. 현재 일일 방문자 수 확인
2. Apps Script 대시보드 → 트리거 수정, 간격 단축

### 3. 웹 안열림

**원인**:  Vercel 배포 실패

**확인**:

1. Vercel 대시보드 → Deployments
2. 빌드 로그 확인

**해결 방법**:

```bash
# 로컬에서 빌드 테스트
npm run build

# 오류 수정 후 배포
git push origin main

```

### 4. Firestore 쓰기 오류

**확인**: Firebase 콘솔 → Firestore → 규칙

- **정상 규칙**:
    
    ```jsx
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        
        // ============ 관람실 컬렉션 (선택사항) ============
        match /locations/{document=**} {
          allow read: if true;
          allow create, update, delete: if true;
        }
        
        // ============ 방문자 컬렉션 (핵심) ============
        match /visitors/{document=**} {
          // 읽기: 완전 차단
          allow read: if false;
          
          // 생성: 검증된 데이터만
          allow create: if 
            request.resource.data.keys().hasAll([
              'gender', 'ageGroup', 'location', 'timestamp'
            ])
            && (
              request.resource.data.gender == '남성' 
              || request.resource.data.gender == '여성'
              || request.resource.data.gender == 'male'
              || request.resource.data.gender == 'female'
            )
            && (
              request.resource.data.ageGroup in [
                '유아', '어린이', '청소년', 
                '청년', '중년', '노년'
              ]
              || request.resource.data.ageGroup.matches('.*유아.*')
              || request.resource.data.ageGroup.matches('.*어린이.*')
              || request.resource.data.ageGroup.matches('.*청소년.*')
              || request.resource.data.ageGroup.matches('.*청년.*')
              || request.resource.data.ageGroup.matches('.*중년.*')
              || request.resource.data.ageGroup.matches('.*노년.*')
            )
            && request.resource.data.location is string
            && request.resource.data.location.size() > 0
            && request.resource.data.location.size() < 100
            && request.resource.data.timestamp != null
            && (
              !request.resource.data.keys().hasAny(['source'])
              || request.resource.data.source in ['AI', 'manual', '수동']
            );
          
          // 수정/삭제: 완전 금지
          allow update, delete: if false;
        }
        
        // ============ 일일 통계 컬렉션 ============
        match /dailyStatistics/{document=**} {
          allow read: if true;
          allow write: if false;
        }
      }
    }
    ```
    

**수정 후**: "게시" 클릭

---

## 백업 기능 상세

### 수동 백업 (대시보드)

**위치**: 관리자 대시보드 → "데이터 백업 및 삭제" 섹션

**실행 방법**:
1. 관리자 대시보드 PIN 입력
2. 아래로 스크롤하여 "지금 백업 및 삭제 실행" 버튼 클릭 (빨간색)
3. ⚠️ 확인 모달에서 "예, 실행하겠습니다" 선택

**작동 원리**:
- React에서 GET 요청을 Google Apps Script로 전송
- Apps Script가 `backupAndDelete()` 함수 실행
- Firestore 모든 방문객 데이터를 Google Sheets로 백업
- Firestore에서 데이터 삭제 (취소 불가능)
- 1-3분 내 완료

**자동 재시도 메커니즘**:
- 네트워크 오류 발생 시: 자동으로 3초 대기 후 재시도
- API 오류 발생 시: 자동으로 2초 대기 후 재시도
- 최대 2회까지 자동 재시도 (총 3번 시도)
- 3번 모두 실패 시 오류 메시지 표시 및 중단

**중복 실행 방지**:
- 백업 진행 중에는 버튼이 비활성화 (클릭 불가)
- "진행 중..." 상태 표시로 사용자 피드백 제공
- 버튼을 빠르게 여러 번 클릭해도 중복 실행되지 않음

**성공 상태 표시**:
```
✓ 백업 및 삭제가 성공적으로 완료되었습니다.

Firebase 데이터가 엑셀로 백업되고, Firestore에서 삭제되었습니다.
```

### 자동 백업 (스케줄)

**실행 시간**: 매일 0시, 6시, 12시, 18시경 (6시간 간격)

**확인 방법**:
1. Apps Script 편집기 열기
2. "실행 로그" 또는 "모니터링" 탭에서 실행 기록 확인
3. 실패 시 등록된 메일로 오류 알림 수신

---

## 트러블슈팅

### 백업 관련 오류

#### 문제: "⏳ 백업이 이미 진행 중입니다"

**원인**: 이전 백업이 아직 진행 중이거나 앱 상태 오류

**해결**:
1. 30초 대기
2. 페이지 새로고침 (F5 또는 Ctrl+R)
3. 다시 시도

#### 문제: "⚠️ 작업 실패 (1/2 재시도 중)" 또는 "(2/2 재시도 중)"

**원인**: 일시적 네트워크 오류 또는 API 오류

**해결**:
1. 자동 재시도 완료 대기 (각 재시도 사이 2-3초)
2. 모두 실패하면 30초 후 다시 시도
3. 반복 실패 시 "헬스 체크" 필요

#### 문제: "✗ 요청 실패 (최대 재시도 초과)"

**원인**: 
- 인터넷 연결 끊김
- Apps Script 배포 URL 변경/삭제
- 방화벽이 요청 차단

**해결**:
1. 인터넷 연결 확인
2. `.env` 파일에서 `VITE_GOOGLE_APPS_SCRIPT_URL` 값 확인
3. [Apps Script 배포 관리](https://script.google.com) → "배포" 탭에서 현재 배포 확인
4. 방화벽/VPN 설정 확인

#### 문제: "✗ 최대 재시도 횟수 초과 - 오류: [오류 메시지]"

**원인**: Apps Script 내부 오류

**해결**:
1. [Apps Script 편집기](https://script.google.com) 열기
2. "실행 로그" 탭에서 최근 오류 메시지 확인
3. 일반적인 오류:
   - **"Missing service account credentials"**: Firebase 설정 누락 → `Configuration` 섹션 확인
   - **"No sheet named"**: Google Sheets 이름 변경됨 → `SHEET_NAME` 값 확인
   - **"Firebase quota exceeded"**: API 호출 초과 → 24시간 대기 후 재시도

#### 문제: Apps Script 배포 URL 변경된 경우

**해결 방법**:
1. Apps Script 편집기 열기
2. "배포" → "새로운 배포" 클릭
3. 실행 타입: "웹 앱"
4. 실행 계정: 자신의 Google 계정 선택
5. 다음 사용자가 액세스: "모든 사용자"
6. "배포" 클릭
7. 새 배포 ID 복사
8. `.env` 파일의 `VITE_GOOGLE_APPS_SCRIPT_URL` 값을 새 배포 URL로 업데이트
9. 앱 재구성 및 재배포

---

## 오류 발생 시

1. Gmail에서 오류 알림 확인
2. Apps Script 로그 검토
3. Firebase 콘솔에서 상태 확인
4. 이 문서의 **트러블슈팅** 섹션 참고
5. 해결 안 되면 각 서비스 공식 문서 확인 or [panciathe@naver.com](mailto:panciathe@naver.com) 연락주세요

**유용한 링크:**

- Firebase: [https://console.firebase.google.com](https://console.firebase.google.com/)
- Google Sheets: [https://sheets.google.com](https://sheets.google.com/)
- Apps Script: [https://script.google.com](https://script.google.com/)
- Vercel: [https://vercel.com](https://vercel.com/)

---