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
    input.value = "";
}

function toggleLogin() {
    alert("Функция входа пока не реализована!");
}
