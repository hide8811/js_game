const modeChangeBtn = document.getElementById('mode-change-btn');
const modeStopwatchBtn = document.getElementById('mode-stopwatch');
const modeGameBtn = document.getElementById('mode-game');
const targetChangeArea = document.getElementById('target');
const targetChangeBtn = document.getElementById('target-change-btn');
const targetTenBtn = document.getElementById('target-ten');
const targetRandomBtn = document.getElementById('target-random');
const targetTimeDisplay = document.getElementById('target-time');
const timeDiffArea = document.getElementById('time-diff');
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const restartBtn = document.getElementById('restart');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const scoreArea = document.getElementById('score');
const recordTitle = document.getElementById('record-title');
const recordArea = document.getElementById('record');
const downloadCsvBtn = document.getElementById('download-csv');

let intervalTimer;
let nowTime;
let signDiff = { sign: '+', time: '0' };
let lastTime = 0;
let status = 'zero';
let mode = 'stopwatch';
let targetStatus = 'ten';
let target = 10000;
let scores = []; // { target: target, time: nowTime, diff: signDiff }
let record = [];

// 参考: https://developer.mozilla.org/ja/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable() {
  try {
    const x = '__storage_test__';
    localStorage.setItem(x, x);
    localStorage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22
      // Firefox
      || e.code === 1014
      // test name field too, because code might not be present
      // everything except Firefox
      || e.name === 'QuotaExceededError'
      // Firefox
      || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      // acknowledge QuotaExceededError only if there's something already stored
      && (localStorage && localStorage.length !== 0);
  }
}

const localStorageAvailable = storageAvailable();

const createTimeHash = (num) => {
  let time = num;

  const milliseconds = time % 1000;
  const millisecondsString = '0'.repeat(3 - String(milliseconds).length) + milliseconds;

  time = Math.floor(time / 1000);

  const second = time % 60;
  const secondString = '0'.repeat(2 - String(second).length) + second;

  time = Math.floor(time / 60);

  const minutes = time % 60;
  const minutesString = '0'.repeat(2 - String(minutes).length) + minutes;

  const hour = Math.floor(time / 60);
  const hourString = '0'.repeat(2 - String(hour).length) + hour;

  return {
    hour: hourString,
    minutes: minutesString,
    second: secondString,
    milliseconds: millisecondsString,
  };
};

const changeToStartBtn = () => {
  stopBtn.classList.add('hide');
  restartBtn.classList.add('hide');
  startBtn.classList.remove('hide');
};

const changeToStopBtn = () => {
  startBtn.classList.add('hide');
  restartBtn.classList.add('hide');
  stopBtn.classList.remove('hide');
};

const changeToRestartBtn = () => {
  stopBtn.classList.add('hide');
  restartBtn.classList.remove('hide');
};

const changeToResetBtn = () => {
  lapBtn.classList.add('hide');
  resetBtn.classList.remove('hide');
};

const changeToLapBtn = () => {
  resetBtn.classList.add('hide');
  lapBtn.classList.remove('hide');
};

const timeDisplay = (startTime) => {
  const currentTime = new Date();
  const elapsedTime = currentTime - startTime;

  nowTime = elapsedTime;

  const time = createTimeHash(elapsedTime);

  display.innerHTML = `${time.hour}:${time.minutes}:${time.second}.<span class="milliseconds">${time.milliseconds}</span>`;
};

const gameTimeDisplay = (startTime) => {
  const currentTime = new Date();
  let time = currentTime - startTime;

  nowTime = time;

  const milliseconds = time % 1000;
  const millisecondsString = '0'.repeat(3 - String(milliseconds).length) + milliseconds;

  time = Math.floor(time / 1000);

  const second = time % 60;
  const secondString = '0'.repeat(2 - String(second).length) + second;

  display.innerHTML = `${secondString}.<span class="milliseconds">${millisecondsString}</span>`;
};

const getTargetTime = () => {
  const times = [10000, 9500, 9000, 8500, 8000, 7500, 7000, 6500, 6000, 5500, 5000];
  const i = Math.floor(Math.random() * 11);

  return times[i];
};

const diffTime = () => {
  let sign;
  let diff;

  if (nowTime === target) {
    sign = '±';
    diff = 0;
  } else if (nowTime > target) {
    sign = '+';
    diff = nowTime - target;
  } else {
    sign = '-';
    diff = target - nowTime;
  }

  signDiff = { sign, time: diff };

  return [sign, diff];
};

