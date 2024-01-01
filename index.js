
let teamName = "";
let viewOption = 'timer';


let audioComplete = new Audio("./sounds/complete.mp3");
let audioFinish = new Audio("./sounds/finish.mp3");
let audioOfftrack = new Audio("./sounds/offtrack.mp3");
let audioStart = new Audio("./sounds/start.mp3");
function stopAudio(){
  audioComplete.pause();
  audioComplete.currentTime=0;
  audioFinish.pause();
  audioFinish.currentTime=0;
  audioOfftrack.pause();
  audioOfftrack.currentTime=0;
  audioStart.pause();
  audioStart.currentTime=0;
}



let recordData;
if (localStorage.getItem('recordData')) {
  recordData = JSON.parse(localStorage.getItem('recordData'))
} else {
  recordData = [];
}


function changeEffectYellow(element) {
  element.classList.remove('change-effect-yellow');
  
  // DOM 업데이트를 위한 짧은 지연 후 클래스 다시 추가
  setTimeout(() => {
    element.classList.add('change-effect-yellow');
  }, 10); // 10밀리초 지연
}

function changeEffectGray(element) {
  element.classList.remove('change-effect-gray');
  
  // DOM 업데이트를 위한 짧은 지연 후 클래스 다시 추가
  setTimeout(() => {
    element.classList.add('change-effect-gray');
  }, 10); // 10밀리초 지연
}



///////////////////////////// setting /////////////////////////////
let initialRemainingTime = JSON.parse(localStorage.getItem("initialRemainingTime")) || 10;
let offtrackPenalty = JSON.parse(localStorage.getItem("offtrackPenalty") || 2);
let totalLabs = JSON.parse(localStorage.getItem("totalLabs")) || 1;
let autoStartNextLap = localStorage.getItem("autoStartNextLap") || 'on';
let startLineDetection = localStorage.getItem("startLineDetection") || 'off';
let minimumCompleteInterval = JSON.parse(localStorage.getItem("minimumCompleteInterval")) || 3;

function displayAndSaveSettings() {
  document.querySelector('#setting-list li:nth-child(1) span').textContent = initialRemainingTime;
  localStorage.setItem("initialRemainingTime", JSON.stringify(initialRemainingTime));
  document.querySelector('#setting-list li:nth-child(2) span').textContent = offtrackPenalty;
  localStorage.setItem("offtrackPenalty", JSON.stringify(offtrackPenalty));
  document.querySelector('#setting-list li:nth-child(3) span').textContent = totalLabs;
  localStorage.setItem("totalLabs", JSON.stringify(totalLabs));
  // document.querySelector('#setting-list li:nth-child(4) span').textContent = ;
  // 
  document.querySelector('#setting-list li:nth-child(5) span').textContent = autoStartNextLap;
  localStorage.setItem("autoStartNextLap", autoStartNextLap);
  document.querySelector('#setting-list li:nth-child(6) span').textContent = startLineDetection;
  localStorage.setItem("startLineDetection", startLineDetection);
  // document.querySelector('#setting-list li:nth-child(7) span').textContent = minimumCompleteInterval;
  localStorage.setItem("minimumCompleteInterval", JSON.stringify(minimumCompleteInterval));
}

displayAndSaveSettings();

let initialRemainingTimeElement = document.getElementById('initialRemainingTime')
initialRemainingTimeElement.value = initialRemainingTime
initialRemainingTimeElement.addEventListener('change', (e) => {
  initialRemainingTime = parseInt(e.target.value);
  displayAndSaveSettings();
});

let offtrackPenaltyElement = document.getElementById('offtrackPenalty')
offtrackPenaltyElement.value = offtrackPenalty
offtrackPenaltyElement.addEventListener('change', (e) => {
  offtrackPenalty = parseInt(e.target.value);
  displayAndSaveSettings();
});

