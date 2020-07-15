// ANOTHER ONE 
// FOR THE
// LOGIN POP UP BOX

// pop up box for survey 
var modal2 = document.getElementById("loginz");

// Get the button that opens the modal
var btn2 = document.getElementById("loginbtn");

// Get the <span> element that closes the modal
var span2 = document.getElementsByClassName("close-ing2")[0];

var submit2 = document.getElementById("sbmt-for-log");

// When the user clicks the button, open the modal 
btn2.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  modal2.style.display = "none";
}

submit2.onclick = function() {
    modal2.style.display = "none";
}

//resize text area for different devices
function adjust() {
  txt2 = document.querySelector("textareax");

  txt2.style.width = "100%";
  txt2.style.height = "100%";
}

function validateForm() {
  var x = document.forms["message2"]["Username"].value;
  if (x == "") {
    alert("Username must be filled out");
    return false;
  }
}