import { auth, db } from './src/firebase.js'; 

// Функция загрузки профиля пользователя
async function loadUserProfile() {
    const user = auth.currentUser;
    if (user) {
        // Проверяем, есть ли данные о пользователе в глобальной переменной
        if (window.currentUser) {
            const profile = window.currentUser;
            document.getElementById("username").textContent = profile.username;
            document.getElementById("bio").textContent = profile.bio || "Нет биографии";
            document.getElementById("avatar").src = profile.avatar || "default-avatar.jpg";
        } else {
            const userRef = db.collection("users").doc(user.uid);
            try {
                const doc = await userRef.get();
                if (doc.exists) {
                    const profile = doc.data();
                    // Сохраняем информацию о пользователе в глобальную переменную
                    window.currentUser = profile;
                    document.getElementById("username").textContent = profile.username;
                    document.getElementById("bio").textContent = profile.bio || "Нет биографии";
                    document.getElementById("avatar").src = profile.avatar || "default-avatar.jpg";
                } else {
                    console.error("Профиль не найден!");
                    alert("Не удалось загрузить профиль.");
                }
            } catch (error) {
                console.error("Ошибка при загрузке профиля:", error);
                alert("Произошла ошибка при загрузке профиля.");
            }
        }
    } else {
        alert("Для просмотра профиля необходимо войти в аккаунт!");
        window.location.href = "login.html"; // Перенаправляем на страницу входа
    }
}

// Слушатель на кнопку редактирования профиля
document.getElementById("editProfileBtn").addEventListener("click", async function() {
    const user = auth.currentUser;
    if (user) {
        const bio = prompt("Введите новую биографию:");
        if (bio !== null && bio.trim() !== "") {
            try {
                const userRef = db.collection("users").doc(user.uid);
                await userRef.update({ bio: bio });
                alert("Биография обновлена!");
                loadUserProfile(); // Перезагружаем профиль
            } catch (error) {
                console.error("Ошибка обновления профиля:", error);
                alert("Произошла ошибка при обновлении профиля.");
            }
        } else {
            alert("Биография не может быть пустой!");
        }
    } else {
        alert("Для редактирования профиля необходимо войти в аккаунт!");
        window.location.href = "login.html";
    }
});

// Загружаем профиль при загрузке страницы
window.onload = loadUserProfile;
