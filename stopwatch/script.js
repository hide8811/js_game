const changeBtn = document.getElementById('change-btn');
const changeStopwatchBtn = document.getElementById('change-stopwatch');
const changeGameBtn = document.getElementById('change-game');
const targetTimeArea = document.getElementById('target-time');
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

  display.innerHTML = `${hourString}:${minutesString}:${secondString}.${millisecondsString}`;
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

  display.innerHTML = `${secondString}.${millisecondsString}`;
};

const diffTime = () => {
  let sign;
  let diff;

  if (tmpTime >= 10000) {
    sign = '+';
    diff = tmpTime - 10000;
  } else {
    sign = '-';
    diff = 10000 - tmpTime;
  }

  const milliseconds = diff % 1000;
  const millisecondsString = '0'.repeat(3 - String(milliseconds).length) + milliseconds;

  diff = Math.floor(diff / 1000);

  const secondString = String(diff % 60);

  timeDiffArea.innerHTML = `${sign}${secondString}.${millisecondsString}`;
};

const startTimer = () => {
  if (status === 'zero') {
    const startTime = new Date();

    if (mode === 'stopwatch') {
      intervalTimer = setInterval(getTimes, 1, startTime);
    } else {
      timeDiffArea.innerHTML = '';
      intervalTimer = setInterval(getGameTimes, 1, startTime);
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
  display.innerHTML = (mode === 'stopwatch') ? '00:00:00.000' : '00.000';

  timeDiffArea.innerHTML = '';

  changeToStartBtn();

  status = 'zero';
};

const changeStopwatchMode = () => {
  if (mode === 'game') {
    clearInterval(intervalTimer);

    display.innerHTML = '00:00:00.000';
    changeBtn.innerHTML = '<i class="fas fa-toggle-off"></i>';
    timeDiffArea.innerHTML = '';
    targetTimeArea.innerHTML = '';

    changeToStartBtn();
    status = 'zero';
    mode = 'stopwatch';
  }
};

const changeGameMode = () => {
  if (mode === 'stopwatch') {
    clearInterval(intervalTimer);

    display.innerHTML = '00.000';
    changeBtn.innerHTML = '<i class="fas fa-toggle-on"></i>';
    targetTimeArea.innerHTML = '10.000';

    changeToStartBtn();
    status = 'zero';
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

changeBtn.addEventListener('click', modeChange);
changeStopwatchBtn.addEventListener('click', changeStopwatchMode);
changeGameBtn.addEventListener('click', changeGameMode);
startBtn.addEventListener('mousedown', startTimer);
stopBtn.addEventListener('mousedown', stopTimer);
restartBtn.addEventListener('mousedown', restartTimer);
resetBtn.addEventListener('mousedown', resetTimer);
