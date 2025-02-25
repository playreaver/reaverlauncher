function addPost() {
    let input = document.getElementById("postInput");
    let text = input.value.trim();

    if (text === "") {
        alert("Пост не может быть пустым!");
        return;
    }

    let postsDiv = document.getElementById("posts");
    let newPost = document.createElement("div");
    newPost.classList.add("post");

    // Добавляем текст, лайки и комментарии
    newPost.innerHTML = `
        <p>${text}</p>
        <div class="post-actions">
            <button class="like-btn" onclick="toggleLike(this)">❤️ 0</button>
            <button class="comment-btn" onclick="toggleComments(this)">💬 0</button>
        </div>
        <div class="comments" style="display: none;">
            <input type="text" class="comment-input" placeholder="Написать комментарий...">
            <button class="send-comment" onclick="addComment(this)">Отправить</button>
            <div class="comment-list"></div>
        </div>
    `;

    postsDiv.prepend(newPost);
    setTimeout(() => newPost.classList.add("show"), 50);
    input.value = "";
}

function toggleLike(btn) {
    let likes = parseInt(btn.innerText.split(" ")[1]); // Получаем текущее число лайков
    if (btn.classList.contains("liked")) {
        btn.classList.remove("liked");
        likes--;
    } else {
        btn.classList.add("liked");
        likes++;
    }
    btn.innerText = `❤️ ${likes}`;
}

function toggleComments(btn) {
    let post = btn.closest(".post");
    let comments = post.querySelector(".comments");
    comments.style.display = comments.style.display === "none" ? "block" : "none";
}

function addComment(btn) {
    let post = btn.closest(".post");
    let input = post.querySelector(".comment-input");
    let text = input.value.trim();

    if (text === "") return;

    let commentList = post.querySelector(".comment-list");
    let newComment = document.createElement("p");
    newComment.classList.add("comment");
    newComment.innerText = text;

    commentList.appendChild(newComment);
    input.value = "";

    let commentBtn = post.querySelector(".comment-btn");
    let commentsCount = parseInt(commentBtn.innerText.split(" ")[1]) + 1;
    commentBtn.innerText = `💬 ${commentsCount}`;
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
