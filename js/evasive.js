// Makes an element run away from the mouse cursor (or jump away when tapped on touch screens).
// It gets lazier with every escape and gives up after `maxEscapes`, sliding back home.
function makeEvasive(el, opts) {
  opts = opts || {};
  var radius = opts.radius || 80;
  var maxEscapes = opts.maxEscapes || 8;
  var enabled = opts.enabled || function () { return true; };
  var tx = 0, ty = 0, escapes = 0, done = false, lastMove = 0;
  var MARGIN = 8;

  el.classList.add("evasive");

  function apply() {
    el.style.transform = "translate(" + Math.round(tx) + "px," + Math.round(ty) + "px)";
  }

  function moveBy(dx, dy) {
    var r = el.getBoundingClientRect();
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var left = Math.min(Math.max(r.left + dx, MARGIN), vw - r.width - MARGIN);
    var top = Math.min(Math.max(r.top + dy, MARGIN), vh - r.height - MARGIN);
    tx += left - r.left;
    ty += top - r.top;
    apply();
  }

  function jumpRandom() {
    var r = el.getBoundingClientRect();
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var left = MARGIN + Math.random() * Math.max(0, vw - r.width - 2 * MARGIN);
    var top = MARGIN + Math.random() * Math.max(0, vh - r.height - 2 * MARGIN);
    moveBy(left - r.left, top - r.top);
  }

  function escaped() {
    escapes++;
    if (opts.onEscape) opts.onEscape(escapes);
    if (escapes >= maxEscapes) giveUp();
  }

  function giveUp() {
    if (done) return;
    done = true;
    el.classList.add("returning");
    tx = 0; ty = 0;
    apply();
    setTimeout(function () {
      el.classList.remove("returning");
      el.style.transform = "";
    }, 450);
    if (opts.onGiveUp) opts.onGiveUp();
  }

  function distanceToRect(x, y, r) {
    var dx = Math.max(r.left - x, 0, x - r.right);
    var dy = Math.max(r.top - y, 0, y - r.bottom);
    return Math.sqrt(dx * dx + dy * dy);
  }

  document.addEventListener("pointermove", function (e) {
    if (done || e.pointerType !== "mouse" || !enabled()) return;
    var r = el.getBoundingClientRect();
    if (distanceToRect(e.clientX, e.clientY, r) > radius) return;

    var now = Date.now();
    // Count at most one escape per 300ms so a single swipe isn't ten escapes.
    var newEscape = now - lastMove > 300;
    if (newEscape) lastMove = now;

    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var vx = cx - e.clientX, vy = cy - e.clientY;
    var len = Math.sqrt(vx * vx + vy * vy) || 1;
    var jump = Math.max(30, 160 - escapes * 16);
    var before = r.left + "," + r.top;
    moveBy(vx / len * jump, vy / len * jump);

    // Cornered against the edge of the screen: teleport somewhere else.
    var after = el.getBoundingClientRect();
    if (before === after.left + "," + after.top || distanceToRect(e.clientX, e.clientY, after) < radius / 3) {
      jumpRandom();
    }
    if (newEscape) escaped();
  });

  el.addEventListener("touchstart", function (e) {
    if (done || !enabled()) return;
    e.preventDefault();
    jumpRandom();
    escaped();
  }, { passive: false });

  return {
    giveUp: giveUp,
    isDone: function () { return done; },
    flee: function () { if (!done) { jumpRandom(); escaped(); } }
  };
}
