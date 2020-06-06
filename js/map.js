/*jshint esversion:6 */
// CONSTS AND CONFIG

const timeValueElement = document.getElementById("time_value");
const trajectoryElement = document.getElementById("trajectory");
const trajectoryStartElement = document.getElementById("trajectory_start");
const trajectoryEndElement = document.getElementById("trajectory_end");
// const trajectoryListElement = document.getElementById("trajectory_list");
const highlightAllPointsButton = document.getElementById("button__highlightAllPoints");
const unlightAllPointsButton = document.getElementById("button__unlightAllPoints");
const pointsGroup = document.getElementById("points");
const linesGroup = document.getElementById("lines");
const textGroup = document.getElementById("texts");
const nameGroup = document.getElementById("names");
const lineZonesGroup = document.getElementById("lineZones");
const pointZonesGroup = document.getElementById("pointZones");
const pointRadius = 6;
const zonePointRadius = 18;
const zoneLineWidth = 20;
const singleLineWidth = 3;
const doubleLineWidth = 2.5;
const doubleLineGap = 2;
const arrowLength = 4;
var activePointsArray = [];
var activeLinesArray = [];
var trajectoryExtremitiesArray = [];
let timeCount = 0;


// HELPERS & UTILS

// proxies
const activeLines = new Proxy(activeLinesArray, {
  set: (target, key, value) => {
    target[key] = value;
    handleLineCountChange();
    return true;
  },
});

const activePoints = new Proxy(activePointsArray, {
  set: (target, key, value) => {
    target[key] = value;
    handlePointsCountChange();
    return true;
  },
});

const trajectoryExtremities = new Proxy(trajectoryExtremitiesArray, {
  set: (target, key, value) => {
    target[key] = value;

    // remove possible elements
    document.querySelectorAll('.possibleTrajectory')
      .forEach((element) => element.classList.remove('possibleTrajectory'));


    // display possible lines if not on a round trip
    if (target[0] !== target[1]) {
      target.forEach((trajectoryExtremity) => {
        const possibleLines = pointsMap[trajectoryExtremity];
        possibleLines
          .forEach((line) => {
            document.querySelectorAll(`#line__${line}, #text__${line}, #text__${line}__top, #text__${line}__bottom, #lineZone__${line}`)
              .forEach((element) => element.classList.add('possibleTrajectory'));
          });
      });
    }

    // disable trajectoryMode if trajectory array is empty
    if (target.length === 0) {
      svgElement.classList.remove('trajectoryMode');
      trajectoryElement.style.display = 'none';
      return true;
    }

    // enable trajectoryMode if not
    svgElement.classList.add('trajectoryMode');
    trajectoryElement.style.display = 'block';
    trajectoryStartElement.innerHTML = trajectoryExtremitiesArray[0];
    trajectoryEndElement.innerHTML = trajectoryExtremitiesArray[1];
    return true;
  },
});

// change handlers
const handleLineCountChange = () => {
  timeCount = 0;
  activeLines.forEach(value => (timeCount += data.lines[value].time));

  const hourCount = Math.floor(timeCount / 60);
  const timeDisplay = timeCount > 60 ?
    `${hourCount} heure${hourCount > 1 ? 's' : ''} ${timeCount % 60}` :
    timeCount;
  timeValueElement.innerHTML = timeDisplay;
};

const handlePointsCountChange = () => {
  if (activePointsArray.length === Object.keys(data.points).length) {
    highlightAllPointsButton.disabled = true;
  } else if (activePointsArray.length === 0) {
    unlightAllPointsButton.disabled = true;
  } else {
    highlightAllPointsButton.disabled = false;
    unlightAllPointsButton.disabled = false;
  }
};

