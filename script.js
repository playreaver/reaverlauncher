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
    newPost.innerHTML = `<p>${text}</p>`;

    postsDiv.prepend(newPost);
    
    // Добавляем анимацию появления
    setTimeout(() => {
        newPost.classList.add("show");
    }, 50);

    input.value = "";
}

function toggleLogin() {
    alert("Вход скоро появится!");
}
