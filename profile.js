import { auth, db } from './src/firebase.js'; 

async function loadUserProfile() {
    const user = auth.currentUser;
    if (user) {
        const userRef = db.collection("users").doc(user.uid);
        try {
            const doc = await userRef.get();
            if (doc.exists) {
                const profile = doc.data();
                document.getElementById("username").textContent = profile.username;
                document.getElementById("bio").textContent = profile.bio || "Нет биографии";
                document.getElementById("avatar").src = profile.avatar || "default-avatar.jpg";
            } else {
                console.error("Профиль не найден!");
            }
        } catch (error) {
            console.error("Ошибка при загрузке профиля:", error);
        }
    } else {
        alert("Для просмотра профиля необходимо войти в аккаунт!");
        window.location.href = "login.html"; 
    }
}

async function editUserProfile() {
    const user = auth.currentUser;
    if (user) {
        const bio = prompt("Введите новую биографию:");
        if (bio !== null) {
            try {
                const userRef = db.collection("users").doc(user.uid);
                await userRef.update({
                    bio: bio
                });
                alert("Биография обновлена!");
                loadUserProfile(); 
            } catch (error) {
                console.error("Ошибка обновления профиля:", error);
            }
        }
    }
}

document.getElementById("editProfileBtn").addEventListener("click", editUserProfile);
window.onload = loadUserProfile;
