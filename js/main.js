const data = {
  points: {
    "Porte de Clichy": {
      x: 540, y: 301
    },
    "Porte de la Chapelle": {
      x: 708, y: 276
    },
    "La Villette": {
      x: 816, y: 334
    },
    "Porte de Bagnolet": {
      x: 891, y: 469
    },
    "Nation": {
      x: 841, y: 559
    },
    "Porte de Bercy": {
      x: 826, y: 668
    },
    "Porte d'Orléans": {
      x: 580, y: 700
    },
    "Porte de Saint-Cloud": {
      x: 332, y: 577
    },
    "Porte Maillot": {
      x: 417, y: 390
    },
    "Montmartre": {
      x: 634, y: 349
    },
    "Gare du Nord": {
      x: 693, y: 396
    },
    "Parc de Belleville": {
      x: 814, y: 415
    },
    "Père Lachaise": {
      x: 810, y: 476
    },
    "Place de la Bastille": {
      x: 742, y: 531
    },
    "Gare de Lyon": {
      x: 775, y: 571
    },
    "Place d'Italie": {
      x: 695, y: 657
    },
    "Place Denfert-Rochereau": {
      x: 607, y: 639
    },
    "Convention": {
      x: 475, y: 624
    },
    "Maison de la Radio": {
      x: 386, y: 566
    },
    "Place de l'Étoile": {
      x: 471, y: 418
    },
    "Gare Saint-Lazare": {
      x: 577, y: 407
    },
    "Place de la République": {
      x: 724, y: 449
    },
    "Notre Dame": {
      x: 674, y: 530
    },
    "Gare Montparnasse": {
      x: 562, y: 579
    },
    "Jardin du Luxembourg": {
      x: 627, y: 550
    },
    "Invalides": {
      x: 534, y: 508
    },
    "Place de la Concorde": {
      x: 567, y: 460
    },
    "Tour Eiffel": {
      x: 501, y: 534
    },
    "Croix de Chavaux": {
      x: 993, y: 507
    },
    "Château de Vincennes": {
      x: 990, y: 579
    },
    "Porte Dorée": {
      x: 885, y: 631
    }
  },
  lines: [
    { start: "Convention", end: "Invalides", time: 14, difficulty: 0 },
    { start: "Convention", end: "Gare Montparnasse", time: 8, difficulty: 0 },
    { start: "Convention", end: "Porte d'Orléans", time: 17, difficulty: 0 },
    { start: "Convention", end: "Porte de Saint-Cloud", time: 15, difficulty: 0 },
    { start: "Convention", end: "Maison de la Radio", time: 11, difficulty: 0 },
    { start: "Convention", end: "Tour Eiffel", time: 13, difficulty: 0 },
    { start: "Gare Montparnasse", end: "Invalides", time: 11, difficulty: 0 },
    { start: "Gare Montparnasse", end: "Jardin du Luxembourg", time: 9, difficulty: 0 },
    { start: "Gare Montparnasse", end: "Place Denfert-Rochereau", time: 8, difficulty: 0 },
    { start: "Gare Montparnasse", end: "Porte d'Orléans", time: 16, difficulty: 0 },
    { start: "Gare Saint-Lazare", end: "Porte de Clichy", time: 14, difficulty: 0 },
    { start: "Gare Saint-Lazare", end: "Montmartre", time: {easy: 10, hard: 12}, difficulty: -1 },
    { start: "Gare Saint-Lazare", end: "Gare du Nord", time: 10, difficulty: 0 },
    { start: "Gare Saint-Lazare", end: "Place de la République", time: 13, difficulty: 0 },
    { start: "Gare Saint-Lazare", end: "Place de la Concorde", time: 7, difficulty: 0 },
    { start: "Gare Saint-Lazare", end: "Place de l'Étoile", time: 10, difficulty: 0 },
    { start: "Gare de Lyon", end: "Nation", time: 7, difficulty: 0 },
    { start: "Gare de Lyon", end: "Porte de Bercy", time: 14, difficulty: 0 },
    { start: "Gare de Lyon", end: "Place d'Italie", time: 9, difficulty: 0 },
    { start: "Gare de Lyon", end: "Notre Dame", time: 9, difficulty: 0 },
    { start: "Gare du Nord", end: "Porte de la Chapelle", time: 12, difficulty: 0 },
    { start: "Gare du Nord", end: "La Villette", time: 14, difficulty: 0 },
    { start: "Gare du Nord", end: "Parc de Belleville", time: 14, difficulty: 0 },
    { start: "Gare du Nord", end: "Place de la République", time: 8, difficulty: 0 },
    { start: "Gare du Nord", end: "Notre Dame", time: 15, difficulty: 0 },
    { start: "Gare du Nord", end: "Montmartre", time: {easy: 9, hard: 12}, difficulty: -1 },
    { start: "Invalides", end: "Place de la Concorde", time: 5, difficulty: 0 },
    { start: "Invalides", end: "Notre Dame", time: 12, difficulty: 0 },
    { start: "Invalides", end: "Tour Eiffel", time: 8, difficulty: 0 },
    { start: "Jardin du Luxembourg", end: "Notre Dame", time: 5, difficulty: 0 },
    { start: "Jardin du Luxembourg", end: "Place d'Italie", time: 10, difficulty: 0 },
    { start: "Jardin du Luxembourg", end: "Place de la Concorde", time: 13, difficulty: 0 },
    { start: "La Villette", end: "Porte de Bagnolet", time: 19, difficulty: 0 },
    { start: "La Villette", end: "Parc de Belleville", time: 14, difficulty: 0 },
    { start: "La Villette", end: "Porte de la Chapelle", time: 13, difficulty: 0 },
    { start: "Maison de la Radio", end: "Porte Maillot", time: 15, difficulty: 0 },
    { start: "Maison de la Radio", end: "Place de l'Étoile", time: 13, difficulty: 0 },
    { start: "Maison de la Radio", end: "Tour Eiffel", time: 8, difficulty: 0 },
    { start: "Maison de la Radio", end: "Porte de Saint-Cloud", time: 12, difficulty: 0 },
    { start: "Montmartre", end: "Porte de Clichy", time: {hard: 16, easy: 13}, difficulty: 1 },
    { start: "Montmartre", end: "Porte de la Chapelle", time: {hard: 16, easy: 14}, difficulty: 1 },
    { start: "Nation", end: "Porte de Bercy", time: 15, difficulty: 0 },
    { start: "Nation", end: "Place de la Bastille", time: 10, difficulty: 0 },
    { start: "Nation", end: "Père Lachaise", time: 8, difficulty: 0 },
    { start: "Nation", end: "Porte de Bagnolet", time: 14, difficulty: 0 },
    { start: "Notre Dame", end: "Place de la République", time: 9, difficulty: 0 },
    { start: "Notre Dame", end: "Place de la Bastille", time: 7, difficulty: 0 },
    { start: "Notre Dame", end: "Place d'Italie", time: 12, difficulty: 0 },
    { start: "Notre Dame", end: "Place Denfert-Rochereau", time: 15, difficulty: 0 },
    { start: "Notre Dame", end: "Place de la Concorde", time: 12, difficulty: 0 },
    { start: "Parc de Belleville", end: "Porte de Bagnolet", time: 12, difficulty: 0 },
    { start: "Parc de Belleville", end: "Père Lachaise", time: 5, difficulty: 0 },
    { start: "Parc de Belleville", end: "Place de la Bastille", time: 11, difficulty: 0 },
    { start: "Parc de Belleville", end: "Place de la République", time: 8, difficulty: 0 },
    { start: "Place Denfert-Rochereau", end: "Porte d'Orléans", time: 9, difficulty: 0 },
    { start: "Place d'Italie", end: "Porte de Bercy", time: 16, difficulty: 0 },
    { start: "Place d'Italie", end: "Porte d'Orléans", time: 11, difficulty: 0 },
    { start: "Place de l'Étoile", end: "Porte de Clichy", time: 14, difficulty: 0 },
    { start: "Place de l'Étoile", end: "Place de la Concorde", time: 10, difficulty: 0 },
    { start: "Place de l'Étoile", end: "Tour Eiffel", time: 12, difficulty: 0 },
    { start: "Place de l'Étoile", end: "Porte Maillot", time: 7, difficulty: 0 },
    { start: "Place de la Bastille", end: "Place de la République", time: 8, difficulty: 0 },
    { start: "Place de la Bastille", end: "Père Lachaise", time: 8, difficulty: 0 },
    { start: "Place de la Bastille", end: "Gare de Lyon", time: 3, difficulty: 0 },
    { start: "Place de la Concorde", end: "Place de la République", time: 14, difficulty: 0 },
    { start: "Porte Maillot", end: "Porte de Clichy", time: 14, difficulty: 0 },
    { start: "Porte Maillot", end: "Porte de Saint-Cloud", time: 22, difficulty: 0 },
    { start: "Porte d'Orléans", end: "Porte de Saint-Cloud", time: 17, difficulty: 0 },
    { start: "Porte d'Orléans", end: "Porte de Bercy", time: 22, difficulty: 0 },
    { start: "Porte de Bagnolet", end: "Père Lachaise", time: 10, difficulty: 0 },
    { start: "Porte de Clichy", end: "Porte de la Chapelle", time: 17, difficulty: 0 },
    { start: "Croix de Chavaux", end: "Nation", time: 17, difficulty: 0 },
    { start: "Croix de Chavaux", end: "Porte de Bagnolet", time: 11, difficulty: 0 },
    { start: "Croix de Chavaux", end: "Château de Vincennes", time: 9, difficulty: 0 },
    { start: "Château de Vincennes", end: "Nation", time: 12, difficulty: 0 },
    { start: "Porte Dorée", end: "Château de Vincennes", time: 8, difficulty: 0 },
    { start: "Porte Dorée", end: "Nation", time: 8, difficulty: 0 },
    { start: "Porte Dorée", end: "Porte de Bercy", time: 6, difficulty: 0 },
  ]
};