let totalLabsElement = document.getElementById('totalLabs');
totalLabsElement.value = totalLabs
totalLabsElement.addEventListener('change', (e) => {
  totalLabs = parseInt(e.target.value);
  displayAndSaveSettings();
});

// let cameraListElement = document.getElementById('cameraList');
// cameraListElement.value = ??
// cameraListElement.addEventListener('change', (e) => {
//   webCamSelected = parseInt(e.target.value);
//   displayAndSaveSettings();
// });

let autoStartNextLapElement = document.getElementById('auto-start-next-lap')
autoStartNextLapElement.value = autoStartNextLap
autoStartNextLapElement.addEventListener('change', (e) => {
  autoStartNextLap = e.target.value;
  displayAndSaveSettings();
});

let startLineDetectionElement = document.getElementById('start-line-detection');
startLineDetectionElement.value = startLineDetection;
startLineDetectionElement.addEventListener('change', (e) => {
  startLineDetection = e.target.value;
  displayAndSaveSettings();
});

let minimumCompleteIntervalElement = document.getElementById('minimum-complete-interval')
minimumCompleteIntervalElement.value = minimumCompleteInterval
minimumCompleteIntervalElement.addEventListener('change', (e) => {
  minimumCompleteInterval = parseInt(e.target.value);
  displayAndSaveSettings();
});

// 첫 화면에 세팅 띄우기
let openSettingBtnElement = document.getElementById("openModalButton");
openSettingBtnElement.click();


// setting 모달창 닫힌 후에 엔터 누르면 켜지는 현상 제거
$(document).on('keypress', function(e) {
  if (e.which == 13) {
      e.preventDefault();
  }
});

// reset
let resetBtnElement = document.getElementById("reset-data-btn");
resetBtnElement.addEventListener('click', function(){
  // localStorage에서 모든 데이터 삭제
  localStorage.clear();
  
  // 현재 페이지 새로 고침
  window.location.reload();
})

// const minutesFinish = 15;
// const minutesTimeoutOver = 5;

// const myModal = document.getElementById('myModal')
// const myInput = document.getElementById('myInput')
// myModal.addEventListener('shown.bs.modal', () => {
//   myInput.focus()
// })


////////////// time function ////////////
function formatMilliseconds(milliseconds) {
  // 밀리초에서 초를 계산
  let seconds = Math.floor(milliseconds / 1000);
  let spareMilliseconds = milliseconds % 1000; // 남은 밀리초

  // 초에서 분을 계산
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60; // 남은 초

  // 분, 초, 밀리초를 문자열로 포맷팅 (필요한 경우 앞에 0 추가)
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');
  spareMilliseconds = spareMilliseconds.toString().padStart(3, '0');

  return `${minutes}:${seconds}.${spareMilliseconds}`;
}

function parseTimeToMilliseconds(timeString) {
  const parts = timeString.split(/[:.]/); // 콜론과 점을 기준으로 문자열을 분리
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  const milliseconds = parseInt(parts[2], 10);

  return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
}

function toLocalISOString(date) {
  var offset = date.getTimezoneOffset() * 60000; // 시간대 오프셋을 밀리초로 변환
  var localISOTime = (new Date(date - offset)).toISOString().slice(0, -1);
  return localISOTime;
}



////////////////////////// team list ////////////////////////

const addTeamBtnElement = document.getElementById('addTeamBtn');
const teamNameInputElement = document.getElementById('teamNameInput');
const teamListElement = document.getElementById('teamList');


/// Initialize teamNameList
let teamNameList;
if (localStorage.getItem("teamNameList")) {
  teamNameList = JSON.parse(localStorage.getItem("teamNameList"));
} else {
  teamNameList = [];
  localStorage.setItem("teamNameList", JSON.stringify(teamNameList));
}
// 기존에 있던 팀
teamNameList.forEach(function (teamName) {
  const listItem = document.createElement('li');
  listItem.textContent = teamName;
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = function () {
    teamNameList = teamNameList.filter(item => item !== teamName);
    localStorage.setItem("teamNameList", JSON.stringify(teamNameList));
    listItem.remove();
  };
  listItem.appendChild(deleteBtn);
  teamListElement.appendChild(listItem);
});


