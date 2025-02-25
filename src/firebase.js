// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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

// Получение и использование аутентификации
const auth = getAuth(app);

// Пример функции для регистрации
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Регистрация успешна:', user);
  } catch (error) {
    console.error('Ошибка регистрации:', error.message);
  }
};

// Пример функции для входа
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Вход успешен:', user);
  } catch (error) {
    console.error('Ошибка входа:', error.message);
  }
};

export default app;
