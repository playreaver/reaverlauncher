import { auth, db, collection, addDoc, serverTimestamp } from './firebase.js';

// Функция отправки сообщения
async function sendMessage() {
    const messageInput = document.getElementById("messageInput").value.trim();
    const receiverEmail = document.getElementById("receiverEmail").value.trim();
    const user = auth.currentUser;

    if (!messageInput || !receiverEmail) {
        alert("Заполните все поля!");
        return;
    }

    if (!user) {
        alert("Пожалуйста, войдите в систему.");
        return;
    }

    try {
        // Добавляем сообщение в Firestore
        await addDoc(collection(db, "messages"), {
            sender: user.email,
            receiver: receiverEmail,
            message: messageInput,
            timestamp: serverTimestamp()
        });

        console.log("Сообщение отправлено!");
        document.getElementById("messageInput").value = "";
        document.getElementById("receiverEmail").value = "";
    } catch (error) {
        console.error("Ошибка при отправке сообщения:", error.message);
    }
}

// Функция загрузки сообщений
async function loadMessages() {
    const messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.innerHTML = "<p>Загрузка сообщений...</p>";

    const user = auth.currentUser;
    if (!user) {
        messagesContainer.innerHTML = "<p>Пожалуйста, войдите в систему.</p>";
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, "messages"));
        messagesContainer.innerHTML = ""; // Очистим контейнер перед загрузкой сообщений

        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.sender === user.email || data.receiver === user.email) {
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");
                messageElement.innerHTML = `
                    <strong>${data.sender}:</strong> ${data.message}
                    <br><small>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</small>
                `;
                messagesContainer.appendChild(messageElement);
            }
        });
    } catch (error) {
        console.error("Ошибка при загрузке сообщений:", error.message);
        messagesContainer.innerHTML = "<p>Ошибка при загрузке сообщений.</p>";
    }
}

// Загружаем сообщения при загрузке страницы
window.onload = function() {
    loadMessages();
};

// Функции для входа и регистрации (уже есть в твоем коде)
async function login() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        await loginUser(email, password);
        alert("Вход успешен!");
        loadMessages(); // Загружаем сообщения после входа
    } catch (error) {
        alert(error.message);
    }
}

async function register() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        await registerUser(email, password);
        alert("Регистрация успешна!");
    } catch (error) {
        alert(error.message);
    }
}

function toggleLogin() {
    document.getElementById("authModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("authModal").style.display = "none";
}