//// add team
function addTeam() {
  const newTeamName = teamNameInputElement.value.trim();
  if (newTeamName) {

    if (!teamNameList.includes(newTeamName)) {
      const listItem = document.createElement('li');
      listItem.textContent = newTeamName;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = function () {
        teamNameList = teamNameList.filter(item => item !== newTeamName);
        localStorage.setItem("teamNameList", JSON.stringify(teamNameList));
        listItem.remove();
      };
      listItem.appendChild(deleteBtn);
      teamListElement.appendChild(listItem);
      teamNameList.push(newTeamName);
      localStorage.setItem("teamNameList", JSON.stringify(teamNameList));
      addTeamBtnElement.value = ''; // 입력 필드 초기화
    } else {
      alert('This team name already exists.');
    }
  }
}

// 'Add Team' 버튼에 이벤트 리스너 추가
addTeamBtnElement.addEventListener('click', addTeam);
addTeamBtnElement.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTeam();
  }
});



//////////// ranking list eventlistner ///////////////
document.querySelector('.ranking').addEventListener('click', function (event) {
  // 클릭된 요소가 .ranking-item 내부의 버튼인지 확인
  let targetItem = event.target.closest('.ranking-item button');
  if (!targetItem) return; // .ranking-item 내부의 버튼이 아니라면 함수 종료
  prevRecordValueElement.textContent = ""
  // 이미 'btn-warning' 클래스가 있는지 확인
  if (targetItem.classList.contains('btn-warning')) {
    // 이미 선택된 경우, 'btn-warning' 클래스를 제거하고 'btn-dark' 클래스 추가
    targetItem.classList.remove('btn-warning');
    targetItem.classList.add('btn-dark');
    teamName = "";
  } else {
    // 모든 버튼의 'btn-warning' 클래스 제거하고 'btn-dark' 클래스 추가
    document.querySelectorAll('.ranking-item button').forEach(btn => {
      btn.classList.remove('btn-warning');
      btn.classList.add('btn-dark');
    });

    // 현재 클릭된 버튼에만 'btn-warning' 클래스 추가
    targetItem.classList.add('btn-warning');
    targetItem.classList.remove('btn-dark');

    // ranking-team 클래스를 가진 요소 찾기
    const teamElement = targetItem.querySelector('.ranking-team');
    teamName = teamElement.textContent.trim();
  };
  console.log(`teamName: ${teamName}`);
});




//////////////////// main view ///////////////////////////
// 각 윈도우 요소를 가져옵니다.
const timerWindow = document.querySelector('.timer-window');
const webcamWindow = document.querySelector('.webcam-window');
const logsWindow = document.querySelector('.logs-window');

// 라디오 버튼에 대한 이벤트 리스너 설정
document.querySelectorAll('.main-nav-view-selection input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function () {
    // 각 윈도우의 표시 상태를 조절합니다.
    if (this.value === 'timer') {
      timerWindow.style.display = 'flex';
      webcamWindow.style.display = 'none';
      // logsWindow.style.display = 'none';
    } else if (this.value === 'webcam') {
      timerWindow.style.display = 'none';
      webcamWindow.style.display = 'flex';
      // logsWindow.style.display = 'none';
    } else if (this.value === 'logs') {
      timerWindow.style.display = 'none';
      webcamWindow.style.display = 'none';
      // logsWindow.style.display = 'flex';
    }
  });
  radio.addEventListener('change', function () {
    if (this.checked) {
      viewOption = this.value
      console.log("Selected View: " + viewOption);
    }
  });
});

// view selection
document.querySelectorAll('.main-nav-view-selection input[type="radio"]').forEach(radio => {

});


//////////////////////////////////////////////
let prevRecords = {};
let teamTrials = {};
let finalRecords = [];
let finalRecords2 = {};
let teamRecords = {};

