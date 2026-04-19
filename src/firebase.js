    import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ВСТАВЬТЕ СЮДА ВАШИ КЛЮЧИ ИЗ FIREBASE:
const firebaseConfig = {
    apiKey: "AIzaSyA7btoEPE4DB0jCpWPpfTBSWXnme2bPVN8",
    authDomain: "sova-sarov.firebaseapp.com",
    projectId: "sova-sarov",
    storageBucket: "sova-sarov.firebasestorage.app",
    messagingSenderId: "1031055051662",
    appId: "1:1031055051662:web:a588708b3961b2ba4cb2df"
  };

// Инициализируем приложение и базу данных
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);   