// profile.js
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
var db = firebase.firestore();

function loadProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('uid');
    
    if (!userId) {
        alert("Ошибка: UID пользователя не найден!");
        return;
    }

    db.collection("users").doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById("profileUsername").innerText = userData.username;
                document.getElementById("profileAvatar").src = userData.avatar || "default-avatar.png";
                document.getElementById("bioContent").innerText = userData.bio || "Нет биографии";

                loadPosts(userId);
            } else {
                alert("Пользователь не найден.");
            }
        })
        .catch(error => {
            console.error("Ошибка при загрузке профиля:", error);
        });
}

function loadPosts(userId) {
    const postsContainer = document.getElementById("posts");

    db.collection("posts")
        .where("userId", "==", userId)
        .orderBy("timestamp", "desc")
        .get()
        .then(snapshot => {
            console.log("Полученные посты: ", snapshot); 

            postsContainer.innerHTML = "";

            if (snapshot.empty) {
                postsContainer.innerHTML = "<p>Постов нет.</p>";
                return;
            }

            snapshot.forEach(doc => {
                const post = doc.data();
                const postElement = document.createElement("div");
                postElement.classList.add("post");

                const postText = document.createElement("p");
                postText.innerHTML = post.text; 

                postElement.appendChild(postText);
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error("Ошибка при загрузке постов:", error);
        });
}


window.onload = loadProfile;
