const display = document.getElementById('display');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const restart = document.getElementById('restart');
const reset = document.getElementById('reset');

let intervalTimer;
let tmpTime;
let status = 'zero';

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

const startTimer = () => {
  if (status === 'zero') {
    const startTime = new Date();

    intervalTimer = setInterval(getTimes, 1, startTime);

    status = 'move';
  }
};

const stopTimer = () => {
  if (status === 'move') {
    clearInterval(intervalTimer);

    status = 'stop';
  }
};

const restartTimer = () => {
  if (status === 'stop') {
    const startTime = new Date();
    startTime.setMilliseconds(startTime.getMilliseconds() - tmpTime);

    intervalTimer = setInterval(getTimes, 1, startTime);

    status = 'move';
  }
};

const resetTimer = () => {
  if (status === 'stop') {
    display.innerHTML = '00:00:00.000';

    status = 'zero';
  }
};

start.addEventListener('mousedown', startTimer);
stop.addEventListener('mousedown', stopTimer);
restart.addEventListener('mousedown', restartTimer);
reset.addEventListener('mousedown', resetTimer);
