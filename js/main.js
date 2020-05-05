// CONSTS AND CONFIG

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
const singleLineWidth = 4;
const doubleLineWidth = 2.5;
const doubleLineGap = 1.5;
const arrowLength = 4;
const activePoints = new Set();
const activeLines = new Set();
let timeCount = 0;

// HELPERS & UTILS

const setAttributes = (el, attrs) => {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

const setAttributesNS = (el, attrs) => {
  for (var key in attrs) {
    el.setAttributeNS("http://www.w3.org/2000/svg", key, attrs[key]);
  }
};

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

const highlightPoint = point => {
  const targetPoint = document.getElementById(`placePoint_${slugify(point)}`);
  const targetText = document.getElementById(`placeName_${slugify(point)}`);
  if (!targetPoint || !targetText || activePoints.has(point)) return;
  activePoints.add(point);
  targetPoint.style = "--placePoint__strokeColor: #FFF;";
  targetText.classList.add("placeName--active");
};
const unlightPoint = point => {
  const targetPoint = document.getElementById(`placePoint_${slugify(point)}`);
  const targetText = document.getElementById(`placeName_${slugify(point)}`);
  if (!targetPoint || !targetText || !activePoints.has(point)) return;
  activePoints.delete(point);
  targetPoint.style = "";
  targetText.classList.remove("placeName--active");
};

const togglePoint = point => {
  if (activePoints.has(point)) {
    return unlightPoint(point);
  }
  return highlightPoint(point);
};

const toggleLine = line => {
  const targetLine = document.getElementById(`line__${line}`)
  if (!targetLine) return;
  if (activeLines.has(line)) {
    activeLines.delete(line);
    targetLine.classList.remove("line__selected");
  } else {
    activeLines.add(line)
    targetLine.classList.add("line__selected");
  }

  timeCount = 0;
  activeLines.forEach(updateTimeCount);
  console.log(timeCount);
}

const updateTimeCount = (value) => timeCount = timeCount + data.lines[value].time

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
    class: 'zonePoint',
    id: `zonePoint_${slugify(name)}`,
    opacity: 0,
  });
  pointZonesGroup.appendChild(newZonePoint);
  newZonePoint.addEventListener("click", () => {
    togglePoint(name);
  });

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
    class: 'line__regular',
    "stroke-width": singleLineWidth,
  });
  linesGroup.appendChild(newLine);

  drawLineZone({start, end, index});
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

  const lineClass1 = difficulty > 0 ? 'line__hard' : 'line__easy';
  const lineClass2 = difficulty < 0 ? 'line__hard' : 'line__easy';
  const arrowClass1 = difficulty > 0 ? 'lineArrow__hard' : 'lineArrow__easy';
  const arrowClass2 = difficulty < 0 ? 'lineArrow__hard' : 'lineArrow__easy';

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
    class: 'line__group',
    transform: `rotate(${lineAngle} ${lineCenter.x} ${lineCenter.y}) translate(${lineCenter.x} ${lineCenter.y})`,
  });

  linesGroup.appendChild(newGroup);

  drawLineZone({start, end, index});
};

const drawLineZone = ({start, end, index}) => {
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
    class: 'zoneLine',
  });

  lineZonesGroup.appendChild(newLine);

  newLine.addEventListener('click', () => toggleLine(index))
}

const drawNumber = ({ start, end, number, align, displayMin }) => {
  const lineCenter = getCenter({ start, end });
  const newText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const min = displayMin ? ' min' : ''
  const textNode = document.createTextNode(number + min);
  newText.appendChild(textNode);

  let rotateAngle = getLineAngle({ start, end }) + 90;
  if (rotateAngle > 90) {
    rotateAngle = rotateAngle - 180;
  }
  const rotateTransform = `rotate(${rotateAngle} ${lineCenter.x} ${lineCenter.y})`;
  const translateTransform = `translate(0 ${align === 'top' ? -5 : 12})`

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
  const min = displayMin ? ' min' : ''
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
    class: 'zoneVoronoi',
  });

  // newPolygon.addEventListener('mouseenter', () => {
  //   highlightPoint(point);
  // });
  // newPolygon.addEventListener('mouseleave', () => {
  //   unlightPoint(point);
  // });
  newPolygon.addEventListener("click", () => {
    togglePoint(point);
  });

  voronoiGroup.appendChild(newPolygon);
};

// POPULATE MAP WITH POINTS AND LINES

Object.keys(data.points).forEach(point => {
  drawPoint(data.points[point], point);
});

data.lines.forEach((line, index) => {
  if (line.difficulty === 0) {
    drawNumber({
      start: data.points[line.start],
      end: data.points[line.end],
      number: line.time,
      align: line.align,
      displayMin: line.displayMin,
    });
    drawLine({
      start: data.points[line.start],
      end: data.points[line.end],
      index: index,
    });
  } else {
    drawDoubleNumber({
      start: data.points[line.start],
      end: data.points[line.end],
      numbers: {
        top: line.difficulty > 0 ? line.times.hard : line.times.easy,
        bottom: line.difficulty > 0 ? line.times.easy : line.times.hard,
      },
      displayMin: line.displayMin,
    });
    drawDoubleLine({
      start: data.points[line.start],
      end: data.points[line.end],
      difficulty: line.difficulty,
      index: index,
    });
  }
});

// CREATE VORONOÏ MESH

const pointsToDelaunate = [];

Object.keys(data.points).forEach(point =>
  pointsToDelaunate.push([data.points[point].x, data.points[point].y])
);

const delaunay = d3.Delaunay.from(pointsToDelaunate);
const voronoi = delaunay.voronoi([0, 0, 1280, 960]);

Object.keys(data.points).forEach((point, index) =>
  drawPolygon(point, voronoi.cellPolygon(index))
);

// GLOBAL EVENT LISTENERS

document.addEventListener("click", event => {
  console.log(`x: ${event.layerX}, y: ${event.layerY}`);
});