const addScore = () => {
  const li = document.createElement('li');
  li.className = 'score-item';
  const targetTime = createTimeHash(target);
  const time = createTimeHash(nowTime);
  const timeDiff = createTimeHash(signDiff.time);

  li.innerHTML = `<span class="score-target">${targetTime.second}.${targetTime.milliseconds}</span><span class="score-time">${time.second}.${time.milliseconds}</span><span class="score-diff">${signDiff.sign}${timeDiff.second}.${timeDiff.milliseconds}</span>`;

  scoreArea.insertBefore(li, scoreArea.firstChild);

  if (localStorageAvailable) {
    scores.push({ target, time: nowTime, diff: signDiff });

    if (scores.length > 100) {
      scores.shift();
      scoreArea.lastChild.remove();
    }

    localStorage.setItem('stopwatchGameScore', JSON.stringify(scores));
  }
};

const lapTimer = () => {
  if (mode === 'stopwatch' && status === 'move') {
    const lap = nowTime - lastTime;
    const lapTime = createTimeHash(lap);
    const splitTime = createTimeHash(nowTime);

    const lapTimeStr = `${lapTime.hour}:${lapTime.minutes}:${lapTime.second}.${lapTime.milliseconds}`;
    const splitTimeStr = `${splitTime.hour}:${splitTime.minutes}:${splitTime.second}.${splitTime.milliseconds}`;

    const li = document.createElement('li');
    li.className = 'record-item';
    li.innerHTML = `<span class="lap-record">${lapTimeStr}</span><span class="split-record">${splitTimeStr}</span>`;

    recordArea.appendChild(li);

    record.push([lapTimeStr, splitTimeStr]);
    lastTime = nowTime;
  }
};

const startTimer = () => {
  if (status === 'zero') {
    const startTime = new Date();

    if (mode === 'stopwatch') {
      intervalTimer = setInterval(timeDisplay, 1, startTime);
      changeToLapBtn();
    } else {
      timeDiffArea.innerHTML = '';

      intervalTimer = setInterval(gameTimeDisplay, 1, startTime);

      if (targetStatus === 'ten') {
        target = 10000;
      } else {
        target = getTargetTime();
        const time = createTimeHash(target);
        targetTimeDisplay.innerHTML = `${time.second}.<span class="target-milliseconds">${time.milliseconds}</span>`;
      }

      display.style.transition = 'opacity 2.9s ease-out 1s';
      display.style.opacity = 0;
    }

    changeToStopBtn();

    status = 'move';
  }
};

const stopTimer = () => {
  if (status === 'move') {
    clearInterval(intervalTimer);

    if (mode === 'stopwatch') {
      if (record.length > 0) lapTimer();
      changeToRestartBtn();
      changeToResetBtn();
      status = 'stop';
    } else {
      const [sign, diff] = diffTime();
      const time = createTimeHash(diff);
      timeDiffArea.innerHTML = `${sign}${time.second}.<span class="diff-milliseconds">${time.milliseconds}</span>`;
      display.style.transition = '';
      display.style.opacity = 1;

      addScore();

      changeToStartBtn();
      status = 'zero';
    }
  }
};

const restartTimer = () => {
  if (status === 'stop') {
    const startTime = new Date();
    startTime.setMilliseconds(startTime.getMilliseconds() - nowTime);

    intervalTimer = setInterval(timeDisplay, 1, startTime);

    changeToStopBtn();
    changeToLapBtn();

    status = 'move';
  }
};

const resetTimer = () => {
  clearInterval(intervalTimer);
  changeToStartBtn();

  if (mode === 'stopwatch') {
    display.innerHTML = '00:00:00.<span class="milliseconds">000</span>';
    recordArea.innerHTML = '';
    record = [];
    lastTime = 0;
  } else {
    display.innerHTML = '00.<span class="milliseconds">000</span>';
    targetTimeDisplay.innerHTML = (targetStatus === 'ten') ? '10.<span class="target-milliseconds">000</span>' : '<span class="target-time-random">RANDOM</span>';
    timeDiffArea.innerHTML = '';
    display.style.transition = '';
    display.style.opacity = 1;
  }

  status = 'zero';
};

