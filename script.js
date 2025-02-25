import { db } from './firebase';

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

// Функция для получения постов из Firestore
function getPosts() {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        let postsDiv = document.getElementById("posts");
        postsDiv.innerHTML = ""; // Очистить старые посты

        snapshot.forEach(doc => {
            let post = doc.data();
            let postId = doc.id;
            let newPost = document.createElement("div");
            newPost.classList.add("post");
            newPost.setAttribute("data-id", postId);

            newPost.innerHTML = `
                <p>${post.text}</p>
                <div class="post-actions">
                    <button class="like-btn" onclick="toggleLike(this, '${postId}')">❤️ ${post.likes}</button>
                    <button class="comment-btn" onclick="toggleComments(this)">💬 ${post.comments.length}</button>
                </div>
                <div class="comments" style="display: none;">
                    <input type="text" class="comment-input" placeholder="Написать комментарий...">
                    <button class="send-comment" onclick="addComment(this, '${postId}')">Отправить</button>
                    <div class="comment-list"></div>
                </div>
            `;
            
            postsDiv.prepend(newPost);
        });
    });
}

// Функция для лайков
function toggleLike(btn, postId) {
    let postRef = db.collection("posts").doc(postId);

    postRef.get().then(doc => {
        if (doc.exists) {
            let post = doc.data();
            let newLikes = post.likes + 1;
            postRef.update({
                likes: newLikes
            }).then(() => {
                btn.innerText = `❤️ ${newLikes}`;
            });
        }
    });
}

// Функция добавления комментариев
function addComment(btn, postId) {
    let postRef = db.collection("posts").doc(postId);
    let input = btn.closest(".post").querySelector(".comment-input");
    let text = input.value.trim();

    if (text === "") return;

    postRef.update({
        comments: firebase.firestore.FieldValue.arrayUnion(text)
    }).then(() => {
        input.value = ""; // Очистить input
    });
}

function toggleComments(btn) {
    let post = btn.closest(".post");
    let comments = post.querySelector(".comments");
    comments.style.display = comments.style.display === "none" ? "block" : "none";
}

function toggleLogin() {
    document.getElementById("authModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("authModal").style.display = "none";
}

function register() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Заполните все поля!", "red");
        return;
    }

    if (localStorage.getItem(username)) {
        showMessage("Пользователь уже существует!", "red");
        return;
    }

    localStorage.setItem(username, password);
    showMessage("Регистрация успешна!", "green");
}

function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Заполните все поля!", "red");
        return;
    }

    let storedPassword = localStorage.getItem(username);
    if (storedPassword === password) {
        showMessage(`Добро пожаловать, ${username}!`, "green");
        closeModal();
        document.querySelector(".login-btn").innerText = username;
    } else {
        showMessage("Неверные данные!", "red");
    }
}

function showMessage(text, color) {
    let msg = document.getElementById("authMessage");
    msg.innerText = text;
    msg.style.color = color;
}

// Загрузка постов при запуске
getPosts();