function currentRecordCalcuation(originalRecord, offtrack){
  return originalRecord + offtrack * offtrackPenalty * 1000 ;
}

function goAddTeams(){
  openSettingBtnElement.click();
  document.getElementById("pills-profile-tab").click();
}

function updateRankingList() {
  // 각 팀의 최고 기록 및 시도 횟수 계산
  let tempTeamRecords = {};
  let tempTeamTrials = {}; // 임시 시도 횟수 저장용
  recordData.forEach(record => {
    let totalRecord = currentRecordCalcuation(record.originalRecord, record.offtrack);
    // totalRecord가 더 낮을 경우에만 업데이트
    if (!tempTeamRecords[record.teamName] || tempTeamRecords[record.teamName] > totalRecord) {
      tempTeamRecords[record.teamName] = totalRecord;
    }
    // 시도 횟수 계산
    if (tempTeamTrials[record.teamName]) {
      tempTeamTrials[record.teamName] += 1;
    } else {
      tempTeamTrials[record.teamName] = 1;
    }
  });
  // teamRecords, teamTrials 업데이트
  teamRecords = tempTeamRecords;
  teamTrials = tempTeamTrials;

  finalRecords = teamNameList.map(targetTeamName => {
    if (teamRecords[targetTeamName]) {
      return {
        teamName: targetTeamName,
        bestRecord: formatMilliseconds(teamRecords[targetTeamName])
      }
    } else {
      return {
        teamName: targetTeamName,
        bestRecord: 'null'
      }
    };
  });

  let tempFinalRecords2 = {}
  Object.keys(teamRecords).forEach(function (targetTeamName) {
    tempFinalRecords2[targetTeamName] = formatMilliseconds(teamRecords[targetTeamName]);
  });
  finalRecords2 = tempFinalRecords2;

  // 기록이 짧은 순으로 정렬
  finalRecords.sort((a, b) => {
    if (a.bestRecord === 'null') return 1;
    if (b.bestRecord === 'null') return -1;
    return a.bestRecord.localeCompare(b.bestRecord);
  });

  // HTML에 순위 삽입
  const rankingContainer = document.querySelector('.ranking');
  rankingContainer.innerHTML = ''; // 기존 내용을 초기화
  if (finalRecords.length > 0){
    finalRecords.forEach((record, index) => {
      const rankingItem = document.createElement('div');
      rankingItem.className = 'ranking-item';
  
      const buttonType = record.teamName === teamName ? 'btn-warning' : 'btn-dark';
      rankingItem.innerHTML = `
        <button type="button" class="btn ${buttonType}">
          <div class="ranking-medal">${index + 1}</div>
          <div class="ranking-team">${record.teamName}</div>
          <div class="ranking-record">${record.bestRecord}</div>
        </button>
      `;
      // 변경 감지
      if (prevRecords[record.teamName] !== record.bestRecord) {
        changeEffectYellow(rankingItem.querySelector('.btn'));
      }
      rankingContainer.appendChild(rankingItem);
  
      // 현재 기록 저장
      prevRecords[record.teamName] = record.bestRecord;
    });
  } else{
    rankingContainer.innerHTML=`
    <div style="text-align:center; font-size: 2vw;">
      No Teams
    </div>
    <div style="text-align:center; font-size:1vw;"> 
      (add Teams) 
      <button class="btn" style="color:yellow;" onclick="goAddTeams();">
        Setting ⚙️ > Teams
      </button> 
    </div>
    `  
  }

};

updateRankingList();
setInterval(updateRankingList, 1000);



/////////// control /////////////
let readyControlElement = document.getElementById('ready-control');
let drivingControlElement = document.getElementById('driving-control');
let offtrackControlElement = document.getElementById('offtrack-control');

