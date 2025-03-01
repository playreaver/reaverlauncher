import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUn0QjsY8GYRuuFGzOMmloeJegtxxMZCc",
    authDomain: "reaversocial.firebaseapp.com",
    projectId: "reaversocial",
    storageBucket: "reaversocial.firebasestorage.app",
    messagingSenderId: "461982892032",
    appId: "1:461982892032:web:5327c7e66a4ddddff1d8e5",
    measurementId: "G-CD344TGD2D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
    console.log("Пользователь:", user);
    if (user) {
        const userId = user.uid;
        console.log("UID пользователя:", userId);

        try {
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("Данные пользователя:", userData);

                document.getElementById("username").textContent = userData.username;
                document.getElementById("bio").textContent = userData.bio || "Биография не задана.";
                document.getElementById("avatar").src = userData.avatar || "default-avatar.png";

                document.getElementById("editBioBtn").addEventListener("click", () => {
                    document.getElementById("bioEditTextarea").value = userData.bio || "";
                    document.getElementById("bioEditModal").style.display = "flex";
                });

                document.getElementById("saveBioBtn").addEventListener("click", async () => {
                    const newBio = document.getElementById("bioEditTextarea").value.trim();
                    
                    try {
                        await updateDoc(userDocRef, { bio: newBio });
                        document.getElementById("bio").textContent = newBio || "Биография не задана.";
                        document.getElementById("bioEditModal").style.display = "none";
                    } catch (error) {
                        console.error("Ошибка обновления биографии:", error);
                    }
                });

                document.getElementById("cancelBioBtn").addEventListener("click", () => {
                    document.getElementById("bioEditModal").style.display = "none";
                });

                document.getElementById("publishPostBtn").addEventListener("click", async () => {
                    const postContent = document.getElementById("postContent").value.trim();
                    if (postContent === "") return;

                    try {
                        await addDoc(collection(db, "profileposts"), {
                            userId: userId,
                            username: userData.username,
                            content: postContent,
                            timestamp: new Date()
                        });
                        document.getElementById("postContent").value = ""; 
                        loadPosts(userId); 
                    } catch (error) {
                        console.error("Ошибка публикации поста:", error);
                    }
                });

                loadPosts(userId);
            } else {
                console.log("Документ не найден!");
            }
        } catch (error) {
            console.error("Ошибка получения документа:", error);
        }
    } else {
        console.log("Пользователь не авторизован, перенаправление...");
        window.location.href = "login.html";
    }
});

async function loadPosts(userId) {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; 

    const q = query(collection(db, "profileposts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const postData = doc.data();
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <p><strong>${postData.username}</strong></p>
            <p>${postData.content}</p>
        `;
        postsContainer.appendChild(postElement);
    });
}
