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
longitude : position.coords.longitude,
latitude : position.coords.latitude
}
}

//send the form inputs to a backend route
function sendCoordinates(){
const URL = "/resorts"
fetch(URL, {
method: "GET",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(body),
})
.then((res) => res.json())
.then(data => console.log(data, "Front end fetch resorts"))
}