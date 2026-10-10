import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "あなたのAPIキー",
    authDomain: "あなたの認証ドメイン",
    projectId: "あなたのプロジェクトID",
    storageBucket: "あなたのストレージバケット",
    messagingSenderId: "あなたのメッセージング送信者ID",
    appId: "あなたのアプリID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };