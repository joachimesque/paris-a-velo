/*jshint esversion:6 */
const containerElement = document.querySelector('#container');
const svgElement = document.querySelector('svg');
const svgViewbox = svgElement.viewBox.baseVal;
const lineMap = {};
const pointsMap = {};

// GLOBAL EVENT LISTENERS

let _hasBeenDragged = false;

document.addEventListener("mousedown", () => (_hasBeenDragged = false));
document.addEventListener("touchstart", () => (_hasBeenDragged = false));

const addClickEvent = (element, callback) => {
  if (isTouchEnabled()) {
    element.addEventListener("touchend", () => {
      return !_hasBeenDragged && callback();
    });
  }
  if (isClickEnabled()) {
    element.addEventListener("click", () => {
      return !_hasBeenDragged && callback();
    });
  }
};

svgElement.addEventListener("click", event => {
  // event.layerX and event.layerY are non-standard and implemented differently
  // the data returned is different between Chrome and Firefox
  console.info(`Firefox only: clic au point {x: ${event.layerX}, y: ${event.layerY}}`);
});

document.fonts.ready.then(function(fontFaceSet) {

  // POPULATE MAP WITH POINTS AND LINES

  // points
  Object.keys(data.points).forEach(point => {
    // build object of contiguous
    pointsMap[point] = [];

    // draw map points
    drawPoint(data.points[point], point, data.points[point].label);
  });

  // display default points or load saved points (TODO)
  if (data.defaultPointsDisplayed != []) {
    data.defaultPointsDisplayed.forEach((pointToDisplay) => {
      highlightPoint(pointToDisplay);
    });
  }

  // lines
  data.lines.forEach((line, index) => {
    // populate pointsMap object for contiguous screening
    pointsMap[line.start].push(index);
    pointsMap[line.end].push(index);

    // draw map elements
    if (line.difficulty === 0) {
      drawNumber({
        start: data.points[line.start],
        end: data.points[line.end],
        number: line.time,
        align: line.align,
        displayMin: line.displayMin,
        line: index,
        className: line.className,
      });
      drawLine({
        start: data.points[line.start],
        end: data.points[line.end],
        index: index,
        className: line.className,
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
        line: index,
        className: line.className,
      });
      drawDoubleLine({
        start: data.points[line.start],
        end: data.points[line.end],
        difficulty: line.difficulty,
        index: index,
        className: line.className,
      });
    }
  });

  // MAP BOX
  var beforePan;

  beforePan = function(oldPan, newPan) {
    if (oldPan !== newPan) {
      _hasBeenDragged = true;
    }
    var stopHorizontal = false,
      stopVertical = false,
      sizes = this.getSizes(),
      gutterWidth = containerElement.clientWidth,
      gutterHeight = containerElement.clientHeight,
      // Computed variables
      leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
      rightLimit = sizes.width - gutterWidth - sizes.viewBox.x * sizes.realZoom,
      topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) +
      gutterHeight,
      bottomLimit =
      sizes.height - gutterHeight - sizes.viewBox.y * sizes.realZoom;

    customPan = {};
    customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
    customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));

    return customPan;
  };

  var panZoom = (window.panZoom = svgPanZoom("#map", {
    panEnabled: true,
    controlIconsEnabled: false,
    zoomEnabled: true,
    dblClickZoomEnabled: false,
    mouseWheelZoomEnabled: true,
    preventMouseEventsDefault: true,
    zoomScaleSensitivity: 0.4,
    minZoom: 1,
    maxZoom: 6,
    fit: false,
    contain: true,
    center: true,
    refreshRate: "auto",
    eventsListenerElement: null,
    beforePan: beforePan,
  }));

  window.addEventListener("resize", e => {
    panZoom.resize();
    panZoom.fit();
    panZoom.center();
  });

  // Zoom controls
  document.getElementById('mapControl__zoomPlus').addEventListener('click', function(ev) {
    ev.preventDefault();
    panZoom.zoomIn();
  });
  document.getElementById('mapControl__zoomMinus').addEventListener('click', function(ev) {
    ev.preventDefault();
    panZoom.zoomOut();
  });
  document.getElementById('mapControl__zoomReset').addEventListener('click', function(ev) {
    ev.preventDefault();
    panZoom.resetZoom();
    panZoom.center();
  });

  // Pan controls
  document.getElementById('mapControl__panLeft').addEventListener('click', function(ev) {
    ev.preventDefault();
    panZoom.panBy({x: 50, y: 0});
  });
  document.getElementById('mapControl__panRight').addEventListener('click', function(ev) {
    ev.preventDefault();
    panZoom.panBy({x: -50, y: 0});
  });
  document.getElementById('mapControl__panUp').addEventListener('click', function(ev) {
    ev.preventDefault();
    panZoom.panBy({x: 0, y: 50});
  });
  document.getElementById('mapControl__panDown').addEventListener('click', function(ev) {
    ev.preventDefault();
    panZoom.panBy({x: 0, y: -50});
  });
  document.getElementById('mapControl__panCenter').addEventListener('click', function(ev) {
    ev.preventDefault();
    panZoom.center();
  });

  containerElement.addEventListener('keyup', (event) => {
    if(event.key === 'ArrowLeft') {
      panZoom.panBy({x: 50, y: 0});
    }
    if(event.key === 'ArrowRight') {
      panZoom.panBy({x: -50, y: 0});
    }
    if(event.key === 'ArrowUp') {
      panZoom.panBy({x: 0, y: 50});
    }
    if(event.key === 'ArrowDown') {
      panZoom.panBy({x: 0, y: -50});
    }
    if(event.key === '+') {
      panZoom.zoomIn();
    }
    if(event.key === '-') {
      panZoom.zoomOut();
    }
  });

  // MOBILE FOLD
  const interfaceElement = document.querySelector('#interface');
  const foldButton = document.querySelector('button.foldController');
  if (foldButton) {
    foldButton.addEventListener('click', () => {
      interfaceElement.classList.toggle('interface--isFolded');
      foldButton.innerHTML = interfaceElement.classList.contains('interface--isFolded') ?
        '↓' :
        '×';

      setTimeout(() => {
        panZoom.resize();
        panZoom.fit();
        panZoom.center();
      }, 100);
    });
  }

});