> 배포 후 운영을 위한 간단한 체크리스트
> 

## 권장 모니터링 사항

### 일일 (5분)

- 웹사이트 접속 확인
- Gmail 오류 알림 확인
- Google Sheets 데이터 추가 확인

### 주간 (20분)

- Firebase 콘솔 → 사용량 확인 (목표: 40% 미만)
- Apps Script → 실행 로그 확인
- Google Sheets 행 수 확인

### 월간 (1시간)

- 트리거 간격 최적화 (필요시)
- 데이터 백업 (Google Sheets → CSV 다운로드)
- 성능 리포트 정리

### 분기별 (2시간, 보안을 위한 선택 사항)

- 관리자 비밀번호 변경
- Firebase 서비스 계정 키 갱신
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

```

### 월간 체크리스트

```
[ ] 총 방문자 수 정리
[ ] 무료 한도 사용률 확인
    - Firestore: 40% 미만
    - Google Sheets: 36% 미만
    - Apps Script: 90분 미만/일
[ ] 배포 로그 확인 (실패 있으면 원인 파악)
[ ] 데이터 백업
    - Google Sheets → CSV 다운로드
    - 로컬 또는 Google Drive 저장

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
[ ] 의존성 업데이트
    - npm update
    - npm run build 테스트
    - Git push

```

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

- localStorage: 1일 (일일 통계)
- Firestore: 설정된 간격 (3-12시간)
- Google Sheets: 무제한 (영구 기록)

---

## 보안 관리

### 월간 확인사항

- 비밀번호 변경 여부 확인
- Firestore 규칙 검토
- ALERT_EMAIL 설정 정상 여부

### 분기별 갱신

- 관리자 비밀번호 변경
- Firebase 서비스 계정 키 갱신
- Vercel 환경 변수 검토

---

## ⚠️ 문제 해결

### 1. 자동 백업 안 됨

**원인**: Apps Script 오류

**확인**:

1. Apps Script → 실행 로그 확인
2. 오류 메시지 확인

**해결**:

```jsx
// Apps Script에서 backupAndDelete 수동 실행
// 오류가 표시되면 원인 파악
```

### 2. 방문자 증가로 인한 높은 API 사용량

**원인**: 트래픽 증가

**해결**:

1. 현재 일일 방문자 수 확인
2. Apps Script 대시보드 → 트리거 수정, 간격 단축

### 3. 웹 안열림

**원인**:  Vercel 배포 실패

**확인**:

1. Vercel 대시보드 → Deployments
2. 빌드 로그 확인

**해결**:

```bash
# 로컬에서 빌드 테스트
npm run build

# 오류 수정 후 배포
git push origin main
```

### 4. Firestore 쓰기 오류

**확인**: Firebase 콘솔 → Firestore → 규칙

**정상 규칙**:

```jsx
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

**수정 후**: "게시" 클릭

---

---

## 오류 발생 시

1. Gmail에서 오류 알림 확인
2. Apps Script 로그 검토
3. Firebase 콘솔에서 상태 확인
4. 이 문서의 **문제 해결** 목차 참고
5. 해결 안 되면 각 서비스 공식 문서 확인

**유용한 링크:**

- Firebase: [https://console.firebase.google.com](https://console.firebase.google.com/)
- Google Sheets: [https://sheets.google.com](https://sheets.google.com/)
- Apps Script: [https://script.google.com](https://script.google.com/)
- Vercel: [https://vercel.com](https://vercel.com/)

---