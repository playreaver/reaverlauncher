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
        likes: 0, // Начальное количество лайков
        comments: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // Используем только serverTimestamp
    }).then(() => {
        console.log("Пост добавлен!");
        input.value = "";
    }).catch(error => {
        console.error("Ошибка добавления поста: ", error);
    });
}

// Функция для отображения постов
function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "<p>Загрузка постов...</p>"; // Индикатор загрузки

    db.collection("posts")
        .orderBy("timestamp", "desc")  // Сортировка по serverTimestamp
        .onSnapshot(function(snapshot) {
            postsContainer.innerHTML = ""; // Очищаем контейнер после загрузки

            if (snapshot.empty) {
                postsContainer.innerHTML = "<p>Нет постов в базе данных.</p>";
                return;
            }

            snapshot.forEach(function(doc) {
                const post = doc.data();
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.id = doc.id;  // Присваиваем id для корректного удаления

                const timestamp = (post.timestamp && post.timestamp.seconds)
                    ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                    : new Date().toLocaleString(); // Fallback на локальное время

                postElement.innerHTML = `
                    <p>${post.text}</p>
                    <small>Дата: ${timestamp}</small>
                    <div>
                        <button class="like-btn" onclick="likePost('${doc.id}')">👍 Лайк (${post.likes})</button>
                    </div>
                `;

                postsContainer.appendChild(postElement);  // Добавляем пост в контейнер
            });
        }, function(error) {
            console.error("Ошибка при загрузке постов: ", error);
            postsContainer.innerHTML = "<p>Ошибка загрузки постов.</p>";
        });
}

// Функция для добавления лайка
function likePost(postId) {
    const postRef = db.collection("posts").doc(postId);

    postRef.get().then(doc => {
        if (doc.exists) {
            const postData = doc.data();
            const newLikes = postData.likes + 1;

            // Обновляем количество лайков
            postRef.update({
                likes: newLikes
            }).then(() => {
                console.log("Лайк добавлен!");
            }).catch(error => {
                console.error("Ошибка при добавлении лайка: ", error);
            });
        }
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

// Функция отправки сообщения
function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const receiverEmail = document.getElementById("receiverEmail").value.trim();
    const messageText = messageInput.value.trim();
    
    if (receiverEmail === "" || messageText === "") {
        alert("Введите получателя и сообщение!");
        return;
    }

    db.collection("messages").add({
        sender: auth.currentUser.email,
        receiver: receiverEmail,
        message: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Сообщение отправлено!");
        messageInput.value = "";  // Очистить поле ввода
    })
    .catch(error => {
        console.error("Ошибка отправки сообщения: ", error);
    });
}

// Функция для отображения сообщений
function loadMessages() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = "<p>Загрузка сообщений...</p>";

    db.collection("messages")
        .where("receiver", "==", auth.currentUser.email)  // Загружаем только сообщения для текущего пользователя
        .orderBy("timestamp", "desc")
        .onSnapshot(function(snapshot) {
            messagesContainer.innerHTML = ""; // Очищаем контейнер после загрузки

            if (snapshot.empty) {
                messagesContainer.innerHTML = "<p>Нет сообщений.</p>";
                return;
            }

            snapshot.forEach(function(doc) {
                const message = doc.data();
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");

                const timestamp = message.timestamp ? new Date(message.timestamp.seconds * 1000).toLocaleString() : "Неизвестно";
                
                messageElement.innerHTML = `
                    <p><strong>От:</strong> ${message.sender}</p>
                    <p><strong>Сообщение:</strong> ${message.message}</p>
                    <small>Дата: ${timestamp}</small>
                `;

                messagesContainer.appendChild(messageElement);
            });
        }, function(error) {
            console.error("Ошибка при загрузке сообщений: ", error);
            messagesContainer.innerHTML = "<p>Ошибка загрузки сообщений.</p>";
        });
}


// Закрытие окна входа
function closeModal() {
    document.getElementById("authModal").style.display = "none";
}
