import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { firebaseConfig, validateFirebaseConfig } from "../config/firebase-config";

// Firebase 설정 검증
if (!validateFirebaseConfig()) {
  throw new Error('Firebase 설정이 올바르지 않습니다.');
}

// Firebase 앱 초기화
console.log('🚀 Firebase 앱 초기화 중...');
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase 앱 초기화 완료');

// Firestore 데이터베이스 인스턴스
console.log('🗄️ Firestore 데이터베이스 연결 중...');
export const db = getFirestore(app);
console.log('✅ Firestore 데이터베이스 인스턴스 생성 완료');

// 개발 환경에서 에뮬레이터 사용 (선택사항)
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Firebase 에뮬레이터에 연결되었습니다.');
  } catch (error) {
    console.log('Firebase 에뮬레이터 연결 실패 (이미 연결되었을 수 있습니다):', error);
  }
}

// Firebase 연결 상태 확인 함수
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Firestore 연결 테스트를 위한 간단한 쿼리 실행
    const { collection, getDocs, limit, query, addDoc, deleteDoc, doc } = await import('firebase/firestore');
    
    console.log('🔍 Firebase 연결 테스트 시작...');
    console.log('📊 프로젝트 ID:', firebaseConfig.projectId);
    console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
    
    // 1단계: 읽기 테스트
    console.log('📖 1단계: Firestore 읽기 테스트...');
    const testQuery = query(collection(db, 'todos'), limit(1));
    await getDocs(testQuery);
    console.log('✅ 읽기 테스트 성공');
    
    // 2단계: 쓰기 테스트
    console.log('✏️ 2단계: Firestore 쓰기 테스트...');
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase 연결 테스트',
      timestamp: new Date(),
      testId: Math.random().toString(36).substr(2, 9)
    });
    console.log('✅ 쓰기 테스트 성공');
    
    // 3단계: 삭제 테스트 (테스트 데이터 정리)
    console.log('🗑️ 3단계: 테스트 데이터 정리...');
    await deleteDoc(testDoc);
    console.log('✅ 삭제 테스트 성공');
    
    console.log('🎉 Firebase 연결 테스트 완료 - 모든 기능이 정상 작동합니다!');
    return true;
  } catch (error: any) {
    console.error('❌ Firebase 연결 실패:', error);
    console.error('🔍 에러 코드:', error.code);
    console.error('🔍 에러 메시지:', error.message);
    
    // 일반적인 Firebase 에러 해결 방법 제시
    if (error.code === 'permission-denied') {
      console.error('🚫 권한 오류: Firestore 보안 규칙을 확인해주세요.');
      console.error('💡 해결 방법: Firebase Console > Firestore Database > 규칙에서 테스트 모드로 변경');
    } else if (error.code === 'unavailable') {
      console.error('🌐 네트워크 오류: 인터넷 연결을 확인해주세요.');
    } else if (error.code === 'not-found') {
      console.error('🔍 프로젝트 오류: Firebase 프로젝트 ID를 확인해주세요.');
      console.error('💡 해결 방법: .env 파일의 REACT_APP_FIREBASE_PROJECT_ID 확인');
    } else if (error.code === 'failed-precondition') {
      console.error('🏗️ Firestore 데이터베이스가 생성되지 않았습니다.');
      console.error('💡 해결 방법: Firebase Console에서 Firestore Database를 먼저 생성해주세요.');
    }
    
    return false;
  }
};

// 환경 변수 확인 함수
export const checkEnvironmentVariables = (): void => {
  console.log('🔍 환경 변수 확인 중...');
  
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];
  
  const presentVars = requiredEnvVars.filter(varName => process.env[varName]);
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  // 설정된 환경 변수 표시 (값은 보안상 일부만 표시)
  presentVars.forEach(varName => {
    const value = process.env[varName] || '';
    const maskedValue = value.length > 10 ? 
      value.substring(0, 6) + '...' + value.substring(value.length - 4) : 
      value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  });
  
  if (missingVars.length > 0) {
    console.warn('⚠️  다음 환경 변수가 설정되지 않았습니다:', missingVars);
    console.warn('📝 .env 파일을 확인하고 Firebase 설정을 추가해주세요.');
    console.warn('💡 파일 위치: 프로젝트 루트/.env');
  } else {
    console.log('✅ 모든 Firebase 환경 변수가 설정되었습니다.');
  }
  
  // 현재 사용 중인 설정 요약
  console.log('📋 현재 Firebase 설정:');
  console.log(`   프로젝트 ID: ${firebaseConfig.projectId}`);
  console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
};

// 초기화 시 연결 상태 확인
if (process.env.NODE_ENV === 'development') {
  checkEnvironmentVariables();
  checkFirebaseConnection();
}

export default app; 