let startBtnElement = document.getElementById('start-btn');
let stopBtnDrivingElement = document.getElementById('stop-btn-driving');
let offtrackBtnElement = document.getElementById('offtrack-btn');
let completeBtnElement = document.getElementById('complete-btn');
let stopBtnOfftrackElement = document.getElementById('stop-btn-offtrack');
let restartBtnElement = document.getElementById('restart-btn');

document.querySelector('#setting-list li:nth-child(1) span')


let status_ = 'ready';
let originalRecord = 0;
let currentLabs = 0;
let offtrack = 0;
let labStartTime = null;
let lastCompleteTime = null;

function startBtnFunction() {
  if (remainingTime > 0){
    status_ = "driving";
    originalRecord = 0;
    currentLabs = 1;
    offtrack = 0;
    labStartTime = new Date();
    lastCompleteTime = labStartTime;
    readyControlElement.style.display = "none";
    drivingControlElement.style.display = "flex";
    offtrackControlElement.style.display = "none";
    stopAudio();
    audioComplete.play();
    changeEffectGray(currentRecordValueElement);
    changeEffectGray(currentRecordValueElement2);
    changeEffectGray(statusValueElement);
  } else {
    changeEffectGray(remainingTimeValueElement); 
  }

}
startBtnElement.addEventListener('click', startBtnFunction);

function stopBtnFunction() {
  status_ = "ready";
  originalRecord = 0;
  currentLabs = 0;
  offtrack = 0;
  labStartTime = null;
  lastCompleteTime = null;
  readyControlElement.style.display = "flex";
  drivingControlElement.style.display = "none";
  offtrackControlElement.style.display = "none";
  changeEffectGray(statusValueElement);
}
stopBtnDrivingElement.addEventListener('click', stopBtnFunction);
stopBtnOfftrackElement.addEventListener('click', stopBtnFunction);

function offtrackBtnFunction() {
  status_ = "offtrack";
  offtrack += 1;
  readyControlElement.style.display = "none";
  drivingControlElement.style.display = "none";
  offtrackControlElement.style.display = "flex";
  audioOfftrack.play();
  changeEffectGray(offtrackValueElement);
  changeEffectGray(statusValueElement);
}
offtrackBtnElement.addEventListener('click', offtrackBtnFunction);

function recordDataSetItem(){
  while (true) {
    try {
      localStorage.setItem('recordData', JSON.stringify(recordData));
      break;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        recordData = recordData.slice(1);
        
      } else {
        console.error(e);
        break;
      }
    }
  }
}

function completeBtnFunction() {
  let tempCompleteTime = new Date();
  let completeInterval = tempCompleteTime - lastCompleteTime;
  let minimumCompleteIntervalMilliSec = minimumCompleteInterval * 1000
  if (completeInterval > minimumCompleteIntervalMilliSec) {
    if (totalLabs === currentLabs) {
      // 기록 업데이트
      let newRecord = {
        teamName: teamName,
        labStartTime: toLocalISOString(labStartTime),
        offtrack: offtrack,
        originalRecord: originalRecord
      }
      recordData.push(newRecord);
      recordDataSetItem();
      insertLogItem(newRecord);
      prevRecordValueElement.textContent = `(prev) ${formatMilliseconds(currentRecordCalcuation(newRecord.originalRecord, newRecord.offtrack))}`; 
      changeEffectGray(prevRecordValueElement);
      stopAudio();
      audioComplete.play();
      stopBtnFunction();
      if (autoStartNextLap === 'on') {
        startBtnFunction();
      }
    } else {
      currentLabs += 1;
      lastCompleteTime = tempCompleteTime;
      stopAudio();
      audioStart.play();
      changeEffectGray(labsValueElement);
    }

  }
}
completeBtnElement.addEventListener('click', completeBtnFunction);