const setExtremitiesFromLine = (line) => {
  const extremityIndexOfStart = trajectoryExtremities.indexOf(data.lines[line].start);
  const extremityIndexOfEnd = trajectoryExtremities.indexOf(data.lines[line].end);

  // if you're writing the first
  if (trajectoryExtremities.length === 0) {
    trajectoryExtremities.push(data.lines[line].start, data.lines[line].end);
    return true;
  }

  if (trajectoryExtremities[0] === trajectoryExtremities[1]) {
    // if you're trying to remove a segment from a round trajectory
    if (activeLinesArray.indexOf(line) >= 0) {
      trajectoryExtremities[0] = data.lines[line].start;
      trajectoryExtremities[1] = data.lines[line].end;
      return true;
    }

    // if you're trying to add a segment to a round trajectory
    return false;
  }

  // if you're trying to remove a lone segment
  if (extremityIndexOfStart >= 0 && extremityIndexOfEnd >= 0) {
    if (activeLinesArray.length === 1) {
      trajectoryExtremities.pop();
      trajectoryExtremities.pop();
      return true;
    }
  }

  if (extremityIndexOfStart >= 0) {
    trajectoryExtremities[extremityIndexOfStart] = data.lines[line].end;
    return true;
  }

  if (extremityIndexOfEnd >= 0) {
    trajectoryExtremities[extremityIndexOfEnd] = data.lines[line].start;
    return true;
  }

  return false;
};

