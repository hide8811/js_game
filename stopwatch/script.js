const modeChangeBtn = document.getElementById('mode-change-btn');
const modeStopwatchBtn = document.getElementById('mode-stopwatch');
const modeGameBtn = document.getElementById('mode-game');
const targetChangeArea = document.getElementById('target');
const targetChangeBtn = document.getElementById('target-change-btn');
const targetTenBtn = document.getElementById('target-ten');
const targetRandomBtn = document.getElementById('target-random');
const targetTime = document.getElementById('target-time');
const timeDiffArea = document.getElementById('time-diff');
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const restartBtn = document.getElementById('restart');
const resetBtn = document.getElementById('reset');

let intervalTimer;
let tmpTime;
let status = 'zero';
let mode = 'stopwatch';
let targetStatus = 'ten';
let target = 10000;

const changeToStartBtn = () => {
  stopBtn.classList.add('hide-btn');
  restartBtn.classList.add('hide-btn');
  startBtn.classList.remove('hide-btn');
};

const changeToStopBtn = () => {
  startBtn.classList.add('hide-btn');
  restartBtn.classList.add('hide-btn');
  stopBtn.classList.remove('hide-btn');
};

const changeToRestartBtn = () => {
  stopBtn.classList.add('hide-btn');
  restartBtn.classList.remove('hide-btn');
};

const getTimes = (startTime) => {
  const nowTime = new Date();
  let time = nowTime - startTime;

  tmpTime = time;

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

  display.innerHTML = `${hourString}:${minutesString}:${secondString}.<span class="milliseconds">${millisecondsString}</span>`;
};

const getGameTimes = (startTime) => {
  const nowTime = new Date();
  let time = nowTime - startTime;

  tmpTime = time;

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

  if (tmpTime >= target) {
    sign = '+';
    diff = tmpTime - target;
  } else {
    sign = '-';
    diff = target - tmpTime;
  }

  const milliseconds = diff % 1000;
  const millisecondsString = '0'.repeat(3 - String(milliseconds).length) + milliseconds;

  diff = Math.floor(diff / 1000);

  const secondString = String(diff % 60);

  timeDiffArea.innerHTML = `${sign}${secondString}.<span class="diff-milliseconds">${millisecondsString}</span>`;
};

const startTimer = () => {
  if (status === 'zero') {
    const startTime = new Date();

    if (mode === 'stopwatch') {
      intervalTimer = setInterval(getTimes, 1, startTime);
    } else {
      timeDiffArea.innerHTML = '';

      intervalTimer = setInterval(getGameTimes, 1, startTime);

      if (targetStatus === 'ten') {
        target = 10000;
      } else {
        target = getTargetTime();
        targetTime.innerHTML = `${Math.floor(target / 1000)}.<span class="target-milliseconds">${String(target).substr(-3)}</span>`;
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
      changeToRestartBtn();
      status = 'stop';
    } else {
      diffTime();
      display.style.transition = '';
      display.style.opacity = 1;

      changeToStartBtn();
      status = 'zero';
    }
  }
};

const restartTimer = () => {
  if (status === 'stop') {
    const startTime = new Date();
    startTime.setMilliseconds(startTime.getMilliseconds() - tmpTime);

    intervalTimer = setInterval(getTimes, 1, startTime);

    changeToStopBtn();

    status = 'move';
  }
};

const resetTimer = () => {
  clearInterval(intervalTimer);
  changeToStartBtn();

  if (mode === 'stopwatch') {
    display.innerHTML = '00:00:00.<span class="milliseconds">000</span>';
  } else {
    display.innerHTML = '00.<span class="milliseconds">000</span>';
    targetTime.innerHTML = (targetStatus === 'ten') ? '10.<span class="target-milliseconds">000</span>' : '<span class="target-time-random">RANDOM</span>';
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

    targetTime.innerHTML = '';
    display.innerHTML = '00:00:00.<span class="milliseconds">000</span>';
    targetChangeArea.classList.add('hide-target-change');

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
    targetTime.innerHTML = (targetStatus === 'ten') ? '10.<span class="target-milliseconds">000</span>' : '<span class="target-time-random">RANDOM</span>';
    targetChangeArea.classList.remove('hide-target-change');

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
  targetTime.innerHTML = '10.<span class="target-milliseconds">000</span>';

  targetStatus = 'ten';
};

const changeTargetRandom = () => {
  resetTimer();

  targetTenBtn.classList.replace('on-color', 'off-color');
  targetRandomBtn.classList.replace('off-color', 'on-color');
  targetChangeBtn.innerHTML = '<i class="fas fa-toggle-on"></i>';
  targetTime.innerHTML = '<span class="target-time-random">RANDOM</span>';

  targetStatus = 'random';
};

const targetChange = () => {
  if (targetStatus === 'ten') {
    changeTargetRandom();
  } else {
    changeTargetTen();
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
