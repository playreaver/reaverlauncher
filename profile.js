const firebaseConfig = {
    apiKey: "AIzaSyDUn0QjsY8GYRuuFGzOMmloeJegtxxMZCc",
    authDomain: "reaversocial.firebaseapp.com",
    projectId: "reaversocial",
    storageBucket: "reaversocial.firebasestorage.app",
    messagingSenderId: "461982892032",
    appId: "1:461982892032:web:5327c7e66a4ddddff1d8e5",
    measurementId: "G-CD344TGD2D"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function loadUserProfile() {
    const user = auth.currentUser;
    if (user) {
        const userRef = db.collection("users").doc(user.uid);
        userRef.get()
            .then(doc => {
                if (doc.exists) {
                    const profile = doc.data();
                    document.getElementById("username").textContent = profile.username;
                    document.getElementById("bio").textContent = profile.bio || "Нет биографии";
                    document.getElementById("avatar").src = profile.avatar || "default-avatar.jpg";
                }
            })
            .catch(error => {
                console.error("Ошибка при загрузке профиля: ", error);
            });
    } else {
        alert("Пожалуйста, войдите в систему");
        window.location = "login.html"; 
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        loadUserProfile();
    }
});

document.getElementById("editProfileBtn").addEventListener("click", () => {
    const bio = prompt("Введите вашу новую биографию:");
    if (bio !== null) {
        const user = auth.currentUser;
        if (user) {
            db.collection("users").doc(user.uid).update({
                bio: bio
            }).then(() => {
                alert("Биография обновлена!");
                loadUserProfile();
            }).catch(error => {
                console.error("Ошибка обновления профиля: ", error);
            });
        }
    }
});

window.onload = loadUserProfile;
