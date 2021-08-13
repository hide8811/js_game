/* global confetti */

const allPositions = Array.from(document.getElementsByClassName('position'));
const getEmptyPosition = () => allPositions.find((position) => position.innerHTML === '');
const shuffleBtn = document.getElementById('shuffle-btn');

let completedFlag = false;

// 参考: https://www.npmjs.com/package/canvas-confetti
const canvasConfetti = () => {
  confetti({
    particleCount: 400,
    angle: 60,
    spread: 100,
    origin: { x: 0, y: 0.6 },
  });

  confetti({
    particleCount: 400,
    angle: 120,
    spread: 100,
    origin: { x: 1, y: 0.6 },
  });
};

const slide = (event, i) => {
  const position = event.currentTarget;

  const leftColumn = ['position1', 'position4', 'position7'];
  const rightColumn = ['position3', 'position6', 'position9'];

  const up = i - 3;
  const down = i + 3;
  const left = i - 1;
  const right = i + 1;

  const adjacent = () => {
    if (leftColumn.includes(position.id)) { return [up, down, right]; }

    if (rightColumn.includes(position.id)) { return [up, down, left]; }

    return [up, down, left, right];
  };

  const adjacentPositions = adjacent().map((a) => allPositions[a]);
  const emptyPosition = getEmptyPosition();

  if (adjacentPositions.includes(emptyPosition)) {
    emptyPosition.innerHTML = position.innerHTML;
    position.innerHTML = '';
  }

  const allPanels = allPositions.map((panel) => panel.innerHTML);
  const correctPanels = Array.from(allPanels).sort();
  correctPanels.push(correctPanels.shift());

  if (completedFlag && allPanels.toString() === correctPanels.toString()) {
    canvasConfetti();
  }
};

const possible = (allPanels) => {
  const swapEven = () => {
    const randomOrder = Array.from(allPanels);
    const correctOrder = Array.from(allPanels).sort();

    correctOrder.push(correctOrder.shift());

    let count = 0;
    for (let i = 0; i < randomOrder.length - 1; i += 1) {
      if (randomOrder[i] !== correctOrder[i]) {
        const x = randomOrder.indexOf(correctOrder[i]);
        const tmp = randomOrder[x];
        randomOrder[x] = randomOrder[i];
        randomOrder[i] = tmp;

        count += 1;
      }
    }
    return count % 2 === 0;
  };

  const emptyDistanceEven = () => {
    const emptyPositionIndex = allPanels.indexOf('');

    // 最短距離が偶数のindex => [0, 2, 4, 6, 8]
    // [0, 2, 4, 6, 8].includes(emptyPositionIndex)
    return emptyPositionIndex % 2 === 0;
  };

  if (swapEven() === emptyDistanceEven()) {
    return false;// 終了
  }
  return true;// 繰り返し
};

const shuffle = () => {
  const allPanels = allPositions.map((position) => position.innerHTML);

  do {
    for (let i = allPanels.length - 1; i > 0; i -= 1) {
      const n = Math.floor(Math.random() * (i + 1));
      const iPanel = allPanels[i];
      allPanels[i] = allPanels[n];
      allPanels[n] = iPanel;
    }
  } while (possible(allPanels));

  for (let i = 0; i < allPositions.length; i += 1) {
    allPositions[i].innerHTML = allPanels[i];
  }

  completedFlag = true;
};

for (let i = 0; i < allPositions.length; i += 1) {
  allPositions[i].addEventListener('click', (event) => {
    slide(event, i);
  });
}

shuffleBtn.addEventListener('click', shuffle);