function restartBtnFunction() {
  status_ = "driving";
  readyControlElement.style.display = "none";
  drivingControlElement.style.display = "flex";
  offtrackControlElement.style.display = "none";
  stopAudio();
  audioStart.play();
  changeEffectGray(statusValueElement);
}
restartBtnElement.addEventListener('click', restartBtnFunction);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    if (status_ === 'ready') {
      startBtnFunction();
    } else if (status_ === 'driving') {
      completeBtnFunction();
    } else if (status_ === 'offtrack') {
      restartBtnFunction();
    }
  } else if (event.key === ' ') {
    if (status_ === 'ready') {

    } else if (status_ === 'driving') {
      offtrackBtnFunction();
    } else if (status_ === 'offtrack') {

    }
  } else if (event.key === 'Escape') {
    if (status_ === 'ready') {

    } else if (status_ === 'driving') {
      stopBtnFunction();
    } else if (status_ === 'offtrack') {
      stopBtnFunction();
    }
  }
});

/////////////// reamining Time /////////////
let remainingTime;
if (localStorage.getItem('remainingTime')){
  remainingTime = JSON.parse(localStorage.getItem('remainingTime'))
} else {
  remainingTime = initialRemainingTime *60 * 1000
}
let remainingTimeFormatted = formatMilliseconds(remainingTime);
let remainingTimeCountDown = false;

//  remaining time button
let remainingTimePausePlayBtn = document.getElementById('remainingPlayPauseButton')
let remainingTimePausePlayBtnIcon = remainingTimePausePlayBtn.querySelector('i');

function remainingTimePauseFunction(){
  remainingTimePausePlayBtnIcon.classList.remove('fa-pause');
  remainingTimePausePlayBtnIcon.classList.add('fa-play');
  remainingTimeCountDown = false;
}

function remainingTimePlayFunction(){
  if (remainingTime > 0){
    remainingTimePausePlayBtnIcon.classList.remove('fa-play');
    remainingTimePausePlayBtnIcon.classList.add('fa-pause');
    remainingTimeCountDown = true;
  } else{
    remainingTimePauseFunction();
  }
}

remainingTimePausePlayBtn.addEventListener('click', function () {
  if (remainingTimePausePlayBtnIcon.classList.contains('fa-play')) {
    remainingTimePlayFunction();

  } else {
    remainingTimePauseFunction();
  }
});

let remainingRefreshBtn = document.getElementById('remainingRefreshButton')
remainingRefreshBtn.addEventListener('click', function(){
  remainingTime = initialRemainingTime *60 * 1000;
})


/////////// fast update ///////////
let fastUpdateTime = 7; 
let teamNameValueElement = document.getElementById('team-name-value');
let bestRecordValueElement = document.getElementById('best-record-value');
let currentRecordValueElement = document.getElementById('current-record-value');
let prevRecordValueElement = document.getElementById('prev-record-value');
let currentRecordValueElement2 = document.getElementById('current-record-value2');
let trialsValueElement = document.getElementById('trials-value');
let labsValueElement = document.getElementById('labs-value');
let offtrackValueElement = document.getElementById('offtrack-value');
let statusValueElement = document.getElementById('status-value');
let remainingTimeValueElement = document.getElementById('ramaining-time-value');
let currentTimeValueElement = document.getElementById('current-time-value');

function fastUpdate() {
  if (status_ === "driving") {
    originalRecord += fastUpdateTime;
  };
  if (remainingTimeCountDown){
    remainingTime -= fastUpdateTime;
    remainingTime = Math.max(0, remainingTime);
    localStorage.setItem('remainingTime', JSON.stringify(remainingTime));
    if (remainingTime === 0){
      remainingTimePauseFunction();
      stopAudio();
      audioFinish.play();
      if (status_ === 'driving'){
        stopBtnFunction();
      }
    }
  }
  teamNameValueElement.textContent = teamName;
  
  if (bestRecordValueElement.textContent !== (finalRecords2[teamName] || 'null')){
    bestRecordValueElement.textContent = (finalRecords2[teamName] || 'null');
    changeEffectYellow(bestRecordValueElement);
  }
  currentRecordValueElement.textContent = formatMilliseconds(currentRecordCalcuation(originalRecord, offtrack));
  currentRecordValueElement2.textContent = formatMilliseconds(currentRecordCalcuation(originalRecord, offtrack));
  trialsValueElement.textContent = teamTrials[teamName] || 0;
  labsValueElement.textContent = `${currentLabs}/${totalLabs}`;
  offtrackValueElement.textContent = offtrack;
  statusValueElement.textContent = status_;
  remainingTimeValueElement.textContent = formatMilliseconds(remainingTime);
  currentTimeValueElement.textContent = toLocalISOString(new Date());



}