const changeStopwatchMode = () => {
  if (mode === 'game') {
    resetTimer();

    modeStopwatchBtn.classList.replace('off-color', 'on-color');
    modeGameBtn.classList.replace('on-color', 'off-color');
    modeChangeBtn.innerHTML = '<i class="fas fa-toggle-off"></i>';

    targetTimeDisplay.innerHTML = '';
    display.innerHTML = '00:00:00.<span class="milliseconds">000</span>';
    targetChangeArea.classList.add('invisible');
    scoreArea.classList.add('invisible');

    scoreArea.classList.add('hide');
    recordTitle.classList.remove('hide');
    recordArea.classList.remove('hide');

    mode = 'stopwatch';
  }
};

const changeGameMode = () => {
  if (mode === 'stopwatch') {
    resetTimer();

    modeStopwatchBtn.classList.replace('on-color', 'off-color');
    modeGameBtn.classList.replace('off-color', 'on-color');
    modeChangeBtn.innerHTML = '<i class="fas fa-toggle-on"></i>';

    display.innerHTML = '00.<span class="milliseconds">000</span>';
    targetTimeDisplay.innerHTML = (targetStatus === 'ten') ? '10.<span class="target-milliseconds">000</span>' : '<span class="target-time-random">RANDOM</span>';
    targetChangeArea.classList.remove('invisible');
    scoreArea.classList.remove('invisible');

    recordTitle.classList.add('hide');
    recordArea.classList.add('hide');
    scoreArea.classList.remove('hide');

    mode = 'game';
  }
};

const modeChange = () => {
  if (mode === 'stopwatch') {
    changeGameMode();
  } else {
    changeStopwatchMode();
  }
};

const changeTargetTen = () => {
  resetTimer();

  targetTenBtn.classList.replace('off-color', 'on-color');
  targetRandomBtn.classList.replace('on-color', 'off-color');
  targetChangeBtn.innerHTML = '<i class="fas fa-toggle-off"></i>';
  targetTimeDisplay.innerHTML = '10.<span class="target-milliseconds">000</span>';

  targetStatus = 'ten';
};

const changeTargetRandom = () => {
  resetTimer();

  targetTenBtn.classList.replace('on-color', 'off-color');
  targetRandomBtn.classList.replace('off-color', 'on-color');
  targetChangeBtn.innerHTML = '<i class="fas fa-toggle-on"></i>';
  targetTimeDisplay.innerHTML = '<span class="target-time-random">RANDOM</span>';

  targetStatus = 'random';
};

const targetChange = () => {
  if (targetStatus === 'ten') {
    changeTargetRandom();
  } else {
    changeTargetTen();
  }
};

const downloadCSV = () => {
  if (record.length > 0) {
    const fileName = 'stopwatch.csv';
    const header = ',Lap Time,Split Time\n';
    const data = header + record.map((r, i) => `${i + 1},${r.join(',')}`).join('\n');

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, data], { type: 'text/csv' });

    const download = document.createElement('a');
    const url = URL.createObjectURL(blob);
    download.href = url;
    download.download = fileName;
    download.click();

    URL.revokeObjectURL(url);
  }
};

modeChangeBtn.addEventListener('click', modeChange);
modeStopwatchBtn.addEventListener('click', changeStopwatchMode);
modeGameBtn.addEventListener('click', changeGameMode);
targetChangeBtn.addEventListener('click', targetChange);
targetTenBtn.addEventListener('click', changeTargetTen);
targetRandomBtn.addEventListener('click', changeTargetRandom);
startBtn.addEventListener('mousedown', startTimer);
stopBtn.addEventListener('mousedown', stopTimer);
restartBtn.addEventListener('mousedown', restartTimer);
resetBtn.addEventListener('mousedown', resetTimer);
lapBtn.addEventListener('mousedown', lapTimer);
downloadCsvBtn.addEventListener('click', downloadCSV);

if (localStorageAvailable) {
  const dataJson = localStorage.getItem('stopwatchGameScore');

  if (dataJson) {
    const dataArray = JSON.parse(dataJson);

    dataArray.forEach((data) => {
      const li = document.createElement('li');
      li.className = 'score-item';
      const targetTime = createTimeHash(data.target);
      const time = createTimeHash(data.time);
      const timeDiff = createTimeHash(data.diff.time);

      li.innerHTML = `<span class="score-target">${targetTime.second}.${targetTime.milliseconds}</span><span class="score-time">${time.second}.${time.milliseconds}</span><span class="score-diff">${data.diff.sign}${timeDiff.second}.${timeDiff.milliseconds}</span>`;

      scoreArea.insertBefore(li, scoreArea.firstChild);
    });
    scores = dataArray;
  }
}
