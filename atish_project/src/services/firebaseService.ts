import { firebaseEnabled, fetchCollection } from "../lib/firebase";
import { streams as localStreams } from "../data/streams";
import { departments as localDepartments } from "../data/departments";
import { jobs as localJobs } from "../data/jobs";
import { quizQuestions as localQuiz } from "../data/quizQuestions";
import type { QuizQuestion } from "../types/quiz";
import { collection, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { initFirebase } from "../lib/firebase";

export const getStreams = async () => {
  if (!firebaseEnabled) return localStreams;
  try {
    return await fetchCollection("streams");
  } catch {
    return localStreams;
  }
};

export const getDepartments = async () => {
  if (!firebaseEnabled) return localDepartments;
  try {
    return await fetchCollection("departments");
  } catch {
    return localDepartments;
  }
};

export const getJobs = async () => {
  if (!firebaseEnabled) return localJobs;
  try {
    return await fetchCollection("jobs");
  } catch {
    return localJobs;
  }
};

export const getQuizQuestions = async (): Promise<QuizQuestion[]> => {
  if (!firebaseEnabled) return localQuiz;
  try {
    const data = await fetchCollection("quizQuestions");
    return (data as QuizQuestion[]).filter((q) => q && q.id && q.options);
  } catch {
    return localQuiz;
  }
};

// Generic CRUD helpers with graceful fallback
const withDb = () => {
  if (!firebaseEnabled) throw new Error("Firebase not configured");
  const { db } = initFirebase();
  if (!db) throw new Error("Firebase not configured");
  return db;
};

export const saveStream = async (data: any, id?: string) => {
  if (!firebaseEnabled) return Promise.resolve({ id: id ?? "local-stream" });
  const db = withDb();
  if (id) {
    await setDoc(doc(db, "streams", id), data, { merge: true });
    return { id };
  }
  const ref = await addDoc(collection(db, "streams"), data);
  return { id: ref.id };
};

export const saveDepartment = async (data: any, id?: string) => {
  if (!firebaseEnabled) return Promise.resolve({ id: id ?? "local-dept" });
  const db = withDb();
  if (id) {
    await setDoc(doc(db, "departments", id), data, { merge: true });
    return { id };
  }
  const ref = await addDoc(collection(db, "departments"), data);
  return { id: ref.id };
};

export const saveJob = async (data: any, id?: string) => {
  if (!firebaseEnabled) return Promise.resolve({ id: id ?? "local-job" });
  const db = withDb();
  if (id) {
    await setDoc(doc(db, "jobs", id), data, { merge: true });
    return { id };
  }
  const ref = await addDoc(collection(db, "jobs"), data);
  return { id: ref.id };
};

export const saveQuizQuestion = async (data: any, id?: string) => {
  if (!firebaseEnabled) return Promise.resolve({ id: id ?? "local-quiz" });
  const db = withDb();
  if (id) {
    await setDoc(doc(db, "quizQuestions", id), data, { merge: true });
    return { id };
  }
  const ref = await addDoc(collection(db, "quizQuestions"), data);
  return { id: ref.id };
};

export const saveQuizResult = async (data: any) => {
  if (!firebaseEnabled) return Promise.resolve({ id: "local-result" });
  const db = withDb();
  const ref = await addDoc(collection(db, "quizResults"), { ...data, createdAt: Date.now() });
  return { id: ref.id };
};

export const deleteEntity = async (col: string, id: string) => {
  if (!firebaseEnabled) return Promise.resolve();
  const db = withDb();
  await deleteDoc(doc(db, col, id));
};
