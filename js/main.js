// CONSTS AND CONFIG

const pointRadius = 6;
const pointsGroup = document.getElementById("points");
const linesGroup = document.getElementById("lines");
const textGroup = document.getElementById("texts");
const nameGroup = document.getElementById("names");
const voronoiGroup = document.getElementById("voronoi");
const singleLineWidth = 4;
const doubleLineWidth = 2.5;
const doubleLineGap = 2;
const arrowLength = 4;
const activePoints = new Set();

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

// DRAWING METHODS

const drawPoint = ({ x, y }, name) => {
  const newPoint = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
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
    x: x - pointRadius,
    y: y - pointRadius,
    class: "placePoint",
    id: `placePoint_${slugify(name)}`,
  });
  newPoint.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#point");
  pointsGroup.appendChild(newPoint);

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

const drawLine = ({ start, end }) => {
  const newLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  setAttributes(newLine, {
    x1: start.x,
    x2: end.x,
    y1: start.y,
    y2: end.y,
    stroke: "#80F",
    "stroke-width": singleLineWidth,
  });
  linesGroup.appendChild(newLine);
};

const drawNumber = ({ start, end, number, align }) => {
  console.log(align)
  const lineCenter = getCenter({ start, end });
  const newText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const textNode = document.createTextNode(number);
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

const drawDoubleLine = ({ start, end, difficulty }) => {
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

  const lineColor1 = difficulty > 0 ? "#F00" : "#00F";
  const lineColor2 = difficulty < 0 ? "#F00" : "#00F";

  setAttributes(newLine1, {
    x1: -doubleLineGap,
    x2: -doubleLineGap,
    y1: -1 * length / 2,
    y2: length / 2,
    stroke: lineColor1,
    "stroke-width": doubleLineWidth,
  });
  setAttributes(newLine2, {
    x1: doubleLineGap,
    x2: doubleLineGap,
    y1: -1 * length / 2,
    y2: length / 2,
    stroke: lineColor2,
    "stroke-width": doubleLineWidth,
  });

  setAttributes(newArrow1, {
    width: arrowLength,
    height: doubleLineWidth * 2,
    x: -doubleLineGap - arrowLength,
    y: arrowLength * 2 + 3,
    transform: "skewY(60)",
    fill: lineColor1,
  });

  setAttributes(newArrow2, {
    width: arrowLength,
    height: doubleLineWidth * 2,
    x: doubleLineGap,
    y: -arrowLength * 2 - 3,
    transform: "skewY(60)",
    fill: lineColor2,
  });

  newGroup.appendChild(newLine1);
  newGroup.appendChild(newLine2);
  newGroup.appendChild(newArrow1);
  newGroup.appendChild(newArrow2);

  setAttributes(newGroup, {
    transform: `rotate(${lineAngle} ${lineCenter.x} ${lineCenter.y}) translate(${lineCenter.x} ${lineCenter.y})`,
  });

  linesGroup.appendChild(newGroup);
};

const drawDoubleNumber = ({ start, end, numbers }) => {
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
  const textNode1 = document.createTextNode(
    rotateAngle < 0 ? numbers.top : numbers.bottom
  );
  const textNode2 = document.createTextNode(
    rotateAngle < 0 ? numbers.bottom : numbers.top
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
    stroke: "#0F0",
    points: vertices,
    opacity: 0,
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

data.lines.forEach(line => {
  if (line.difficulty === 0) {
    drawNumber({
      start: data.points[line.start],
      end: data.points[line.end],
      number: line.time,
      align: line.align,
    });
    drawLine({
      start: data.points[line.start],
      end: data.points[line.end],
    });
  } else {
    drawDoubleNumber({
      start: data.points[line.start],
      end: data.points[line.end],
      numbers: {
        top: line.difficulty > 0 ? line.time.hard : line.time.easy,
        bottom: line.difficulty > 0 ? line.time.easy : line.time.hard,
      },
    });
    drawDoubleLine({
      start: data.points[line.start],
      end: data.points[line.end],
      difficulty: line.difficulty,
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