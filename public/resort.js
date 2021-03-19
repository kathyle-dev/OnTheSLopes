// EVENT LISTENER TO GRAB GEOLOCATION ===================================
//=======================================================================
document.getElementById("loc_btn").addEventListener("click", getLocation);
var loc = document.getElementById("location");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(savePosition);
    sendCoordinates();
  } else {
    loc.innerHTML = "Geolocation is not supported by this browser.";
  }
}
let body;
function savePosition(position) {
  body = {
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
  };
}

//send the coordinates to a backend route
function sendCoordinates() {
  const URL = "/resorts";
  fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => displayResorts(data))
    .catch((err) => console.log(err));
}
let cards = "";

//display the resorts gotten from the google places api 
function displayResorts(data) {
  for (let i = 0; i < data.length; i++) {
    //console.log(data[i]);
    let name = data[i].name;
    //let picture = data[i].photos[0].photo_reference;
    let rating = data[i].rating;
    // let {
    //   opening_hours: { open_now },
    // } = data[i];
    // isOpen = isOpen.toString();
    // console.log(open_now);
    cards += `<div class="card" style="width: 18rem;">
        <div class="card_class">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">${rating}</p>
        </div>
    </div>`;
  }
  document.getElementById("resorts_container").innerHTML = cards;
}