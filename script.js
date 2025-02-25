// Инициализация Firebase
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
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Функция добавления поста
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
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
    firebase.auth().createUserWithEmailAndPassword(email, password)
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
    firebase.auth().signInWithEmailAndPassword(email, password)
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
