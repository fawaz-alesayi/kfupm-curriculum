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

//Header will contain only KFUPM Curriculum and hamgurger icon for remaining
function toggleNav() {
  let nav = document.getElementsByClassName("dropDownNav")[0]
  console.assert(nav != null)
  if (nav.classList.contains("toggled"))
    nav.classList.remove('toggled')
  else
    nav.classList.add("toggled")
}

//Navigation Being sticky on scrolling
window.onscroll = function () { scrolls() };

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
  if (!menuOpen) {
    menuBtn.classList.add('open');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    menuOpen = false;
  }
});

// SILDE SHOW IN THE HOME PAGE !!!

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function plusSlides(n) {
  clearInterval(myTimer);
  if (n < 0) {
    showSlides(slideIndex -= 1);
  } else {
    showSlides(slideIndex += 1);
  }
  if (n === -1) {
    myTimer = setInterval(function () { plusSlides(n + 2) }, 6000);
  } else {
    myTimer = setInterval(function () { plusSlides(n + 1) }, 6000);
  }
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }


  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";

}

window.addEventListener("load", function () {
  showSlides(slideIndex);
  myTimer = setInterval(function () { plusSlides(1) }, 6000);
})

function currentSlide(n) {
  clearInterval(myTimer);
  myTimer = setInterval(function () { plusSlides(n + 1) }, 6000);
  showSlides(slideIndex = n);
}

var slideshowContainer = document.getElementsByClassName('slideshow-container')[0];
slideshowContainer.addEventListener('mouseenter', pause)
slideshowContainer.addEventListener('mouseleave', resume)

pause = () => {
  clearInterval(myTimer);
}

resume = () => {
  clearInterval(myTimer);
  myTimer = setInterval(function () { plusSlides(slideIndex) }, 6000);
}
// END OF SILDE SHOW IN THE HOME PAGE !!!


// Search Functionality

function searchCourses(searchText) {
  if (searchText) {
    $.ajax({
      type: 'get',
      url: `/courses/search/${searchText}`,
      success: function (data) {
        addResults(data)
      },
      error: (data) => {
        $(".dropDownNav .search-group").css('border-radius', '25px 25px 0 0')
        $('.result-group').empty()
        $('.result-group').append(`<div class="result">No courses found.</div>`)
      }
    })
  } else {
    $(".dropDownNav .search-group").css('border-radius', '25px')
    $('.result-group').empty()
  }
}

function addResults(data) {
  $(".dropDownNav .search-group").css('border-radius', '25px')
  $('.result-group').empty()
  if (data) {
    $(".dropDownNav .search-group").css('border-radius', '25px 25px 0 0')
    data.forEach(course => { $('.result-group').append(`<div class="result"><a href="/courses/${course.code}">${course.code}: ${course.name}</a></div>`) })
  }
}
