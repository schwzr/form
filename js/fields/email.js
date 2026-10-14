// E-mail: no pasting, and the @ key types © instead. Use the "Insert @ symbol" button.
(function () {
  var input = document.getElementById("f-email");
  var LOOKALIKES = ["@", "©", "®", "ⓐ", "ɑ", "α", "Ӕ", "௮", "∂"];

  function insert(text) {
    var start = input.selectionStart != null ? input.selectionStart : input.value.length;
    var end = input.selectionEnd != null ? input.selectionEnd : input.value.length;
    input.setRangeText(text, start, end, "end");
  }

  function denyPaste(e) {
    e.preventDefault();
    Dialog.alert("Clipboard access denied by SecurityManager.", "warn", "SecurityException");
  }

  input.addEventListener("paste", function (e) { if (!Game.debug) denyPaste(e); });
  input.addEventListener("drop", function (e) { if (!Game.debug) denyPaste(e); });

  input.addEventListener("beforeinput", function (e) {
    if (Game.debug) return;
    if (e.inputType === "insertFromPaste" || e.inputType === "insertFromDrop") denyPaste(e);
  });

  // Swap @ for © in whatever was just typed. Diffing against the previous value (instead of
  // cancelling beforeinput) also works with mobile keyboards, and keeps @s from the button intact.
  var prev = "";
  input.addEventListener("input", function () {
    var cur = input.value;
    if (!Game.debug) {
      var p = 0, s = 0;
      while (p < cur.length && p < prev.length && cur[p] === prev[p]) p++;
      while (s < cur.length - p && s < prev.length - p && cur[cur.length - 1 - s] === prev[prev.length - 1 - s]) s++;
      var typed = cur.slice(p, cur.length - s);
      if (typed.indexOf("@") >= 0) {
        cur = cur.slice(0, p) + typed.replace(/@/g, "©") + cur.slice(cur.length - s);
        input.value = cur;
        input.setSelectionRange(cur.length - s, cur.length - s);
      }
    }
    prev = cur;
  });

  document.getElementById("f-email-at").addEventListener("click", function () {
    var caret = input.selectionStart;
    Dialog.show({
      title: "Character Map",
      message: "Select the @ symbol:",
      grid: Game.shuffle(LOOKALIKES.slice()),
      buttons: ["Cancel"]
    }).then(function (ch) {
      if (ch === "Cancel") return;
      input.focus({ preventScroll: true });
      if (caret != null) input.setSelectionRange(caret, caret);
      insert(ch);
      prev = input.value;
    });
  });

  Game.register({
    validate: function () {
      var v = input.value.trim();
      if (!v) return "Please enter your e-mail address.";
      if (v.indexOf("©") >= 0) return "E-mail addresses cannot contain ©. Did you mean @?";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "\"" + v + "\" is not a valid e-mail address.";
      return null;
    },
    fill: function () { input.value = prev = "john@applet.com"; }
  });
})();
