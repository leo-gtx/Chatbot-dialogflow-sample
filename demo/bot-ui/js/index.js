const API_HOST_URL = 'https://studentinformationchatbot.herokuapp.com/api/chatbot';
var $messages = $('.messages-content');
var serverResponse = "wala";


var suggession;
//speech recognition
try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
    $('.no-browser-support').show();
}

$('#start-record-btn').on('click', function(e) {
    recognition.start();
});

recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    document.getElementById("MSG").value = speechToText;
    //console.log(speechToText)
    insertMessage();
    //serverMessage("hello");
}


function listendom(no) {
    console.log(no)
        //console.log(document.getElementById(no))
    document.getElementById("MSG").value = no.innerHTML;
    insertMessage();
}

$(window).load(function() {
    $messages.mCustomScrollbar();
    setTimeout(function() {
        serverMessage("hello i'm Judith");
    }, 100);

});

function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}



function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
        return false;
    }
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    fetchmsg();

    $('.message-input').val(null);
    updateScrollbar();

}

document.getElementById("mymsg").onsubmit = (e) => {
    e.preventDefault()
    insertMessage();
    //serverMessage("hello");
    //speechSynthesis.speak(new SpeechSynthesisUtterance("hello"))
}

function serverMessage(response2) {


    if ($('.message-input').val() != '') {
        return false;
    }
    $('<div class="message loading new"><figure class="avatar"><img src="bot-ui/css/bot.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();


    setTimeout(function() {
        $('.message.loading').remove();
        $('<div class="message new"><figure class="avatar"><img src="bot-ui/css/bot.png" /></figure>' + response2 + '</div>').appendTo($('.mCSB_container')).addClass('new');
        updateScrollbar();
    }, 100 + (Math.random() * 20) * 100);
    //Text to speech
    var utterance = new SpeechSynthesisUtterance(response2);
    var voices = window.speechSynthesis.getVoices();
    //console.log(voices);
    utterance.voice = voices.filter(function(voice) { return voice.name == 'Microsoft David Desktop - English (United States)'; })[0];

    window.speechSynthesis.speak(utterance);

}


function fetchmsg() {


    const data = new URLSearchParams();
    for (const pair of new FormData(document.getElementById("mymsg"))) {
        data.append(pair[0], pair[1]);
    }

    fetch(API_HOST_URL, {
            method: 'POST',
            body: data
        }).then(res => res.json())
        .then(response => {
            serverMessage(response.reply);
            //speechSynthesis.speak(new SpeechSynthesisUtterance(response.reply))


        })
        .catch(error => console.error('Error h:', error));

}
