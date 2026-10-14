// CAPTCHA: "select all squares containing a Java applet". All squares are grey.
// The first verification always fails; after that any selection passes.
(function () {
  var grid = document.getElementById("f-captcha");
  var statusEl = document.getElementById("f-captcha-status");
  var selected = {};
  var tries = 0;
  var verified = false;

  for (var i = 0; i < 9; i++) {
    (function (i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Square " + (i + 1));
      b.addEventListener("click", function () {
        if (verified) return;
        selected[i] = !selected[i];
        b.textContent = selected[i] ? "✔" : "";
      });
      grid.appendChild(b);
    })(i);
  }

  function count() { return Object.keys(selected).filter(function (k) { return selected[k]; }).length; }

  function reset() {
    selected = {};
    Array.prototype.forEach.call(grid.children, function (b) { b.textContent = ""; });
  }

  document.getElementById("f-captcha-verify").addEventListener("click", function () {
    if (verified) return;
    if (!count()) { Dialog.alert("Please select at least one square.", "warn"); return; }
    tries++;
    if (tries === 1 && !Game.debug) {
      reset();
      statusEl.textContent = "Incorrect. Please try again.";
      Dialog.alert("One of the squares you selected contained a Java Bean, not a Java applet.\nPlease try again.", "error", "Verification Failed");
      return;
    }
    verified = true;
    statusEl.textContent = "✔ Verified. You are probably not a robot.";
  });

  Game.register({
    validate: function () { return verified ? null : "Please complete the verification."; },
    fill: function () { verified = true; statusEl.textContent = "✔ Verified. You are probably not a robot."; }
  });
})();
