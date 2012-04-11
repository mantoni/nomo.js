var EventEmitter = require('events').EventEmitter;

var textArea  = document.createElement('textarea');
textArea.cols = 120;
textArea.rows = 30;
textArea.style.backgroundColor = '#000';
textArea.style.color = '#eee';
textArea.style.fontFamily = 'Monaco, monospace';
textArea.style.fontSize = '11px';
document.body.appendChild(textArea);


window.global = window;


var stream = {
  write: function (m) {
    textArea.value = textArea.value + m;
  }
};

// http://dbaron.org/log/20100309-faster-timeouts
var timeouts = [];
var messageName = "process.nextTick";
window.addEventListener("message", function (event) {
  if (event.source == window && event.data == messageName) {
    event.stopPropagation();
    if (timeouts.length > 0) {
      timeouts.shift()();
    }
  }
}, true);

var process = new EventEmitter();
process.env = {};
process.stdout = stream;
process.stderr = stream;
process.nextTick = function (fn) {
  timeouts.push(fn);
  window.postMessage(messageName, "*");
};
process.reallyExit = process.exit = function (code) {
  stream.write('EXIT ' + code + '\n');
};
window.process = process;