const pointRadius = 6;
const pointsGroup = document.getElementById("points");
const linesGroup = document.getElementById("lines");
const textGroup = document.getElementById("texts");
const singleLineWidth = 4;
const doubleLineWidth = 2;
const doubleLineGap = 2;
const arrowLength = 4;

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

const getCenter = ({start, end}) => {
  return ({
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  })
}

const getCoeff = ({start, end}) => {
  if (start.y - end.y < 0 && start.x - end.x < 0) { 
    if (start.y - end.y > 0 && start.x - end.x > 0) { return 1 }
    return -1 
  } 

  if (end.y - start.y < 0 && end.x - start.x < 0) { 
    if (end.y - start.y > 0 && end.x - start.x > 0) { return 1 }
    return -1 
  } 

  return 1;
};

const getLineAngle = ({start, end}) => {
    const delta = {
      x: Math.abs(start.x - end.x),
      y: Math.abs(start.y - end.y),
    }

    return (Math.atan2(getCoeff({start, end}) * delta.x, delta.y) * (180 / Math.PI));
}

const insertPoint = ({ x, y, name }) => {
  const newPoint = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
  );
  setAttributes(newPoint, {
    x: x - pointRadius,
    y: y - pointRadius,
    'data-name': name,
    class: 'POInt',
  });
  newPoint.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#point");

  pointsGroup.appendChild(newPoint);
};

