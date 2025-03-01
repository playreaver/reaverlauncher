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

        document.getElementById("editBioBtn").addEventListener("click", function() {
            var bioContent = document.getElementById("bio").textContent;
            document.getElementById("bioEditTextarea").value = bioContent === "Биография не задана." ? "" : bioContent;
            document.getElementById("bioEditModal").style.display = "flex";
        });

        document.getElementById("saveBioBtn").addEventListener("click", function() {
            var newBio = document.getElementById("bioEditTextarea").value;
            db.collection("users").doc(userId).update({
                bio: newBio
            }).then(function() {
                document.getElementById("bio").textContent = newBio || "Биография не задана.";
                document.getElementById("bioEditModal").style.display = "none";
            }).catch(function(error) {
                console.error("Ошибка обновления биографии: ", error);
            });
        });

        document.getElementById("cancelBioBtn").addEventListener("click", function() {
            document.getElementById("bioEditModal").style.display = "none";
        });

    } else {
        window.location.href = "login.html";
    }
});
