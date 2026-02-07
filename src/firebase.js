import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  doc, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

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

let app = null;
let db = null;

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

⚠️ 경고: Firebase 연결 없이 실행 중입니다. 데이터 전송은 비활성화됩니다.
`;
  console.error(errorMsg);
  
  if (import.meta.env.PROD) {
    throw new Error(`Missing Firebase environment variables: ${missingKeys.join(", ")}`);
  }
} else {
  // 환경변수가 모두 있을 때만 초기화
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

// 관람실 목록 가져오기
export const getRoomLocations = async () => {
  if (!db) {
    console.warn('Firebase가 초기화되지 않았습니다.');
    return { success: false, data: [], error: 'Firebase가 초기화되지 않았습니다.' };
  }
  
  try {
    const roomsRef = collection(db, 'locations');
    const q = query(roomsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return { 
      success: true, 
      data: snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })) 
    };
  } catch (error) {
    console.error('관람실 목록 가져오기 실패:', error);
    return { success: false, data: [], error: error.message };
  }
};

// 관람실 추가
export const addRoomLocation = async (roomName) => {
  if (!db) {
    return { success: false, error: 'Firebase가 초기화되지 않았습니다.' };
  }
  
  try {
    const roomsRef = collection(db, 'locations');
    const docRef = await addDoc(roomsRef, {
      name: roomName,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('관람실 추가 실패:', error);
    return { success: false, error: error.message };
  }
};

// 관람실 삭제
export const deleteRoomLocation = async (roomId) => {
  if (!db) {
    return { success: false, error: 'Firebase가 초기화되지 않았습니다.' };
  }
  
  try {
    const roomRef = doc(db, 'locations', roomId);
    await deleteDoc(roomRef);
    return { success: true };
  } catch (error) {
    console.error('관람실 삭제 실패:', error);
    return { success: false, error: error.message };
  }
};

// Firestore 직접 필요시에만 사용
export { db };



