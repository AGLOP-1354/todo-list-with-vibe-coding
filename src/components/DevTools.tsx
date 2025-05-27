import React, { useState } from 'react';
import { createSampleData, clearAllTodos } from '../services/todoService';
import { checkFirebaseConnection, checkEnvironmentVariables } from '../services/firebase';
import { runFullEnvironmentDebug } from '../utils/env-debug';

interface DevToolsProps {
  isVisible: boolean;
  onToggle: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ isVisible, onToggle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateSampleData = async () => {
    setIsLoading(true);
    try {
      await createSampleData();
      showMessage('✅ 샘플 데이터가 생성되었습니다!');
    } catch (error) {
      showMessage('❌ 샘플 데이터 생성에 실패했습니다.', true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (!window.confirm('정말로 모든 할 일을 삭제하시겠습니까?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await clearAllTodos();
      showMessage('✅ 모든 데이터가 삭제되었습니다!');
    } catch (error) {
      showMessage('❌ 데이터 삭제에 실패했습니다.', true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckConnection = async () => {
    setIsLoading(true);
    try {
      console.log('🔧 개발자 도구: Firebase 연결 테스트 시작');
      
      // 환경 변수 먼저 확인
      checkEnvironmentVariables();
      
      // Firebase 연결 테스트
      const isConnected = await checkFirebaseConnection();
      if (isConnected) {
        showMessage('✅ Firebase 연결이 정상입니다!');
      } else {
        showMessage('❌ Firebase 연결에 문제가 있습니다. 콘솔을 확인해주세요.', true);
      }
    } catch (error) {
      showMessage('❌ 연결 확인 중 오류가 발생했습니다.', true);
      console.error('🔧 개발자 도구 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckEnvironment = () => {
    setIsLoading(true);
    try {
      console.log('🔧 개발자 도구: 환경 변수 확인');
      checkEnvironmentVariables();
      showMessage('✅ 환경 변수 확인 완료! 콘솔을 확인해주세요.');
    } catch (error) {
      showMessage('❌ 환경 변수 확인 중 오류가 발생했습니다.', true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullDebug = () => {
    setIsLoading(true);
    try {
      console.log('🔧 개발자 도구: 전체 환경 변수 디버깅');
      runFullEnvironmentDebug();
      showMessage('✅ 전체 디버깅 완료! 콘솔을 확인해주세요.');
    } catch (error) {
      showMessage('❌ 디버깅 중 오류가 발생했습니다.', true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
        title="개발자 도구 열기"
      >
        🛠️
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border p-4 w-80 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          🛠️ 개발자 도구
        </h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 text-xl"
          title="닫기"
        >
          ❌
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('❌') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Firebase 진단</h4>
          <div className="space-y-2">
            <button
              onClick={handleFullDebug}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              {isLoading ? '진단 중...' : '🔍 전체 환경 진단'}
            </button>
            <button
              onClick={handleCheckEnvironment}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              {isLoading ? '확인 중...' : '환경 변수 확인'}
            </button>
            <button
              onClick={handleCheckConnection}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              {isLoading ? '확인 중...' : 'Firebase 연결 테스트'}
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">데이터 관리</h4>
          <div className="space-y-2">
            <button
              onClick={handleCreateSampleData}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              {isLoading ? '생성 중...' : '샘플 데이터 생성'}
            </button>
            <button
              onClick={handleClearAllData}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              {isLoading ? '삭제 중...' : '모든 데이터 삭제'}
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 개발 모드에서만 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevTools; 