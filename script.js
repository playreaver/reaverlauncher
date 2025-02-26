// Инициализация Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDUn0QjsY8GYRuuFGzOMmloeJegtxxMZCc",
    authDomain: "reaversocial.firebaseapp.com",
    projectId: "reaversocial",
    storageBucket: "reaversocial.firebasestorage.app",
    messagingSenderId: "461982892032",
    appId: "1:461982892032:web:5327c7e66a4ddddff1d8e5",
    measurementId: "G-CD344TGD2D"
};

// Подключаем Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

// Функция добавления поста
function addPost() {
    var input = document.getElementById("postInput");
    var text = input.value.trim();

    if (text === "") {
        alert("Пост не может быть пустым!");
        return;
    }

    db.collection("posts").add({
        text: text,
        likes: 0,
        comments: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Пост добавлен!");
        input.value = "";
    }).catch(error => {
        console.error("Ошибка добавления поста: ", error);
    });
}

// Функция регистрации
function register() {
    var email = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage("Заполните все поля!", "red");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            showMessage("Регистрация успешна!", "green");
            closeModal();
        })
        .catch(error => {
            showMessage(error.message, "red");
        });
}

function loadPosts() {
    db.collection("posts")
        .orderBy("timestamp", "desc")  // Сортировка по времени
        .onSnapshot((snapshot) => {
            const postsContainer = document.getElementById("posts");
            postsContainer.innerHTML = "";  // Очищаем контейнер перед загрузкой новых данных

            snapshot.forEach((doc) => {
                const post = doc.data();
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `
                    <p>${post.text}</p>
                    <small>Дата: ${new Date(post.timestamp.seconds * 1000).toLocaleString()}</small>
                `;
                postsContainer.appendChild(postElement);
            });
        });
}


// Функция входа
function login() {
    var email = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage("Заполните все поля!", "red");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showMessage(`Добро пожаловать, ${email}!`, "green");
            closeModal();
            document.querySelector(".login-btn").innerText = email;
        })
        .catch(error => {
            showMessage(error.message, "red");
        });
}

window.onload = loadPosts;
// Функция отображения сообщений
function showMessage(text, color) {
    var msg = document.getElementById("authMessage");
    msg.innerText = text;
    msg.style.color = color;
}

// Открытие окна входа
function toggleLogin() {
    document.getElementById("authModal").style.display = "flex";
}

// Закрытие окна входа
function closeModal() {
    document.getElementById("authModal").style.display = "none";
}
