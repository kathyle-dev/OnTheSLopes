// EVENT LISTENER TO DELETE POSTS ======================================
//=======================================================================

let deleteBtns = document.getElementsByClassName("delete")

Array.from(deleteBtns).forEach(btn => {
  btn.addEventListener("click", handleButtonClick)
})

function handleButtonClick(e){
  const postId = e.target.dataset.id
    deleteCard(postId)
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