// pop up box for survey 
var modal = document.getElementById("mySurveyMdl");

// Get the button that opens the modal
var btn = document.getElementById("mySurveyBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-ing")[0];

var submit = document.getElementById("sbmt-for-sur");

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

submit.onclick = function() {
    modal.style.display = "none";
}


// pop up box for Contacting
// pop up box for Contacting
// pop up box for Contacting

var modal1 = document.getElementById("mySurveyMdl1");

// Get the button that opens the modal
var btn1 = document.getElementById("mySurveyBtn1");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close-ing1")[0];

var submit1 = document.getElementById("sbmt-for-sur1");

// When the user clicks the button, open the modal 
btn1.onclick = function() {
  modal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modal1.style.display = "none";
}

submit1.onclick = function() {
    modal1.style.display = "none";
}

//resize text area for different devices
function adjust() {
  txt = document.querySelector("textarea");

  txt.style.width = "100%";
  txt.style.height = "100%";
}