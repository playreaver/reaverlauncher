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
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

// Функция добавления поста с локальной меткой времени
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
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        localTimestamp: new Date().getTime() // локальная метка времени для сортировки
    }).then(() => {
        console.log("Пост добавлен!");
        input.value = "";
    }).catch(error => {
        console.error("Ошибка добавления поста: ", error);
    });
}

// Функция для отображения постов, сортируем по localTimestamp
function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";  // Очищаем контейнер перед загрузкой данных
    db.collection("posts")
        .orderBy("localTimestamp", "desc")  // Сортировка по локальной метке времени
        .onSnapshot(function(snapshot) {
            console.log("Загружаю посты... Количество:", snapshot.size);
            if (snapshot.empty) {
                postsContainer.innerHTML = "<p>Нет постов в базе данных.</p>";
                return;
            }
            postsContainer.innerHTML = "";
            snapshot.forEach(function(doc) {
                const post = doc.data();
                // Если серверный timestamp уже установлен, используем его для отображения, иначе - локальное время
                const timestamp = (post.timestamp && post.timestamp.seconds)
                    ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                    : new Date(post.localTimestamp).toLocaleString();
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `
                    <p>${post.text}</p>
                    <small>Дата: ${timestamp}</small>
                `;
                postsContainer.appendChild(postElement);
            });
        }, function(error) {
            console.error("Ошибка при загрузке постов: ", error);
        });
}

// Загрузка постов при загрузке страницы
window.onload = function() {
    loadPosts();
};

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
