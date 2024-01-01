
let videoDevices = [];
const cameraList = document.getElementById('cameraList');
const resolutionList = document.getElementById('resolutionList');
const webcamVideo = document.getElementById('webcamVideo');
const viewOptions = document.querySelectorAll('.main-nav-view-selection input[type="radio"]');


// 웹캠 접근 권한 요청 및 카메라 목록 가져오기
function getCameraList() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      stream.getTracks().forEach(track => track.stop()); // 스트림 사용 중지
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(devices => {
      videoDevices = devices.filter(device => device.kind === 'videoinput');
      cameraList.innerHTML = ''; // 기존 목록 초기화
      videoDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${index + 1}`;
        cameraList.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Camera access error:', error);
    });
}

// 웹캠 시작 함수
function startCamera(deviceId, resolution) {
  resolution = resolution || '1280x720'; // 기본 해상도 설정
  const [width, height] = resolution.split('x').map(Number);
  const constraints = {
    video: {
      deviceId: { exact: deviceId },
      width: { exact: width },
      height: { exact: height }
    }
  };
  // console.log(constraints);
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      webcamVideo.srcObject = stream;
    })
    .catch(error => {
      console.error('Camera start error:', error);
      alert('Selected resolution not supported by this camera. Please choose another resolution.');
      // 선택한 해상도가 지원되지 않음을 사용자에게 알림
    });
}

function webCamSetting() {
  // 초기 카메라 목록 가져오기
  getCameraList();

  // 라디오 버튼 변경 감지 및 처리
  viewOptions.forEach(option => {
    option.addEventListener('change', function () {
      if (this.value === 'webcam' && this.checked) {
        // cameraList.hidden = false;
        // resolutionList.hidden = false;
        if (videoDevices.length > 0) {
          startCamera(cameraList.value, resolutionList.value);
          // webcamVideo.hidden = false;
        }
      } else {
        // cameraList.hidden = true;
        // resolutionList.hidden = true;
        // webcamVideo.hidden = true;
      }
    });
  });

  // 카메라 및 해상도 변경 감지
  cameraList.addEventListener('change', () => startCamera(cameraList.value, resolutionList.value));
  resolutionList.addEventListener('change', () => startCamera(cameraList.value, resolutionList.value));


};

document.addEventListener('DOMContentLoaded', webCamSetting);







////////////////////////// webcam canvas //////////////////////////

let startX, startY, endX, endY;
let isStartLineEditing = false;
// const webcamVideo = document.getElementById('webcamVideo');
const canvas = document.getElementById('overlayCanvas');
const ctx = canvas.getContext('2d');
const startLineEditBtn = document.getElementById('startLineEditBtn');

function setCanvasSize() {
    canvas.width = webcamVideo.offsetWidth;
    canvas.height = webcamVideo.offsetHeight;
}

webcamVideo.addEventListener('loadedmetadata', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
webcamVideo.insertAdjacentElement('afterend', canvas);

startLineEditBtn.addEventListener('click', function() {
    isStartLineEditing = !isStartLineEditing;
    updateButtonLabel();

    if (isStartLineEditing) {
        canvas.addEventListener('mousedown', handleMouseDown);
    } else {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
    }
});

function updateButtonLabel() {
    startLineEditBtn.textContent = isStartLineEditing ? '수정 중...' : 'Start-Line Edit';
}

function handleMouseDown(e) {
    if (!isStartLineEditing) return;

    startX = e.offsetX;
    startY = e.offsetY;
    canvas.addEventListener('mouseup', handleMouseUp);
}

function handleMouseUp(e) {
    if (!isStartLineEditing) return;

    endX = e.offsetX;
    endY = e.offsetY;
    drawLine(startX, startY, endX, endY);

    isStartLineEditing = false;
    updateButtonLabel();
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
}

function drawLine(x1, y1, x2, y2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    drawCircle(x1, y1);
    drawCircle(x2, y2);
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
}