let fastUpdateInterval = setInterval(fastUpdate, fastUpdateTime);



//////////////////////// logs //////////////////////
const logsList = document.querySelector('.logs-list');
function insertLogItem(item){
  const logItem = document.createElement('div');
  logItem.className = 'log-item';

  const formattedOriginalRecord = formatMilliseconds(item.originalRecord);
  const formattedRecord = formatMilliseconds(currentRecordCalcuation(item.originalRecord, item.offtrack));

  logItem.innerHTML = `
    <hr>
    <div class="log-item-row log-item-team">
      <div>[team]</div>
      <div>${item.teamName}</div>
    </div>
    <div class="log-item-row log-item-record">
      <div>[record]</div>
      <div>${formattedRecord}</div>
    </div>
    <div class="log-item-row log-item-time">
      <div>[time]</div>
      <div>${item.labStartTime}</div>
    </div>
    <div class="log-item-row log-item-origin">
      <div>[origin]</div>
      <div>${formattedOriginalRecord}</div>
    </div>
    <div class="log-item-row log-item-offtrack">
      <div>[offtrack]</div>
      <div>${item.offtrack}</div>
    </div>
    <button class="log-item-delete" style="display:none;">
      <i class="fas fa-trash"></i> 
    </button>
  `;

  // 삭제 기능 추가
  const deleteButton = logItem.querySelector('.log-item-delete');
  deleteButton.addEventListener('click', () => {
    // DOM에서 삭제
    logsList.removeChild(logItem);
    // recordData 배열에서 삭제
    const dataIndex = recordData.findIndex(dataItem =>
      dataItem.teamName === item.teamName && dataItem.labStartTime === item.labStartTime
    );
    if (dataIndex !== -1) {
      recordData.splice(dataIndex, 1);
    }
  });

  // logsList의 첫 번째 자식 앞에 새 항목 추가
  changeEffectGray(logItem)
  if (logsList.firstChild) {
    logsList.insertBefore(logItem, logsList.firstChild);
  } else {
    logsList.appendChild(logItem);
  }
}
recordData.forEach(insertLogItem);

// delete btn
let deleteBtnElement = document.getElementById("delete-checkbox");
deleteBtnElement.addEventListener('change', function(){
  var itemDeleteBtnElements = document.getElementsByClassName("log-item-delete");
  if (this.checked){
    for (var i=0; i < itemDeleteBtnElements.length; i++){
      itemDeleteBtnElements[i].style.display = "block";
    }
  } else {
    for (var i=0; i < itemDeleteBtnElements.length; i++){
      itemDeleteBtnElements[i].style.display = "none";
    }
  }
}); 

// download logs csv
function downloadLogsAsCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Team,Record,Time,Origin,Offtrack\r\n"; // CSV 헤더

  recordData.forEach(item => {
    // 포맷팅 함수를 사용하여 데이터 형식을 맞춤
    const formattedOriginalRecord = formatMilliseconds(item.originalRecord);
    const formattedRecord = formatMilliseconds(currentRecordCalcuation(item.originalRecord, item.offtrack));

    // CSV 행 추가
    const row = `${item.teamName},t${formattedRecord},${item.labStartTime},t${formattedOriginalRecord},${item.offtrack}`;
    csvContent += row + "\r\n";
  });

  // CSV 파일 다운로드
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "logs.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.querySelector('#download-logs-button').addEventListener('click', downloadLogsAsCSV);


