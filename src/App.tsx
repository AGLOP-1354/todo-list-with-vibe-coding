import React, { useState, useCallback } from 'react';
import KanbanBoard from './components/KanbanBoard';
import { TodoForm } from './components/todo/TodoForm';
import { TodoFilterComponent } from './components/todo/TodoFilter';
import { useTodos } from './hooks/useTodos';
import { Todo } from './types/todo';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import DevTools from './components/DevTools';
import FirebaseStatus from './components/FirebaseStatus';
import './App.css';

function App() {
  const {
    todos,
    filteredTodos,
    loading,
    error,
    filter,
    addNewTodo,
    updateExistingTodo,
    removeExistingTodo,
    setFilter,
    clearError,
  } = useTodos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDevToolsVisible, setIsDevToolsVisible] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean | null>(null);

  const handleAddTodo = useCallback(async (todoData: any) => {
    try {
      await addNewTodo(todoData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('할 일 추가 실패:', error);
    }
  }, [addNewTodo]);

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  }, []);

  const handleUpdateTodo = useCallback(async (todoData: any) => {
    if (!editingTodo) return;
    
    try {
      await updateExistingTodo(editingTodo.id, todoData);
      setEditingTodo(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('할 일 수정 실패:', error);
    }
  }, [editingTodo, updateExistingTodo]);

  const handleDeleteTodo = useCallback(async (todoId: string) => {
    if (window.confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      try {
        await removeExistingTodo(todoId);
      } catch (error) {
        console.error('할 일 삭제 실패:', error);
      }
    }
  }, [removeExistingTodo]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTodo(null);
  }, []);

  const handleOpenForm = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const toggleDevTools = useCallback(() => {
    setIsDevToolsVisible(prev => !prev);
  }, []);

  const handleFirebaseConnectionChange = useCallback((isConnected: boolean) => {
    setFirebaseConnected(isConnected);
  }, []);

  // 통계 계산
  const stats = {
    total: todos.length,
    todo: todos.filter(t => t.status === 'todo').length,
    inProgress: todos.filter(t => t.status === 'in-progress').length,
    completed: todos.filter(t => t.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-4xl">📋</span>
                  <span className="typing-effect">할 일 칸반보드</span>
                </h1>
                <p className="text-gray-600 mt-1">드래그 앤 드롭으로 할 일을 관리하세요</p>
              </div>
              
              {/* 통계 */}
              <div className="flex gap-4">
                <div className="text-center stat-counter">
                  <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
                  <div className="text-sm text-gray-500">할 일</div>
                </div>
                <div className="text-center stat-counter">
                  <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                  <div className="text-sm text-gray-500">진행 중</div>
                </div>
                <div className="text-center stat-counter">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-gray-500">완료</div>
                </div>
              </div>

              <button
                onClick={handleOpenForm}
                className="interactive-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span className="text-xl">➕</span>
                새 할 일
              </button>
            </div>
          </div>
        </header>

        {/* 필터 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <TodoFilterComponent
            filter={filter}
            onFilterChange={setFilter}
            totalCount={todos.length}
            completedCount={stats.completed}
            todoCount={stats.todo}
            inProgressCount={stats.inProgress}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          </div>
        )}

        {/* 칸반보드 */}
        <div className="max-w-7xl mx-auto">
          <KanbanBoard
            todos={filteredTodos}
            onEditTodo={handleEditTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        </div>

        {/* 할 일 폼 모달 */}
        {isFormOpen && (
          <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="modal-content bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingTodo ? '할 일 수정' : '새 할 일 추가'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ❌
                  </button>
                </div>
                
                <TodoForm
                  initialData={editingTodo || undefined}
                  onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
                  onCancel={handleCloseForm}
                />
              </div>
            </div>
          </div>
        )}

        {/* Firebase 연결 상태 표시 */}
        <FirebaseStatus onConnectionChange={handleFirebaseConnectionChange} />

        {/* 개발자 도구 (개발 모드에서만 표시) */}
        {process.env.NODE_ENV === 'development' && (
          <DevTools 
            isVisible={isDevToolsVisible} 
            onToggle={toggleDevTools} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
