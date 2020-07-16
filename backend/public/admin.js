
var up = document.getElementById('GFG_UP');
var down = document.getElementById('GFG_DOWN');
var div = document.getElementById('cox');

function GFG_Function() {
    div.parentNode.removeChild(div);
    down.innerHTML = "Element is removed.";
}

function GFS_Function() {
    div.parentNode.add(div, div);
    down.innerHTML = "Element is added.";
}

$('select').change(function () {
    if ($('select option:selected').text() == "Course Description") {
        $('label').show();
    }
    else {
        $('label').hide();
    }
});

function addTextArea1() {
    var div = document.getElementById('div_quotes1');

    div.innerHTML += "<textarea name='new_quote1[]' />";
    div.innerHTML += "\n<br />";

}

// function addUploadArea2(){
//     var div = document.getElementById('div_quotes2');

//     div.innerHTML += "<file name='new_quote2[]' />";
//     div.innerHTML += "\n<br />";

// }


function addTextArea3() {
    var div = document.getElementById('div_quotes3');

    div.innerHTML += "<textarea name='new_quote3[]' />";
    div.innerHTML += "\n<br />";

}


function addTextArea4() {
    var div = document.getElementById('div_quotes4');

    div.innerHTML += "<textarea name='new_quote4[]' />";
    div.innerHTML += "\n<br />";

}

function addTextArea5() {
    var div = document.getElementById('div_quotes5');

    div.innerHTML += "<textarea name='new_quote5[]' />";
    div.innerHTML += "\n<br />";

}

function addTextArea6() {
    var div = document.getElementById('div_quotes6');

    div.innerHTML += "<textarea name='new_quote6[]' />";
    div.innerHTML += "\n<br> You have to add URL for the New Source !";
    div.innerHTML += "\n<br />";

}

function setup() {
    document.getElementById('cco').addEventListener('click', openDialog);
    function openDialog() {
        document.getElementById('fileid').click();
    }
    document.getElementById('fileid').addEventListener('change', submitForm);
    function submitForm() {
        document.getElementById('formid').submit();
    }
}

function insertInput() {
    let clone = $(".prereq").last().clone()
    $(".prereq").last().after(clone)
}


function addCourse() {
$.ajax({
    type: 'post',
    url: '/courses',
    data: $('#addCourse').serialize(),
    success: function (data) {
        console.log(data);
        $("#addCourse").append('<p style="color: green;">' + data.status + ': ' + data.responseText + '</p>')
    },
    error: (data) => {
        console.log(data)
        $("#addCourse").append('<p style="color: red;">Error Code ' + data.status + ': ' + data.responseText + '</p>')
    }
})
}