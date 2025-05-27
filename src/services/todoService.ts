import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { Todo, TodoFormData, TodoStatus } from "../types/todo";

const COLLECTION_NAME = "todos";

// Firestore 데이터를 Todo 타입으로 변환
const convertFirestoreToTodo = (doc: any): Todo => {
  const data = doc.data();
  
  // 기존 데이터 마이그레이션 로직
  let status: TodoStatus;
  if (data.status) {
    status = data.status;
  } else {
    // status 필드가 없는 기존 데이터의 경우 completed 값을 기반으로 설정
    status = data.completed ? "completed" : "todo";
  }
  
  return {
    id: doc.id,
    title: data.title || "",
    description: data.description || "",
    completed: data.completed || false,
    status: status,
    priority: data.priority || "medium",
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    dueDate: data.dueDate?.toDate() || null,
  };
};

// 할 일 추가
export const addTodo = async (todoData: TodoFormData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...todoData,
      completed: false,
      status: "todo" as TodoStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      dueDate: todoData.dueDate ? Timestamp.fromDate(todoData.dueDate) : null,
    });
    return docRef.id;
  } catch (error) {
    console.error("할 일 추가 실패:", error);
    throw error;
  }
};

// 할 일 수정
export const updateTodo = async (
  todoId: string,
  updates: Partial<Todo>
): Promise<void> => {
  try {
    const todoRef = doc(db, COLLECTION_NAME, todoId);
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    // Date 객체를 Timestamp로 변환
    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(updates.dueDate);
    }

    await updateDoc(todoRef, updateData);
  } catch (error) {
    console.error("할 일 수정 실패:", error);
    throw error;
  }
};

// 할 일 삭제
export const deleteTodo = async (todoId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, todoId));
  } catch (error) {
    console.error("할 일 삭제 실패:", error);
    throw error;
  }
};

// 할 일 목록 실시간 구독
export const subscribeTodos = (callback: (todos: Todo[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (querySnapshot) => {
      const todos: Todo[] = [];
      querySnapshot.forEach((doc) => {
        todos.push(convertFirestoreToTodo(doc));
      });
      callback(todos);
    },
    (error) => {
      console.error("실시간 구독 오류:", error);
    }
  );
};

// 할 일 완료 상태 토글
export const toggleTodoComplete = async (
  todoId: string,
  completed: boolean
): Promise<void> => {
  try {
    await updateTodo(todoId, { completed });
  } catch (error) {
    console.error("완료 상태 변경 실패:", error);
    throw error;
  }
};

// 할 일 상태 변경 (드래그 앤 드롭용)
export const updateTodoStatus = async (
  todoId: string,
  status: TodoStatus
): Promise<void> => {
  try {
    const completed = status === "completed";
    await updateTodo(todoId, { status, completed });
  } catch (error) {
    console.error("상태 변경 실패:", error);
    throw error;
  }
};

// 초기 샘플 데이터 생성 함수
export const createSampleData = async (): Promise<void> => {
  try {
    const sampleTodos = [
      {
        title: "프로젝트 기획서 작성",
        description: "새로운 웹 애플리케이션 프로젝트의 기획서를 작성합니다.",
        priority: "high" as const,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
      },
      {
        title: "UI/UX 디자인 검토",
        description: "사용자 인터페이스 디자인을 검토하고 피드백을 정리합니다.",
        priority: "medium" as const,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5일 후
      },
      {
        title: "코드 리뷰",
        description: "팀원들의 코드를 리뷰하고 개선사항을 제안합니다.",
        priority: "medium" as const,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2일 후
      },
      {
        title: "문서 업데이트",
        description: "API 문서와 사용자 가이드를 최신 버전으로 업데이트합니다.",
        priority: "low" as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      },
      {
        title: "테스트 케이스 작성",
        description: "새로운 기능에 대한 테스트 케이스를 작성합니다.",
        priority: "high" as const,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1일 후
      }
    ];

    console.log('📝 샘플 데이터 생성 중...');
    
    for (const todoData of sampleTodos) {
      await addTodo(todoData);
    }
    
    console.log('✅ 샘플 데이터 생성 완료!');
  } catch (error) {
    console.error('❌ 샘플 데이터 생성 실패:', error);
    throw error;
  }
};

// 모든 할 일 삭제 함수 (개발용)
export const clearAllTodos = async (): Promise<void> => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    
    console.log('🗑️ 모든 할 일 삭제 중...');
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('✅ 모든 할 일 삭제 완료!');
  } catch (error) {
    console.error('❌ 할 일 삭제 실패:', error);
    throw error;
  }
}; 