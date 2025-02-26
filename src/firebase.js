import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUn0QjsY8GYRuuFGzOMmloeJegtxxMZCc",
  authDomain: "reaversocial.firebaseapp.com",
  projectId: "reaversocial",
  storageBucket: "reaversocial.firebasestorage.app",
  messagingSenderId: "461982892032",
  appId: "1:461982892032:web:5327c7e66a4ddddff1d8e5",
  measurementId: "G-CD344TGD2D"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Функция регистрации
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✅ Регистрация успешна:", userCredential.user);
  } catch (error) {
    console.error("❌ Ошибка регистрации:", error.message);
    throw new Error(error.message);
  }
};

// Функция входа
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Вход успешен:", userCredential.user);
  } catch (error) {
    console.error("❌ Ошибка входа:", error.message);
    throw new Error(error.message);
  }
};

// Экспортируем всё нужное для работы с Firestore
export { auth, db, collection, addDoc, serverTimestamp };
