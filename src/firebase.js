import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length) {
  const errorMsg = `
⚠️ Firebase 환경변수가 설정되지 않았습니다!

누락된 환경변수:
${missingKeys.map(key => `  - ${key}`).join('\n')}

해결 방법:
1. 프로젝트 루트에 .env 파일을 생성하세요
2. 다음 변수들을 설정하세요:
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
3. 개발 서버를 재시작하세요 (npm run dev)

자세한 내용은 README.md를 참고하세요.

⚠️ 경고: Firebase 연결 없이 실행 중입니다. 데이터는 localStorage에만 저장됩니다.
`;
  console.error(errorMsg);
  // 개발 중에는 경고만 표시하고 계속 실행 (프로덕션에서는 throw 권장)
  if (import.meta.env.PROD) {
    throw new Error(`Missing Firebase environment variables: ${missingKeys.join(", ")}`);
  }
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, serverTimestamp };


