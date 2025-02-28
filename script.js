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

function addPost() {
    var user = auth.currentUser;
    if (!user) {
        alert("Для публикации постов необходимо войти в аккаунт!");
        return;
    }

    var input = document.getElementById("postInput");
    var text = input.value.trim();

    if (text === "") {
        alert("Пост не может быть пустым!");
        return;
    }

    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
    const formattedText = safeText.replace(/\n/g, "<br>");

    db.collection("posts").add({
        text: formattedText,
        likes: 0,
        comments: [],
        userId: user.uid, // Сохраняем ID автора поста
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("✅ Пост добавлен!");
        input.value = "";
    }).catch(error => {
        console.error("❌ Ошибка добавления поста: ", error);
    });
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log("🔹 Пользователь вошел:", user.email);
        document.querySelector(".login-btn").innerText = user.email;
    } else {
        console.log("🔸 Пользователь вышел");
        document.querySelector(".login-btn").innerText = "Войти";
    }
});

function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "<p>Загрузка постов...</p>";

    db.collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot(snapshot => {
            postsContainer.innerHTML = "";

            if (snapshot.empty) {
                postsContainer.innerHTML = "<p>Нет постов в базе данных.</p>";
                return;
            }

            snapshot.forEach(doc => {
                const post = doc.data();
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.id = doc.id;

                const timestamp = post.timestamp?.seconds
                    ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                    : new Date().toLocaleString();

                const postText = document.createElement("p");
                postText.textContent = post.text.replace(/<br>/g, "\n");

                postElement.appendChild(postText);
                postElement.innerHTML += `
                    <small>Дата: ${timestamp}</small>
                    <div>
                        <button class="like-btn" onclick="likePost('${doc.id}')">👍 Лайк (${post.likes})</button>
                    </div>
                `;

                postsContainer.appendChild(postElement);
            });
        }, error => {
            console.error("Ошибка при загрузке постов: ", error);
            postsContainer.innerHTML = "<p>Ошибка загрузки постов.</p>";
        });
}

function likePost(postId) {
    const postRef = db.collection("posts").doc(postId);

    postRef.get().then(doc => {
        if (doc.exists) {
            const postData = doc.data();
            postRef.update({ likes: postData.likes + 1 })
                .then(() => console.log("Лайк добавлен!"))
                .catch(error => console.error("Ошибка при добавлении лайка: ", error));
        }
    });
}

window.onload = loadPosts;

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
        .catch(error => showMessage(error.message, "red"));
}

function register() {
    var email = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();
    var username = document.getElementById("usernameInput").value.trim();
    var termsChecked = document.getElementById("termsCheckbox").checked;
    var privacyChecked = document.getElementById("privacyCheckbox").checked;

    if (!email || !password || !username) {
        showMessage("Заполните все поля!", "red");
        return;
    }

    if (!termsChecked || !privacyChecked) {
        showMessage("Вы должны принять условия использования и политику конфиденциальности!", "red");
        return;
    }

    db.collection("users").where("username", "==", username).get()
        .then(snapshot => {
            if (!snapshot.empty) {
                showMessage("Этот юзернейм уже занят!", "red");
                return;
            }

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    db.collection("users").doc(userCredential.user.uid).set({
                        username: username,
                        email: email,
                        uid: userCredential.user.uid
                    })
                    .then(() => {
                        showMessage("Регистрация успешна!", "green");
                        closeModal();
                    })
                    .catch(error => showMessage(error.message, "red"));
                })
                .catch(error => showMessage(error.message, "red"));
        })
        .catch(error => {
            console.error("Ошибка проверки уникальности юзернейма: ", error);
            showMessage("Ошибка регистрации. Попробуйте позже.", "red");
        });
}

function showMessage(text, color) {
    var msg = document.getElementById("authMessage");
    if (!msg) {
        console.error("Элемент #authMessage не найден!");
        return;
    }
    msg.innerText = text;
    msg.style.color = color;
}

function openTerms() {
    window.open('terms.html', 'Terms', 'width=500,height=600,resizable=no,scrollbars=yes');
}

function openPrivacy() {
    window.open('privacy.html', 'Privacy', 'width=500,height=600,resizable=no,scrollbars=yes');
}

// Открытие окна входа
function toggleLogin() {
    document.getElementById("authModal").style.display = "flex";
}

// Закрытие окна входа
function closeModal() {
    document.getElementById("authModal").style.display = "none";
}
