const urlBase = 'https://jsonplaceholder.typicode.com/posts'; //URL con la que se va a interactuar

let posts = [] //Se inicia con un array vacío

function getData(){
    fetch(urlBase)
    .then(res => res.json())
    .then(data => {
        posts = data
        renderPostList()
    })
    .catch(error => alert('Error: ', error));
}

getData();

function renderPostList(){
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post =>{
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `

        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})" class="btnPost">Editar</button>
        <button onclick="deletePost(${post.id})" class="btnPost">Eliminar</button>

        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>

            <label for="editBody">Qué estás pensando? </label>
            <textarea type="text" id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar</button>

        </div>
        `
        postList.appendChild(listItem);
    })
}

// CREAR POST
function postData(){
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;
    
    if(postTitle.trim() == '' || postBody.trim() == ''){
        alert('Los campos son obligatorios')
        return
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        posts.unshift(data)//ponemos unshift para que el post que se agrega se agregue al principio y no al final como lo hace con push
        renderPostList(); 
        postTitleInput.value = ''       
        postBodyInput.value = ''       
    })
    .catch(error => alert('Error', error))
}

// EDITAR POST
function editPost(id){
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

//ACTUALIZAR POST
function updatePost(id){
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`,{
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        
    })
    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id)
        if(index != -1)  {
            posts[index] = data
        }else{
            alert("Error al actualizar")
        }
        renderPostList();
    })
    .catch(error => alert('Error', error))

}


//ELIMINAR POST
function deletePost(id){
    fetch(`${urlBase}/${id}`,{
        method: 'DELETE'        
    })
    .then(res =>{
        if(res.ok){
            posts = posts.filter(post => post.id != id)
            renderPostList()
        }else{
            alert('Error al eliminar el posteo')
        }
    })
    .catch(error => alert('Error', error))
}