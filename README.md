# RAIM 방문자 등록 키오스크 시스템

서울로봇인공지능과학관(RAIM)에서 사용하는 방문자 등록 키오스크 시스템입니다. AI 얼굴 인식 기술을 활용하여 방문자의 연령대와 성별을 자동으로 감지하고, 수동 입력 기능도 제공합니다.

## 주요 기능

### 🤖 AI 얼굴 인식 등록
- **자동 연령대 감지**: 얼굴 인식 AI를 통해 방문자의 연령대를 자동으로 분류
  - 영유아 (0~6세)
  - 어린이 (7~12세)
  - 청소년 (13~19세)
  - 청년 (20~39세)
  - 중년 (40~49세)
  - 장년 (50세~)
- **성별 자동 감지**: 남성/여성 자동 구분
- **다중 얼굴 인식**: 한 번에 여러 명의 방문자 등록 가능

### ✋ 수동 입력 등록
- AI 인식이 어려운 경우를 위한 수동 입력 기능
- 성별 및 연령대 직접 선택
- AI 등록과 수동 등록 구분 표시

### 📋 등록 관리
- 실시간 방문자 명단 확인
- 등록된 방문자 삭제 기능
- 등록 완료 전 수정 가능

### 🔒 관리자 기능
- PIN 기반 관리자 잠금 화면
- 시스템 보안 관리

### 📊 데이터 전송
- Google Apps Script를 통한 방문자 데이터 자동 전송
- 등록 완료 후 성공 모달 표시

## 기술 스택

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **AI 라이브러리**: face-api.js 0.22.2
  - SSD Mobilenet v1 (얼굴 감지)
  - Face Landmark 68 (얼굴 특징점)
  - Age & Gender Net (연령/성별 예측)
- **UI 아이콘**: Lucide React 0.562.0
- **스타일링**: 인라인 스타일 (반응형 디자인)

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── AdminLockScreen.jsx    # 관리자 잠금 화면
│   ├── CameraCard.jsx          # 카메라/스캔 카드
│   ├── ManualEntryCard.jsx    # 수동 입력 카드
│   ├── SuccessModal.jsx       # 성공 모달
│   └── VisitorList.jsx         # 방문자 목록
├── hooks/              # 커스텀 훅
│   └── useIsMobile.js          # 모바일 감지 훅
├── utils/              # 유틸리티 함수
│   └── ageConverter.js         # 연령대 변환 함수
├── constants.js        # 상수 및 설정
├── App.jsx             # 메인 앱 컴포넌트
└── main.jsx            # 앱 진입점
```

## 설치 및 실행

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_ADMIN_PIN=0000
```

- `VITE_GOOGLE_SCRIPT_URL`: Google Apps Script 웹 앱 URL
- `VITE_ADMIN_PIN`: 관리자 잠금 해제 PIN (기본값: 0000)

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

## AI 모델 파일

AI 얼굴 인식 기능을 사용하려면 `public/models/` 폴더에 다음 모델 파일들이 필요합니다:

- `ssd_mobilenetv1_model-weights_manifest.json`
- `ssd_mobilenetv1_model-shard1`
- `ssd_mobilenetv1_model-shard2`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `age_gender_model-weights_manifest.json`
- `age_gender_model-shard1`

모델 파일은 face-api.js 공식 저장소에서 다운로드할 수 있습니다.

## 주요 기능 설명

### AI 스캔 프로세스
1. 카메라 권한 요청
2. AI 모델 로딩 (최초 1회)
3. "AI 스캔" 버튼 클릭
4. 실시간 얼굴 감지 및 분석
5. 연령대/성별 자동 분류
6. 방문자 목록에 자동 추가

### 수동 입력 프로세스
1. 성별 선택 (남성/여성)
2. 연령대 선택 (6개 그룹 중 선택)
3. "추가하기" 버튼 클릭
4. 방문자 목록에 추가

### 데이터 전송
- 등록된 방문자 정보를 Google Apps Script로 전송
- 전송 형식: `{ visitors: [{ ageGroup, gender, source }] }`
- 전송 성공 시 성공 모달 표시

## 보안 및 개인정보

- **이미지 저장 없음**: 카메라로 촬영한 이미지는 저장되지 않으며, 실시간 처리만 수행됩니다.
- **로컬 처리**: AI 모델은 클라이언트 측에서 실행되며, 서버로 이미지가 전송되지 않습니다.
- **관리자 잠금**: PIN 기반 잠금 기능으로 무단 접근을 방지합니다.

## 반응형 디자인

- 데스크톱 및 태블릿 환경 최적화
- 모바일 환경 지원 (768px 이하 자동 감지)
- 터치 친화적 UI

## 라이선스

이 프로젝트는 서울로봇인공지능과학관(RAIM)의 내부 사용을 위한 프로젝트입니다.

