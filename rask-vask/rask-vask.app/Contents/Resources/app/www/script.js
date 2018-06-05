const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

// Objects
var appState = {
    "clean": {
        "active": false,
        "done": false,
        "minutes": 15,
        "customName": "Vasket gulv"
    },
    "vacuum": {
        "active": false,
        "done": false, 
        "minutes": 15,
        "customName": "Støvsugd"
    },
    "dust": {
        "active": false,
        "done": false, 
        "minutes": 10,
        "customName": "Tørket støv"
    }, 
    "benches": {
        "active": false,
        "done": false, 
        "minutes": 5,
        "customName": "Vasket benker"
    },
    "mirror": {
        "active": false,
        "done": false, 
        "minutes": 5,
        "customName": "Vasket speil"
    }
};

// Duration
var durationHolder = {
    "min": 0,
    "sec": 0
};

// Activity List
var activityList  = document.querySelectorAll('input[type=radio]');

for(var activityButton of activityList){
    
    activityButton.addEventListener('click', function(event){
  
        // set radio button state
        this.classList.toggle('active');

        document.getElementById('to_do_selector').classList.add('active');
        
        setActive(this.value);

        // set the timer
        durationHolder.min = appState[this.value].minutes;
        showDuration();
    });
};


// Set app state
function setActive(element){
    
    for(var activity in appState) {

        if(activity == element) {
            appState[activity].active = true;

        } else {
            appState[activity].active = false;
        }
    }
}

// Mark selected activity
let label = Array.from(document.querySelectorAll('.container'));

const handleClick = (e) => {
    
    label.forEach(node => {
        node.classList.remove('selected');
    });

    e.currentTarget.classList.add('selected');
}

label.forEach(node => {
    node.addEventListener('click', handleClick)
});

// Countdown timer
var startBtn  = document.querySelector('.play');
var startCountdown = document.querySelector('.countdown');

startBtn.addEventListener('click', handleStartBtnClick);

function handleStartBtnClick() {

    var activeElement;

    startBtn.classList.add('color');
    
    startBtn.classList.add('hide');
    stopBtn.classList.add('show');
    
    for(var activity in appState) {

        if(appState[activity].active === true) {
            activeElement = activity;
        }
     }
 
    var intervalObj = setInterval(handleInterval, 1000);

    function handleInterval() {
    
        if (durationHolder.min == 0 && durationHolder.sec == 0) {
            clearInterval(intervalObj);
            playAlarm();
        
        } else {
            countDown(activeElement);
            showDuration();
        }
    }
}

function countDown(el) {

    durationHolder.sec = durationHolder.sec -1;

    if(durationHolder.sec < 0) {
        durationHolder.min = durationHolder.min -1;
        durationHolder.sec = 6;
    }

    if( (durationHolder.min === 0) && (durationHolder.sec === 0) ){
        var workDone = document.createElement("LI"); 
        var textnode = document.createTextNode(appState[el].customName);
        workDone.appendChild(textnode);

        document.getElementById('done-list').appendChild(workDone);
    }
}

function showDuration() {

    var min = durationHolder.min;
    var sec = durationHolder.sec;

    if(min < 10) {
        min = '0' + min;
    }

    if(sec < 10) {
        sec = '0' + sec;
    }

    startCountdown.textContent = min + ':' + sec;
    ipcRenderer.send('countdown', startCountdown.textContent);
}

// Timer is done
function playAlarm(text) {

    text = "Done!";
    startCountdown.textContent = text;
    setTimeout(resetClock, 1000);

    startBtn.classList.remove('color');
    stopBtn.classList.remove('show');
    startBtn.classList.remove('hide'); 

    ipcRenderer.send('counterDone', text);
}

// Reset the timer
function resetClock() {

    durationHolder.min = 0;
    durationHolder.sec = 0;
    startCountdown.textContent = '00:00';
}

// Stop timer 
var stopBtn = document.querySelector('.stop'); 

stopBtn.addEventListener('click', stopTimer);

function stopTimer() {

    startBtn.classList.remove('hide');
    stopBtn.classList.remove('show'); 
    startBtn.classList.remove('color');

    durationHolder.min = 0;
    durationHolder.sec = 0;
}
