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

function escapeHTML(text) {
    if (typeof text !== "string") return "";
    return text.replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/&/g, "&amp;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#39;")
               .replace(/\n/g, "<br>");
}

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

    const formattedText = escapeHTML(text);

    db.collection("users").doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const username = escapeHTML(doc.data().username);

                db.collection("posts").add({
                    text: formattedText,
                    likes: 0,
                    comments: [],
                    userId: user.uid,
                    username: username,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    console.log("✅ Пост добавлен!");
                    input.value = "";
                }).catch(error => {
                    console.error("❌ Ошибка добавления поста: ", error);
                });
            } else {
                console.error("Пользователь не найден в базе данных");
            }
        })
        .catch(error => {
            console.error("Ошибка при получении юзернейма: ", error);
        });
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log("🔹 Пользователь вошел:", user.displayName, user.email);
        document.querySelector(".login-btn").innerText = escapeHTML(user.displayName || user.email);

        db.collection("users").doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const username = escapeHTML(doc.data().username);
                    document.querySelector(".login-btn").innerText = username;
                } else {
                    console.error("Пользователь не найден в базе данных");
                }
            })
            .catch(error => {
                console.error("Ошибка загрузки юзернейма: ", error);
            });
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
                postText.innerHTML = escapeHTML(post.text);

                const usernameElement = document.createElement("p")
                const userProfileLink = document.createElement("a");
                userProfileLink.href = `profile.html?uid=${post.userId}`;
                userProfileLink.textContent = `Автор: ${escapeHTML(post.username)}`;
                usernameElement.appendChild(userProfileLink);

                postElement.appendChild(usernameElement);
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
            showMessage(`Добро пожаловать, ${escapeHTML(email)}!`, "green");
            closeModal();
            document.querySelector(".login-btn").innerText = email;
        })
        .catch(error => showMessage(error.message, "red"));
}

function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .then((result) => {
            var user = result.user;
            console.log("Успешный вход через Google:", user);

            var userInfo = escapeHTML(user.displayName);

            showMessage(`Добро пожаловать, ${userInfo}!`, "green");
            closeModal();
        })
        .catch((error) => {
            console.error("Ошибка входа через Google: ", error);
            showMessage("Ошибка входа через Google.", "red");
        });
}

document.getElementById("googleLoginBtn").addEventListener("click", googleLogin);

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
                        username: escapeHTML(username),
                        email: escapeHTML(email),
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

window.onload = function() {
    console.log("🔥 Страница загружена");
    loadPosts();
    
    const loginBtn = document.querySelector(".login-btn");
    if (loginBtn) {
        loginBtn.onclick = toggleLogin;
    } else {
        console.error("❌ Кнопка входа не найдена!");
    }
};

function showMessage(text, color = "red") {
    var msg = document.getElementById("authMessage");
    if (!msg) {
        console.error("❌ Элемент #authMessage не найден!");
        return;
    }
    msg.innerText = text;
    msg.style.color = color;
}

function toggleLogin() {
    console.log("🔹 Открытие модального окна входа");
    document.getElementById("authModal").style.display = "flex";
}

function closeModal() {
    console.log("🔸 Закрытие модального окна входа");
    document.getElementById("authModal").style.display = "none";
}

function openTerms() {
    window.open('terms.html', '_blank', 'width=600,height=600,left=50%,top=50%,resizable=yes');
}

function openPrivacy() {
    window.open('privacy.html', '_blank', 'width=600,height=600,left=50%,top=50%,resizable=yes');
}
