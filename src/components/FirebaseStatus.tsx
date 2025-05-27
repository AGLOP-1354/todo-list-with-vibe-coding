import React, { useState, useEffect } from 'react';
import { checkFirebaseConnection } from '../services/firebase';

interface FirebaseStatusProps {
  onConnectionChange?: (isConnected: boolean) => void;
}

const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      setError('');
      
      try {
        console.log('🔍 Firebase 연결 상태 확인 중...');
        const connected = await checkFirebaseConnection();
        setIsConnected(connected);
        onConnectionChange?.(connected);
        
        if (!connected) {
          setError('Firebase 연결에 실패했습니다. 콘솔을 확인해주세요.');
        }
      } catch (err: any) {
        console.error('Firebase 연결 확인 중 오류:', err);
        setIsConnected(false);
        setError(err.message || 'Firebase 연결 확인 중 오류가 발생했습니다.');
        onConnectionChange?.(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
  }, [onConnectionChange]);

  if (isChecking) {
    return (
      <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        <span className="text-sm font-medium">Firebase 연결 확인 중...</span>
      </div>
    );
  }

  if (isConnected === null) {
    return null;
  }

  if (isConnected) {
    return (
      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fadeIn">
        <span className="text-green-600">✅</span>
        <span className="text-sm font-medium">Firebase 연결 성공</span>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-600">❌</span>
        <span className="text-sm font-medium">Firebase 연결 실패</span>
      </div>
      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}
      <div className="text-xs text-red-600">
        <p>• 브라우저 콘솔(F12)에서 자세한 오류 확인</p>
        <p>• 개발자 도구(🛠️)에서 연결 테스트 실행</p>
      </div>
    </div>
  );
};

export default FirebaseStatus; 