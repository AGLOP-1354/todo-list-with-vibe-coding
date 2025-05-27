// Firebase 설정 관리 파일
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 환경 변수 검증 및 로딩
const loadFirebaseConfig = (): FirebaseConfig => {
  console.log('🔍 Firebase 환경 변수 로딩 시작...');
  
  // 모든 환경 변수 출력 (디버깅용)
  console.log('📋 현재 환경 변수 상태:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  const envVars = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  // 각 환경 변수 상태 확인
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      const maskedValue = value.length > 10 ? 
        value.substring(0, 6) + '...' + value.substring(value.length - 4) : 
        value;
      console.log(`✅ ${key}: ${maskedValue}`);
    } else {
      console.error(`❌ ${key}: 누락됨`);
    }
  });

  // 누락된 환경 변수 확인
  const missingVars = Object.entries(envVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => `REACT_APP_FIREBASE_${key.toUpperCase()}`);

  if (missingVars.length > 0) {
    console.error('❌ 다음 환경 변수가 누락되었습니다:', missingVars);
    console.error('💡 해결 방법:');
    console.error('1. .env.local 파일이 프로젝트 루트에 있는지 확인');
    console.error('2. 환경 변수 이름이 REACT_APP_로 시작하는지 확인');
    console.error('3. 애플리케이션을 재시작 (npm start)');
    
    throw new Error(`Firebase 환경 변수가 누락되었습니다: ${missingVars.join(', ')}`);
  }

  // 타입 안전성을 위한 검증
  const config: FirebaseConfig = {
    apiKey: envVars.apiKey!,
    authDomain: envVars.authDomain!,
    projectId: envVars.projectId!,
    storageBucket: envVars.storageBucket!,
    messagingSenderId: envVars.messagingSenderId!,
    appId: envVars.appId!
  };

  // 프로젝트 ID 특별 검증
  if (config.projectId === 'demo-project' || config.projectId.includes('demo')) {
    console.error('❌ 데모 프로젝트 ID가 감지되었습니다:', config.projectId);
    console.error('💡 실제 Firebase 프로젝트 ID로 변경해주세요.');
    throw new Error('데모 프로젝트 ID를 실제 프로젝트 ID로 변경해주세요.');
  }

  console.log('✅ Firebase 설정 로딩 완료');
  console.log('📊 프로젝트 ID:', config.projectId);
  
  return config;
};

// Firebase 설정 내보내기
export const firebaseConfig = loadFirebaseConfig();

// 설정 검증 함수
export const validateFirebaseConfig = (): boolean => {
  try {
    const config = firebaseConfig;
    
    // 필수 필드 검증
    const requiredFields: (keyof FirebaseConfig)[] = [
      'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
    ];
    
    for (const field of requiredFields) {
      if (!config[field] || config[field].trim() === '') {
        console.error(`❌ Firebase 설정 오류: ${field}가 비어있습니다.`);
        return false;
      }
    }
    
    // 프로젝트 ID 형식 검증
    if (!/^[a-z0-9-]+$/.test(config.projectId)) {
      console.error('❌ Firebase 프로젝트 ID 형식이 올바르지 않습니다:', config.projectId);
      return false;
    }
    
    console.log('✅ Firebase 설정 검증 완료');
    return true;
  } catch (error) {
    console.error('❌ Firebase 설정 검증 실패:', error);
    return false;
  }
};

export default firebaseConfig; 