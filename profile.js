import { auth, db } from './src/firebase.js'; 

// Функция загрузки профиля пользователя
async function loadUserProfile() {
    const user = auth.currentUser; // Получаем текущего пользователя
    if (user) {
        const userRef = db.collection("users").doc(user.uid); // Ссылка на документ пользователя
        try {
            const doc = await userRef.get(); // Получаем данные пользователя
            if (doc.exists) {
                const profile = doc.data(); // Извлекаем данные профиля
                document.getElementById("username").textContent = profile.username; // Имя пользователя
                document.getElementById("bio").textContent = profile.bio || "Нет биографии"; // Биография (если нет — по умолчанию)
                document.getElementById("avatar").src = profile.avatar || "default-avatar.jpg"; // Аватарка (если нет — дефолтная)
            } else {
                console.error("Профиль не найден!");
                alert("Не удалось загрузить профиль.");
            }
        } catch (error) {
            console.error("Ошибка при загрузке профиля:", error);
            alert("Произошла ошибка при загрузке профиля.");
        }
    } else {
        alert("Для просмотра профиля необходимо войти в аккаунт!");
        window.location.href = "login.html"; // Перенаправляем на страницу входа
    }
}

// Функция редактирования профиля пользователя
async function editUserProfile() {
    const user = auth.currentUser; // Получаем текущего пользователя
    if (user) {
        const bio = prompt("Введите новую биографию:"); // Запрашиваем новую биографию
        if (bio !== null && bio.trim() !== "") {
            try {
                const userRef = db.collection("users").doc(user.uid); // Ссылка на документ пользователя
                await userRef.update({
                    bio: bio // Обновляем биографию в базе данных
                });
                alert("Биография обновлена!");
                loadUserProfile(); // Перезагружаем профиль после обновления
            } catch (error) {
                console.error("Ошибка обновления профиля:", error);
                alert("Произошла ошибка при обновлении профиля.");
            }
        } else {
            alert("Биография не может быть пустой!"); // Если пользователь ввел пустое значение
        }
    } else {
        alert("Для редактирования профиля необходимо войти в аккаунт!");
        window.location.href = "login.html"; // Перенаправляем на страницу входа
    }
}

// Слушатель на кнопку редактирования профиля
document.getElementById("editProfileBtn").addEventListener("click", editUserProfile);

// Загружаем профиль при загрузке страницы
window.onload = loadUserProfile;
