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
        loadPosts(); // Перезагружаем посты после добавления нового
    }).catch(error => {
        console.error("Ошибка добавления поста: ", error);
    });
}

// Функция для отображения постов
function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";  // Очищаем контейнер перед загрузкой новых данных

    db.collection("posts")
        .orderBy("timestamp", "desc")  // Сортировка по времени
        .get()  // Используем get() вместо onSnapshot для однократной загрузки данных
        .then(function(snapshot) {
            console.log("Загружаю посты...");

            if (snapshot.empty) {
                console.log("Нет постов в базе данных.");
                return;
            }

            snapshot.forEach(function(doc) {
                const post = doc.data();

                // Проверяем наличие поля timestamp
                const timestamp = post.timestamp ? new Date(post.timestamp.seconds * 1000).toLocaleString() : "Неизвестная дата";
                
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `
                    <p>${post.text}</p>
                    <small>Дата: ${timestamp}</small>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(function(error) {
            console.error("Ошибка при загрузке постов: ", error);
        });
}

// Вызов функции для загрузки постов при инициализации страницы
window.onload = function() {
    loadPosts(); // Загружаем посты только один раз при загрузке страницы
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
