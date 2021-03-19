// EVENT LISTENER TO EDIT & DELETE POSTS ================================
//=======================================================================

let editBtns = document.getElementsByClassName("edit")
let deleteBtns = document.getElementsByClassName("delete")
let allBtns = [...editBtns, ...deleteBtns]

allBtns.forEach(btn => {
  btn.addEventListener("click", handleButtonClick)
})

function handleButtonClick(e){
  const postId = e.target.dataset.id
  if(e.target.classList.contains("edit")){
    editCard(postId)
  }else if(e.target.classList.contains("delete")){
    deleteCard(postId)
  }
}

function editCard(id){
  document.getElementById(`edit-form-${id}`).addEventListener("submit", (e)=>{
    let elements = e.target.elements
    let formData = getFormData(elements)
    formData.id = id
    putFetchCall(formData)
    e.preventDefault()
  })
}

function putFetchCall(data){
  fetch("edit", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res)
      window.location.reload()
    })
 }

function getFormData(elements){
  let formData = {};
  for(let i= 0; i< elements.length; i++){
      if(elements[i].tagName === "INPUT" || elements[i].tagName === "SELECT" ){
          const key = elements[i].name
          const value = elements[i].value
          formData[`${key}`] = value
      }
  }
  return formData;
}

function deleteCard(id){
  fetch("delete", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id}),
  })
    .then((res) => {
      window.location.reload()
    })
}

//to remove the successful post add alert
document.getElementById("close").addEventListener("click", ()=>{
  document.getElementById("alertDiv").remove()
})


// JS FOR PAGE STYLING ================================
//=======================================================================

// Accordion
function myFunction(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    x.previousElementSibling.className += " w3-theme-d1";
  } else {
    x.className = x.className.replace("w3-show", "");
    x.previousElementSibling.className =
            x.previousElementSibling.className.replace(" w3-theme-d1", "");
  }
}

// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}