// Changing Color of the text when mouse on the text, FROM HERE
function changeColor(obj) {
    if (obj.style.color == 'indigo') {
        obj.style.color = 'white';
    } else {
        obj.style.color = 'indigo';
    }
}

function changeColorM(obj) {
    if (obj.style.color == 'indigo') {
        obj.style.color = 'black';
    } else {
        obj.style.color = 'indigo';
    }
}

function changeColorH(obj) {
    if (obj.style.color == 'cyan') {
        obj.style.color = 'white';
    } else {
        obj.style.color = 'cyan';
    }
}

function changeColorL(obj) {
    if (obj.style.color == 'teal') {
        obj.style.color = 'white';
    } else {
        obj.style.color = 'teal';
    }
}

function changeColorLM(obj) {
    if (obj.style.color == 'teal') {
        obj.style.color = 'purple';
    } else {
        obj.style.color = 'teal';
    }
}
// TO HERE

//Header will contain only KFUPM assessment and hamgurger icon for remaining
function toggleNav() {
    let nav = document.getElementsByClassName("dropDownNav")[0]
    console.assert(nav != null)
    if (nav.classList.contains("toggled"))
        nav.classList.remove('toggled')
    else
        nav.classList.add("toggled")
}

//Navigation Being sticky on scrolling
window.onscroll = function() {scrolls()};

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function scrolls() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

//Flipping hamburger icon to close icon
const menuBtn = document.querySelector('.menu-btn');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
  if(!menuOpen) {
    menuBtn.classList.add('open');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    menuOpen = false;
  }
});

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
