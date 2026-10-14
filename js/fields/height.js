// Height: absurd units and a keypad that shuffles itself after every press.
(function () {
  var UNITS = [
    { name: "furlongs", cm: 20116.8 },
    { name: "millimeters", cm: 0.1 },
    { name: "hands", cm: 10.16 },
    { name: "cubits", cm: 45.72 },
    { name: "bananas", cm: 17.78 },
    { name: "smoots", cm: 170.18 },
    { name: "light-nanoseconds", cm: 29.9792458 }
  ];
  var KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "⌫"];

  var unitSel = document.getElementById("h-unit");
  var valueBox = document.getElementById("h-value");
  var keypad = document.getElementById("h-keypad");
  var stick = document.getElementById("h-stick");
  var cmLabel = document.getElementById("h-cm");
  var value = "";
  var presses = 0;

  UNITS.forEach(function (u, i) {
    var o = document.createElement("option");
    o.value = i;
    o.textContent = u.name;
    unitSel.appendChild(o);
  });

  function cm() {
    var v = parseFloat(value);
    return isNaN(v) ? 0 : v * UNITS[unitSel.value].cm;
  }

  function render() {
    valueBox.value = value;
    var h = cm();
    cmLabel.textContent = (h > 9999 ? "9999+" : Math.round(h)) + " cm";
    // Ruler shows 0-250 cm.
    stick.style.height = Math.min(170, Math.max(0, h / 250 * 170)) + "px";
  }

  function buildKeypad() {
    keypad.innerHTML = "";
    var keys = Game.debug ? KEYS : Game.shuffle(KEYS.slice());
    keys.forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = k;
      b.addEventListener("click", function () { press(k); });
      keypad.appendChild(b);
    });
  }

  function press(k) {
    if (k === "⌫") value = value.slice(0, -1);
    else if (k === "." && value.indexOf(".") >= 0) return;
    else if (value.length < 9) value += k;
    render();
    buildKeypad();

    presses++;
    if (!Game.debug && presses % 10 === 0) {
      Dialog.show({ title: "Session Timeout", icon: "question", message: "Are you still there?", buttons: ["Yes", "Still yes"] });
    }
  }

  unitSel.addEventListener("change", render);
  buildKeypad();
  render();

  Game.register({
    validate: function () {
      if (!value) return "Please enter your height.";
      var h = cm();
      var unit = UNITS[unitSel.value].name;
      if (h < 50 || h > 250) {
        return value + " " + unit + " is " + (h < 1 ? h.toFixed(3) : Math.round(h)) +
          " cm. Please enter a realistic height (50–250 cm).";
      }
      return null;
    },
    fill: function () { unitSel.value = "5"; value = "1.05"; render(); }
  });
})();
