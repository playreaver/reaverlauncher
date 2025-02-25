import { auth, db, registerUser, loginUser } from './firebase.js'; // Импортируем функции и объекты из firebase.js

function addPost() {
    let input = document.getElementById("postInput");
    let text = input.value.trim();

    if (text === "") {
        alert("Пост не может быть пустым!");
        return;
    }

    // Добавляем новый пост в Firebase
    db.collection("posts").add({
        text: text,
        likes: 0,
        comments: [],
        timestamp: FieldValue.serverTimestamp()  // Используем FieldValue
    }).then(() => {
        console.log("Post added!");
        input.value = "";
    }).catch(error => {
        console.error("Error adding post: ", error);
    });
}

// Функция регистрации с использованием Firebase
function register() {
    let email = document.getElementById("username").value.trim(); // Используем email для регистрации
    let password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage("Заполните все поля!", "red");
        return;
    }

    // Регистрация через Firebase
    registerUser(email, password)
        .then(() => {
            showMessage("Регистрация успешна!", "green");
            closeModal();
        })
        .catch(error => {
            showMessage(error.message, "red");
        });
}

// Функция входа с использованием Firebase
function login() {
    let email = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage("Заполните все поля!", "red");
        return;
    }

    // Вход через Firebase
    loginUser(email, password)
        .then(() => {
            showMessage(`Добро пожаловать, ${email}!`, "green");
            closeModal();
            document.querySelector(".login-btn").innerText = email; // Меняем кнопку на email
        })
        .catch(error => {
            showMessage(error.message, "red");
        });
}

function showMessage(text, color) {
    let msg = document.getElementById("authMessage");
    msg.innerText = text;
    msg.style.color = color;
}

function toggleLogin() {
    document.getElementById("authModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("authModal").style.display = "none";
}

