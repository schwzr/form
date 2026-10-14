// Password: the rules are revealed one at a time, only after you fail them.
// Confirm password shows a "helpful" preview of what you typed... reversed.
(function () {
  var pass = document.getElementById("f-pass");
  var pass2 = document.getElementById("f-pass2");
  var list = document.getElementById("f-pass-rules");
  var preview = document.getElementById("f-pass2-preview");
  var MONTHS = /january|february|march|april|may|june|july|august|september|october|november|december/i;

  function isPrime(n) {
    if (n < 2) return false;
    for (var i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }

  var RULES = [
    { text: "Must be at least 8 characters long.", test: function (p) { return p.length >= 8; } },
    { text: "Must contain a number.", test: function (p) { return /\d/.test(p); } },
    {
      text: "Must contain a prime number.",
      test: function (p) { return (p.match(/\d+/g) || []).some(function (n) { return n.length < 10 && isPrime(+n); }); }
    },
    {
      text: "Must contain the current hour (24-hour clock).",
      test: function (p) { return p.indexOf(String(new Date().getHours())) >= 0; }
    },
    { text: "Must contain a month of the year (in English).", test: function (p) { return MONTHS.test(p); } }
  ];
  var revealed = 0;

  function renderRules() {
    list.innerHTML = "";
    for (var i = 0; i < revealed; i++) {
      var li = document.createElement("li");
      li.textContent = RULES[i].text;
      if (RULES[i].test(pass.value)) li.className = "ok";
      list.appendChild(li);
    }
  }

  pass.addEventListener("input", renderRules);
  pass2.addEventListener("input", function () {
    preview.textContent = pass2.value.split("").reverse().join("");
  });

  Game.register({
    validate: function () {
      var p = pass.value;
      if (!p) return "Please choose a password.";
      for (var i = 0; i < RULES.length; i++) {
        if (!RULES[i].test(p)) {
          revealed = Math.max(revealed, i + 1);
          renderRules();
          return "Your password does not meet the requirements:\n\n" + RULES[i].text;
        }
      }
      return null;
    },
    fill: function () {
      pass.value = "PassJune" + new Date().getHours() + "x7";
      revealed = RULES.length;
      renderRules();
    }
  });

  Game.register({
    validate: function () {
      if (!pass2.value) return "Please confirm your password.";
      if (pass2.value !== pass.value) return "Passwords do not match.";
      return null;
    },
    fill: function () {
      pass2.value = pass.value;
      preview.textContent = pass2.value.split("").reverse().join("");
    }
  });
})();
