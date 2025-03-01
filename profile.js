
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
var auth = firebase.auth();

auth.onAuthStateChanged(function(user) {
    if (user) {
        var userId = user.uid;

        db.collection("users").doc(userId).get().then(function(doc) {
            if (doc.exists) {
                var userData = doc.data();

                document.getElementById("username").textContent = userData.username;
                document.getElementById("bio").textContent = userData.bio || "Биография не задана.";
                document.getElementById("avatar").src = userData.avatar || "default-avatar.png";
            } else {
                console.log("Документ не найден!");
            }
        }).catch(function(error) {
            console.error("Ошибка получения документа: ", error);
        });
    } else {
        window.location.href = "login.html";
    }
});
