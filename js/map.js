// CONSTS AND CONFIG

const valueElement = document.getElementById("valeur");
const pointsGroup = document.getElementById("points");
const linesGroup = document.getElementById("lines");
const textGroup = document.getElementById("texts");
const nameGroup = document.getElementById("names");
const voronoiGroup = document.getElementById("voronoi");
const lineZonesGroup = document.getElementById("lineZones");
const pointZonesGroup = document.getElementById("pointZones");
const pointRadius = 6;
const zonePointRadius = 18;
const zoneLineWidth = 20;
const singleLineWidth = 3;
const doubleLineWidth = 2;
const doubleLineGap = 1;
const arrowLength = 4;
const activePointsArray = new Array();
const activeLinesArray = new Array();
let timeCount = 0;

// HELPERS & UTILS

// array utils
const arrayHasValue = (array, value) => {
  return array.indexOf(value) >= 0;
};

const arrayAddValue = (array, value) => {
  const index = array.indexOf(value);
  if (index <= -1) {
    array.push(value);
  }
  return array;
};

const arrayRemoveValue = (array, value) => {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

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

// change handlers
const handleLineCountChange = () => {
  timeCount = 0;
  activeLines.forEach(value => (timeCount += data.lines[value].time));

  const hourCount = Math.floor(timeCount / 60)
  const timeDisplay = timeCount > 60
    ? `${hourCount} heure${hourCount > 1 ? 's' : ''} ${timeCount % 60}`
    : timeCount
  valueElement.innerHTML = timeDisplay;
};

const handlePointsCountChange = () => {};

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
  if (!targetPoint || !targetText || arrayHasValue(activePoints, point)) return;
  arrayAddValue(activePoints, point);
  targetPoint.style = "--placePoint__strokeColor: #FFF;";
  targetText.classList.add("placeName--active");
};
const unlightPoint = point => {
  const targetPoint = document.getElementById(`placePoint_${slugify(point)}`);
  const targetText = document.getElementById(`placeName_${slugify(point)}`);
  if (!targetPoint || !targetText || !arrayHasValue(activePoints, point))
    return;
  arrayRemoveValue(activePoints, point);
  targetPoint.style = "";
  targetText.classList.remove("placeName--active");
};

const togglePoint = point => {
  if (arrayHasValue(activePoints, point)) {
    return unlightPoint(point);
  }
  return highlightPoint(point);
};

const toggleLine = line => {
  const targetLine = document.getElementById(`line__${line}`);
  if (!targetLine) return;
  if (arrayHasValue(activeLines, line)) {
    arrayRemoveValue(activeLines, line);
    targetLine.classList.remove("line__selected");
  } else {
    arrayAddValue(activeLines, line);
    targetLine.classList.add("line__selected");
  }
};

// DRAWING METHODS

const drawPoint = ({ x, y }, name) => {
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
  const newTextNode = document.createTextNode(name);

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
    opacity: 0,
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
  newTextBBox = newText.getBBox();
  setAttributes(newTextBg, {
    x: newTextBBox.x,
    y: -pointRadius - 1.5,
    width: newTextBBox.width + pointRadius,
    height: pointRadius * 2 + 3,
    class: "placeName__bg",
  });
  newTextGroup.insertBefore(newTextBg, newText);
};

const drawLine = ({ start, end, index }) => {
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
    class: "line__regular",
    "stroke-width": singleLineWidth,
  });
  linesGroup.appendChild(newLine);

  drawLineZone({ start, end, index });
};

const drawDoubleLine = ({ start, end, difficulty, index }) => {
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
    class: "line__group",
    transform: `rotate(${lineAngle} ${lineCenter.x} ${lineCenter.y}) translate(${lineCenter.x} ${lineCenter.y})`,
  });

  linesGroup.appendChild(newGroup);

  drawLineZone({ start, end, index });
};

const drawLineZone = ({ start, end, index }) => {
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
    stroke: "#555",
    "stroke-width": zoneLineWidth,
    opacity: 0,
    class: "zoneLine",
  });

  lineZonesGroup.appendChild(newLine);

  addClickEvent(newLine, () => toggleLine(index));
};

const drawNumber = ({ start, end, number, align, displayMin }) => {
  const lineCenter = getCenter({ start, end });
  const newText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const min = displayMin ? " min" : "";
  const textNode = document.createTextNode(number + min);
  newText.appendChild(textNode);

  let rotateAngle = getLineAngle({ start, end }) + 90;
  if (rotateAngle > 90) {
    rotateAngle = rotateAngle - 180;
  }
  const rotateTransform = `rotate(${rotateAngle} ${lineCenter.x} ${lineCenter.y})`;
  const translateTransform = `translate(0 ${align === "top" ? -5 : 12})`;

  setAttributes(newText, {
    x: lineCenter.x,
    y: lineCenter.y,
    "text-anchor": "middle",
    transform: `${rotateTransform} ${translateTransform}`,
    class: "numberText",
  });

  textGroup.appendChild(newText);
};

const drawDoubleNumber = ({ start, end, numbers, displayMin }) => {
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
  const min = displayMin ? " min" : "";
  const textNode1 = document.createTextNode(
    (rotateAngle < 0 ? numbers.top : numbers.bottom) + min
  );
  const textNode2 = document.createTextNode(
    (rotateAngle < 0 ? numbers.bottom : numbers.top) + min
  );
  newText1.appendChild(textNode1);
  newText2.appendChild(textNode2);

  setAttributes(newText1, {
    x: lineCenter.x,
    y: lineCenter.y,
    "text-anchor": "start",
    transform: `${rotateTransform} translate(4 -5)`,
    class: "numberText numberText--top",
  });
  setAttributes(newText2, {
    x: lineCenter.x,
    y: lineCenter.y,
    "text-anchor": "end",
    transform: `${rotateTransform} translate(-4 12)`,
    class: "numberText numberText--bottom",
  });

  textGroup.appendChild(newText1);
  textGroup.appendChild(newText2);
};

const drawPolygon = (point, vertices) => {
  const newPolygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );

  setAttributes(newPolygon, {
    fill: "#FFF",
    points: vertices,
    opacity: 0,
    class: "zoneVoronoi",
  });

  addClickEvent(newPolygon, () => togglePoint(point));

  voronoiGroup.appendChild(newPolygon);
};
