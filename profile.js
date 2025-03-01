var firebaseConfig = {
    apiKey: "AIzaSyDUn0QjsY8GYRuuFGzOMmloeJegtxxMZCc",
    authDomain: "reaversocial.firebaseapp.com",
    projectId: "reaversocial",
    storageBucket: "reaversocial.firebasestorage.app",
    messagingSenderId: "461982892032",
    appId: "1:461982892032:web:5327c7e66a4ddddff1d8e5",
    measurementId: "G-CD344TGD2D"
};

firebase.initializeApp(firebaseConfig);

const avatarImg = document.getElementById('avatar');
const usernameSpan = document.getElementById('username');
const bioSpan = document.getElementById('bio');
const emailSpan = document.getElementById('email');

async function loadUserProfile() {
    const user = firebase.auth().currentUser;
    
    if (user) {
        const db = firebase.firestore();
        const userRef = db.collection("users").doc(user.uid);
        const doc = await userRef.get();

        if (doc.exists) {
            const userData = doc.data();
            usernameSpan.textContent = userData.username || 'Неизвестно';
            emailSpan.textContent = userData.email || 'Нет email';
            bioSpan.textContent = userData.bio || 'Нет информации';
            avatarImg.src = userData.avatar || 'default-avatar.png';
        } else {
            console.log('Данные пользователя не найдены');
        }
    } else {
        console.log('Пользователь не авторизован');
    }
}

loadUserProfile();
