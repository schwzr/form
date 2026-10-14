// Full name: runs away from the cursor until it gets tired.
(function () {
  var input = document.getElementById("f-name");
  var lastPointer = 0;

  var ev = Game.debug ? null : makeEvasive(input, {
    radius: 80,
    maxEscapes: 12,
    enabled: Game.trolling,
    onEscape: function (n) {
      var taunts = ["Nope.", "Too slow.", "Missed.", "Almost!", "Try again.", "Getting tired..."];
      Game.status(taunts[Math.min(taunts.length - 1, Math.floor(n / 2))]);
    },
    onGiveUp: function () { Game.status("Fine. You can type your name now."); }
  });

  document.addEventListener("pointerdown", function () { lastPointer = Date.now(); });

  // No sneaking in with the Tab key.
  input.addEventListener("focus", function () {
    if (ev && !ev.isDone() && Game.trolling() && Date.now() - lastPointer > 500) {
      input.blur();
      ev.flee();
    }
  });

  Game.register({
    validate: function () {
      var v = input.value.trim();
      if (!v) return "Please enter your full name.";
      if (v.indexOf(" ") < 0) return "Please enter your FULL name (first and last).";
      return null;
    },
    fill: function () {
      if (ev) ev.giveUp();
      input.value = "John Applet";
    }
  });
})();
