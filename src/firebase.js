import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase конфигурация
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

// Функция регистрации
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Регистрация успешна:', user);
  } catch (error) {
    console.error('Ошибка регистрации:', error.message);
    throw new Error(error.message); // Выкидываем ошибку, чтобы её можно было поймать в .catch
  }
};

// Функция входа
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Вход успешен:', user);
  } catch (error) {
    console.error('Ошибка входа:', error.message);
    throw new Error(error.message);
  }
};

export { auth };
