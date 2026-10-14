// Terms: the checkbox unlocks only after scrolling to the very bottom.
// On desktop, the scroll position resets whenever the mouse leaves the box.
(function () {
  var text = document.getElementById("f-terms-text");
  var box = document.getElementById("f-terms");

  var CLAUSES = [
    "The User agrees that this form is a form.",
    "The User shall not attempt to un-fill any field once filled, except where required by the Submit button.",
    "All dates of birth are final.",
    "Heights are measured in the unit of the User's choosing, which the Company may mock.",
    "The Company reserves the right to move any field at any time, for any reason, or for no reason.",
    "Clipboard usage is a privilege, not a right.",
    "The @ symbol is licensed, not sold.",
    "The User acknowledges that this applet is running Java and accepts the consequences thereof.",
    "Passwords must satisfy all requirements, including requirements not yet disclosed.",
    "Favorite colors are binding.",
    "The Company is not liable for lost time, lost patience, or lost forms.",
    "By scrolling this far the User has already agreed to nothing in particular.",
    "Fast forwarding is at the User's own risk.",
    "The User waives the right to a reasonable user interface.",
    "Squares may or may not contain applets."
  ];

  var lines = ["TERMS AND CONDITIONS OF USE", "Version 1.0.2b (Final) (2)", ""];
  for (var i = 0; i < 90; i++) {
    lines.push((i + 1) + ". " + CLAUSES[i % CLAUSES.length]);
    if (i % 7 === 6) lines.push("");
  }
  lines.push("", "(You have reached the end. Congratulations.)");
  text.value = lines.join("\n");

  function atBottom() { return text.scrollTop + text.clientHeight >= text.scrollHeight - 4; }

  text.addEventListener("scroll", function () {
    if (!box.disabled) return;
    if (atBottom()) {
      box.disabled = false;
      Game.status("Terms and Conditions read. Allegedly.");
    }
  });

  text.addEventListener("mouseleave", function () {
    if (box.disabled && Game.trolling() && text.scrollTop > 0) {
      text.scrollTop = 0;
      Game.status("You looked away. Terms reset to the top.");
    }
  });

  Game.register({
    validate: function () {
      if (box.disabled) return "Please read the Terms and Conditions (all of them).";
      if (!box.checked) return "You must agree to the Terms and Conditions.";
      return null;
    },
    fill: function () { box.disabled = false; box.checked = true; }
  });
})();