const insertLine = ({ start, end }) => {
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
    'stroke-width': singleLineWidth,
  });
  linesGroup.appendChild(newLine);
};

const drawNumber = ({ start, end, number }) => {
  const lineCenter = getCenter({start, end});
  const newText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const textNode = document.createTextNode(number);
  newText.appendChild(textNode);
  
  let rotateAngle = getLineAngle({start, end}) + 90;
  if (rotateAngle > 90) {
    rotateAngle = rotateAngle - 180;
  }
  const rotateTransform = `rotate(${rotateAngle} ${lineCenter.x} ${lineCenter.y})`
  
  setAttributes(newText, {
    x: lineCenter.x,
    y: lineCenter.y,
    'dominant-baseline': 'text-after-edge',
    'text-anchor': 'middle',
    transform: `${rotateTransform} translate(0 -2)`,
    class: 'numberText',
  });
  
  textGroup.appendChild(newText);
}

const insertDoubleLine = ({ start, end, difficulty }) => {
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

  const lineCenter = getCenter({start, end})

  
  const length = Math.sqrt(
    Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
  );

  const lineAngle = getLineAngle({start, end});
  
  const lineColor1 = difficulty > 0 ? "#F00" : "#00F";
  const lineColor2 = difficulty < 0 ? "#F00" : "#00F";
  
  setAttributes(newLine1, {
    x1: -doubleLineGap,
    x2: -doubleLineGap,
    y1: (-1 * length) / 2,
    y2: length / 2,
    stroke: lineColor1,
    'stroke-width': doubleLineWidth,
  });
  setAttributes(newLine2, {
    x1: doubleLineGap,
    x2: doubleLineGap,
    y1: (-1 * length) / 2,
    y2: length / 2,
    stroke: lineColor2,
    'stroke-width': doubleLineWidth,
  });
  
  setAttributes(newArrow1, {
    width: arrowLength,
    height: doubleLineWidth * 2,
    x: -doubleLineGap - arrowLength,
    y: arrowLength * 2 + 3,
    transform: 'skewY(60)',
    fill: lineColor1,
  });

  setAttributes(newArrow2, {
    width: arrowLength,
    height: doubleLineWidth * 2,
    x: doubleLineGap,
    y: -arrowLength * 2 - 3,
    transform: 'skewY(60)',
    fill: lineColor2,
  });

  newGroup.appendChild(newLine1);
  newGroup.appendChild(newLine2);
  newGroup.appendChild(newArrow1);
  newGroup.appendChild(newArrow2);

  setAttributes(newGroup, {
       transform: `rotate(${lineAngle} ${lineCenter.x} ${lineCenter.y}) translate(${lineCenter.x} ${lineCenter.y})`,
  })
  
  linesGroup.appendChild(newGroup);
};