// DOM utils
const setAttributes = (el, attrs) => {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

// math utils
const getCenter = ({ start, end }) => {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
};

const getCoeff = ({ start, end }) => {
  if (start.y - end.y < 0 && start.x - end.x < 0) {
    if (start.y - end.y > 0 && start.x - end.x > 0) {
      return 1;
    }
    return -1;
  }

  if (end.y - start.y < 0 && end.x - start.x < 0) {
    if (end.y - start.y > 0 && end.x - start.x > 0) {
      return 1;
    }
    return -1;
  }

  return 1;
};

const getLineAngle = ({ start, end }) => {
  const delta = {
    x: Math.abs(start.x - end.x),
    y: Math.abs(start.y - end.y),
  };

  return (
    Math.atan2(getCoeff({ start, end }) * delta.x, delta.y) * (180 / Math.PI)
  );
};

// event helpers

const highlightPoint = point => {
  const targetPoint = document.getElementById(`placePoint_${slugify(point)}`);
  const targetText = document.getElementById(`placeName_${slugify(point)}`);
  if (!targetPoint || !targetText) return; // point not existing (is it possible?)
  if (arrayHasValue(activePoints, point)) return; // point already in list

  arrayAddValue(activePoints, point);
  targetPoint.classList.add("placePoint--active");
  targetText.classList.add("placeName--active");
};
const unlightPoint = point => {
  const targetPoint = document.getElementById(`placePoint_${slugify(point)}`);
  const targetText = document.getElementById(`placeName_${slugify(point)}`);
  if (!targetPoint || !targetText) return;
  if (!arrayHasValue(activePoints, point)) return;

  arrayRemoveValue(activePoints, point);
  targetPoint.classList.remove("placePoint--active");
  targetText.classList.remove("placeName--active");
};

const togglePoint = point => {
  if (arrayHasValue(activePoints, point)) {
    return unlightPoint(point);
  }
  return highlightPoint(point);
};

const highlightAllPoints = () => {
  Object.keys(data.points).forEach(point => highlightPoint(point));
};
const unlightAllPoints = () => {
  Object.keys(data.points).forEach(point => unlightPoint(point));
};

const unlightLine = line => {
  const targetElements = document.querySelectorAll(
    `#line__${line}, #text__${line}, #text__${line}__top, #text__${line}__bottom`
  );

  if (!targetElements) return;

  arrayRemoveValue(activeLines, line);
  targetElements.forEach((element) => {
    element.classList.remove("isSelected");
  });
};

const toggleLine = line => {
  const targetElements = document.querySelectorAll(
    `#line__${line}, #text__${line}, #text__${line}__top, #text__${line}__bottom`
  );

  if (!targetElements) return;
  if (arrayHasValue(activeLines, line)) {
    const isLineRemoveable = setExtremitiesFromLine(line);
    if (isLineRemoveable) {
      arrayRemoveValue(activeLines, line);
      targetElements.forEach((element) => {
        element.classList.remove("isSelected");
      });
    }
  } else {
    const isLineAvailable = setExtremitiesFromLine(line);
    if (isLineAvailable) {
      arrayAddValue(activeLines, line);
      targetElements.forEach((element) => {
        element.classList.add("isSelected");
      });
    }
  }
};

const disableAllLines = () => {
  if (activeLinesArray.length > 0) {
    trajectoryExtremities.pop();
    trajectoryExtremities.pop();
    const arrayToDisable = [...activeLinesArray];
    arrayToDisable.forEach((line) => unlightLine(line));
  }
};
// DRAWING METHODS

const drawPoint = ({ x, y }, name, label) => {
  const newPoint = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  const newZonePoint = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  const newTextGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  const newText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const newTextBg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  const newTextNode = document.createTextNode(label || name);

  // add point
  setAttributes(newPoint, {
    transform: `translate(${x - pointRadius} ${y - pointRadius})`,
    cx: pointRadius,
    cy: pointRadius,
    r: pointRadius,
    class: "placePoint",
    id: `placePoint_${slugify(name)}`,
  });
  pointsGroup.appendChild(newPoint);

  // add pointzone
  setAttributes(newZonePoint, {
    transform: `translate(${x - zonePointRadius} ${y - zonePointRadius})`,
    cx: zonePointRadius,
    cy: zonePointRadius,
    r: zonePointRadius,
    class: "zonePoint",
    id: `zonePoint_${slugify(name)}`,
  });
  pointZonesGroup.appendChild(newZonePoint);
  addClickEvent(newZonePoint, () => togglePoint(name));

  // add text group and text
  setAttributes(newTextGroup, {
    transform: `translate(${x} ${y})`,
    class: "placeName",
    id: `placeName_${slugify(name)}`,
  });
  setAttributes(newText, {
    class: "placeName__text",
    "dominant-baseline": "middle",
  });
  newText.appendChild(newTextNode);
  nameGroup.appendChild(newTextGroup);
  newTextGroup.appendChild(newText);

  // add BG
  const newTextBBox = newText.getBBox();
  setAttributes(newTextBg, {
    x: newTextBBox.x,
    y: -pointRadius - 1.5,
    width: newTextBBox.width + pointRadius,
    height: pointRadius * 2 + 3,
    class: "placeName__bg",
  });
  newTextGroup.insertBefore(newTextBg, newText);

  if (newTextBBox.width + x > svgViewbox.width + svgViewbox.x) {
    setAttributes(newTextGroup, {
      transform: `translate(${x - newTextBBox.width} ${y})`,
    });
    setAttributes(newTextBg, {
      x: -pointRadius,
      class: "placeName__bg placeName__bg--left_aligned",
    });
  }
};

const drawLine = ({ start, end, index, className="" }) => {
  const newLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  setAttributes(newLine, {
    id: `line__${index}`,
    x1: start.x,
    x2: end.x,
    y1: start.y,
    y2: end.y,
    class: `line__element line__regular ${className}`,
    "stroke-width": singleLineWidth,
  });
  linesGroup.appendChild(newLine);

  drawLineZone({ start, end, index, className });
};

const drawDoubleLine = ({ start, end, difficulty, index, className="" }) => {
  const newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const newLine1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  const newLine2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  const newArrow1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  const newArrow2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  const lineCenter = getCenter({ start, end });

  const length = Math.sqrt(
    Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
  );

  const lineAngle = getLineAngle({ start, end });

  const lineClass1 = difficulty > 0 ? "line__hard" : "line__easy";
  const lineClass2 = difficulty < 0 ? "line__hard" : "line__easy";
  const arrowClass1 = difficulty > 0 ? "lineArrow__hard" : "lineArrow__easy";
  const arrowClass2 = difficulty < 0 ? "lineArrow__hard" : "lineArrow__easy";

  setAttributes(newLine1, {
    x1: -doubleLineGap,
    x2: -doubleLineGap,
    y1: -1 * length / 2,
    y2: length / 2,
    class: lineClass1,
    "stroke-width": doubleLineWidth,
  });
  setAttributes(newLine2, {
    x1: doubleLineGap,
    x2: doubleLineGap,
    y1: -1 * length / 2,
    y2: length / 2,
    class: lineClass2,
    "stroke-width": doubleLineWidth,
  });

  setAttributes(newArrow1, {
    width: arrowLength,
    height: doubleLineWidth * 2,
    x: -doubleLineGap - arrowLength,
    y: arrowLength * 2 + 3,
    transform: "skewY(60)",
    class: arrowClass1,
  });

  setAttributes(newArrow2, {
    width: arrowLength,
    height: doubleLineWidth * 2,
    x: doubleLineGap,
    y: -arrowLength * 2 - 3,
    transform: "skewY(60)",
    class: arrowClass2,
  });

  newGroup.appendChild(newLine1);
  newGroup.appendChild(newLine2);
  newGroup.appendChild(newArrow1);
  newGroup.appendChild(newArrow2);

  setAttributes(newGroup, {
    id: `line__${index}`,
    class: `line__element line__group ${className}`,
    transform: `rotate(${lineAngle} ${lineCenter.x} ${lineCenter.y}) translate(${lineCenter.x} ${lineCenter.y})`,
  });

  linesGroup.appendChild(newGroup);

  drawLineZone({ start, end, index });
};

const drawLineZone = ({ start, end, index, className="" }) => {
  const newLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  setAttributes(newLine, {
    id: `lineZone__${index}`,
    x1: start.x,
    x2: end.x,
    y1: start.y,
    y2: end.y,
    stroke: "#000",
    "stroke-width": zoneLineWidth,
    class: `zoneLine ${className}`,
  });

  lineZonesGroup.appendChild(newLine);

  addClickEvent(newLine, () => toggleLine(index));
};

const drawNumber = ({ start, end, number, align, displayMin, line, className="" }) => {
  const lineCenter = getCenter({ start, end });
  const newText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const min = displayMin !== false ? " min" : "";
  const textNode = document.createTextNode(number + min);
  newText.appendChild(textNode);

  let rotateAngle = getLineAngle({ start, end }) + 90;
  if (rotateAngle > 90) {
    rotateAngle = rotateAngle - 180;
  }
  const rotateTransform = `rotate(${rotateAngle} ${lineCenter.x} ${lineCenter.y})`;
  const translateTransform = `translate(0 ${align !== 'bottom' ? -5 : 12})`;

  setAttributes(newText, {
    id: `text__${line}`,
    x: lineCenter.x,
    y: lineCenter.y,
    "text-anchor": "middle",
    transform: `${rotateTransform} ${translateTransform}`,
    class: `numberText ${className}`,
  });

  textGroup.appendChild(newText);
};

const drawDoubleNumber = ({ start, end, numbers, displayMin, line, className="" }) => {
  const lineCenter = getCenter({ start, end });
  let rotateAngle = getLineAngle({ start, end }) + 90;
  if (rotateAngle > 90) {
    rotateAngle = rotateAngle - 180;
  }
  const rotateTransform = `rotate(${rotateAngle} ${lineCenter.x} ${lineCenter.y})`;

  const newText1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const newText2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const min = displayMin !== false ? " min" : "";
  const textNode1 = document.createTextNode(
    (rotateAngle < 0 ? numbers.top : numbers.bottom) + min
  );
  const textNode2 = document.createTextNode(
    (rotateAngle < 0 ? numbers.bottom : numbers.top) + min
  );
  newText1.appendChild(textNode1);
  newText2.appendChild(textNode2);

  setAttributes(newText1, {
    id: `text__${line}__top`,
    x: lineCenter.x,
    y: lineCenter.y,
    "text-anchor": "start",
    transform: `${rotateTransform} translate(4 -5)`,
    class: `numberText numberText--top ${className}`,
  });
  setAttributes(newText2, {
    id: `text__${line}__bottom`,
    x: lineCenter.x,
    y: lineCenter.y,
    "text-anchor": "end",
    transform: `${rotateTransform} translate(-4 12)`,
    class: `numberText numberText--bottom ${className}`,
  });

  textGroup.appendChild(newText1);
  textGroup.appendChild(newText2);
};
