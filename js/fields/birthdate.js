// Date of birth: a year slider from 1 to 9999, months in alphabetical order, and days one at a time.
(function () {
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  // Cycle order is alphabetical, obviously.
  var ORDER = MONTHS.slice().sort();

  var slider = document.getElementById("b-year-slider");
  var yearBox = document.getElementById("b-year");
  var monthBox = document.getElementById("b-month");
  var dayBox = document.getElementById("b-day");

  var year = 1, orderIdx = 0, day = 1, ffCount = 0;

  function render() {
    slider.value = year;
    yearBox.value = year;
    monthBox.value = ORDER[orderIdx];
    dayBox.value = day;
  }

  function setYear(y) { year = Math.min(9999, Math.max(1, y)); render(); }

  slider.addEventListener("input", function () { setYear(parseInt(slider.value, 10)); });
  document.getElementById("b-year-up").addEventListener("click", function () { setYear(year + 1); });
  document.getElementById("b-year-down").addEventListener("click", function () { setYear(year - 1); });

  document.getElementById("b-month-next").addEventListener("click", function () {
    orderIdx = (orderIdx + 1) % ORDER.length;
    render();
  });

  document.getElementById("b-day-next").addEventListener("click", function () {
    day = day % 31 + 1;
    render();
  });

  document.getElementById("b-day-ff").addEventListener("click", function () {
    if (Game.debug) { day = (day + 6) % 31 + 1; render(); return; }
    ffCount++;
    var ask = ffCount % 3 === 0
      ? Dialog.confirm("Fast forwarding skips 7 days. Days you skip cannot be un-skipped.\nAre you REALLY sure?", "Yes", "No")
      : Dialog.confirm("Are you sure you want to fast forward 7 days?", "Yes", "No");
    ask.then(function (yes) {
      if (!yes) return;
      day = (day + 6) % 31 + 1;
      render();
    });
  });

  render();

  Game.register({
    validate: function () {
      var month = MONTHS.indexOf(ORDER[orderIdx]);
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      if (year < 100) {
        // JS Date maps years 0-99 to 1900-1999; nobody that old is filling out forms anyway.
        return "Year " + year + "? Please enter a realistic date of birth.";
      }
      if (day > daysInMonth) return ORDER[orderIdx] + " " + day + " is not a real date. Probably.";
      var birth = new Date(year, month, day);
      var now = new Date();
      if (birth > now) return "You were born in the future? Please check your date of birth.";
      var thirteen = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
      if (birth > thirteen) return "You must be at least 13 years old to fill out this form.";
      if (year < now.getFullYear() - 122) return "Please enter a realistic date of birth.";
      return null;
    },
    fill: function () { year = 1990; orderIdx = ORDER.indexOf("June"); day = 15; render(); }
  });
})();
