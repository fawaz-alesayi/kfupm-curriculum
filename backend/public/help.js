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

function showModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}



// pop up box for Contacting

var modal1 = document.getElementById("mySurveyMdl1");

// Get the button that opens the modal
var btn1 = document.getElementById("mySurveyBtn1");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close-ing1")[0];

// When the user clicks the button, open the modal 
btn1.onclick = function() {
  modal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modal1.style.display = "none";
}

//resize text area for different devices
function adjust() {
  txt = document.querySelector("textarea");

  txt.style.width = "100%";
  txt.style.height = "100%";
}

// Survey ajax
function postSurvey() {
  $.ajax({
      type: 'post',
      url: '/feedback/surveys',
      data: $('#survey').serialize(),
      success: () => {
          $("#survey").append('<p style="color: antiquewhite;">Thank you for participating in our short survey</p>')
      },
      error: () => {
          $("#survey").append('<p style="color: crimson;">Whoops! Something wrong happened.</p>')
      }
  })
}

// message ajax
function postMessage() {
  $.ajax({
      type: 'post',
      url: '/feedback/messages',
      data: $('#message').serialize(),
      success: () => {
          $("#message").append('<p style="color: antiquewhite;">Your message was sent successfully</p>')
      },
      error: () => {
          $("#message").append('<p style="color: crimson;">Whoops! Something wrong happened.</p>')
      }
  })
}