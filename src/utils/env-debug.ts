// 환경 변수 디버깅 유틸리티

export const debugEnvironmentVariables = (): void => {
  console.log('🔍 환경 변수 디버깅 시작...');
  console.log('='.repeat(50));
  
  // Node.js 환경 정보
  console.log('📋 환경 정보:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PUBLIC_URL:', process.env.PUBLIC_URL);
  
  // React 앱 관련 환경 변수
  console.log('\n🔧 React 앱 환경 변수:');
  const reactEnvVars = Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .sort();
  
  if (reactEnvVars.length === 0) {
    console.warn('⚠️ REACT_APP_ 접두사를 가진 환경 변수가 없습니다!');
    console.warn('💡 .env 또는 .env.local 파일을 확인해주세요.');
  } else {
    reactEnvVars.forEach(key => {
      const value = process.env[key];
      if (value) {
        // 민감한 정보는 마스킹
        const maskedValue = key.includes('API_KEY') || key.includes('SECRET') ? 
          value.substring(0, 6) + '...' + value.substring(value.length - 4) :
          value;
        console.log(`✅ ${key}: ${maskedValue}`);
      } else {
        console.log(`❌ ${key}: undefined`);
      }
    });
  }
  
  // Firebase 관련 환경 변수 특별 확인
  console.log('\n🔥 Firebase 환경 변수:');
  const firebaseVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];
  
  const missingFirebaseVars: string[] = [];
  
  firebaseVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const maskedValue = varName.includes('API_KEY') ? 
        value.substring(0, 6) + '...' + value.substring(value.length - 4) :
        value;
      console.log(`✅ ${varName}: ${maskedValue}`);
    } else {
      console.log(`❌ ${varName}: 누락됨`);
      missingFirebaseVars.push(varName);
    }
  });
  
  // 문제 진단 및 해결 방법 제시
  console.log('\n🔍 진단 결과:');
  if (missingFirebaseVars.length === 0) {
    console.log('✅ 모든 Firebase 환경 변수가 설정되었습니다!');
  } else {
    console.error(`❌ ${missingFirebaseVars.length}개의 Firebase 환경 변수가 누락되었습니다.`);
    console.error('누락된 변수:', missingFirebaseVars);
    
    console.log('\n💡 해결 방법:');
    console.log('1. 프로젝트 루트에 .env.local 파일이 있는지 확인');
    console.log('2. 파일 내용에 모든 REACT_APP_FIREBASE_ 변수가 있는지 확인');
    console.log('3. 변수 이름에 오타가 없는지 확인');
    console.log('4. 애플리케이션을 재시작 (npm start)');
  }
  
  console.log('='.repeat(50));
};

// 환경 변수 파일 존재 여부 확인 (브라우저에서는 불가능하지만 정보 제공)
export const checkEnvFileStatus = (): void => {
  console.log('📁 환경 변수 파일 상태:');
  console.log('💡 브라우저에서는 파일 시스템에 직접 접근할 수 없습니다.');
  console.log('💡 다음 명령어로 터미널에서 확인해주세요:');
  console.log('   ls -la .env*');
  console.log('   cat .env.local');
};

// 전체 환경 변수 디버깅 실행
export const runFullEnvironmentDebug = (): void => {
  debugEnvironmentVariables();
  checkEnvFileStatus();
}; 