const drawDoubleNumber = ({ start, end, numbers }) => {
  const lineCenter = getCenter({start, end});
  const newText1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const newText2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  const textNode1 = document.createTextNode(numbers.top);
  const textNode2 = document.createTextNode(numbers.bottom);
  newText1.appendChild(textNode1);
  newText2.appendChild(textNode2);
  
  let rotateAngle = getLineAngle({start, end}) + 90;
  if (rotateAngle > 90) {
    rotateAngle = rotateAngle - 180;
  }
  const rotateTransform = `rotate(${rotateAngle} ${lineCenter.x} ${lineCenter.y})`
  
  setAttributes(newText1, {
    x: lineCenter.x,
    y: lineCenter.y,
    'dominant-baseline': 'text-after-edge',
    'text-anchor': 'start',
    transform: `${rotateTransform} translate(1 -2)`,
    class: 'numberText numberText--top',
  });
  setAttributes(newText2, {
    x: lineCenter.x,
    y: lineCenter.y,
    'dominant-baseline': 'text-before-edge',
    'text-anchor': 'end',
    transform: `${rotateTransform} translate(-4 3)`,
    class: 'numberText numberText--bottom',
  });
  
  textGroup.appendChild(newText1);
  textGroup.appendChild(newText2);
}

document.addEventListener("click", (event) => {
  console.log(
    `x: ${event.layerX}, y: ${event.layerY}`
  );
});

Object.keys(data.points).forEach((point) => {
  insertPoint(data.points[point]);
});

data.lines.forEach(line => {
  console.log(line)
  if(line.difficulty === 0) {
    drawNumber({
      start: data.points[line.start],
      end: data.points[line.end],
      number: line.time,
    })
    insertLine({
      start: data.points[line.start],
      end: data.points[line.end],
    })
  } else {
    drawDoubleNumber({
      start: data.points[line.start],
      end: data.points[line.end],
      numbers: {
        top: line.difficulty > 0
          ? line.time.hard
          : line.time.easy,
        bottom: line.difficulty > 0
          ? line.time.easy
          : line.time.hard,
      },
    });
    insertDoubleLine({
      start: data.points[line.start],
      end: data.points[line.end],
      difficulty: line.difficulty,
    });
  }
})
