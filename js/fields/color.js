// Favorite color: every CSS color name, in random order, each written in its own color on itself.
(function () {
  var NAMES = ("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet " +
    "brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue " +
    "darkcyan darkgoldenrod darkgray darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid " +
    "darkred darksalmon darkseagreen darkslateblue darkslategray darkturquoise darkviolet deeppink " +
    "deepskyblue dimgray dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold " +
    "goldenrod gray green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush " +
    "lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen " +
    "lightpink lightsalmon lightseagreen lightskyblue lightslategray lightsteelblue lightyellow lime " +
    "limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen " +
    "mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose " +
    "moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen " +
    "paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red " +
    "rosybrown royalblue saddlebrown salmon seagreen seashell sienna silver skyblue slateblue slategray " +
    "snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow " +
    "yellowgreen transparent").split(" ");

  var sel = document.getElementById("f-color");

  var none = document.createElement("option");
  none.value = "";
  none.textContent = "(please select)";
  sel.appendChild(none);

  (Game.debug ? NAMES.slice() : Game.shuffle(NAMES.slice())).forEach(function (n) {
    var o = document.createElement("option");
    o.value = n;
    o.textContent = n;
    if (!Game.debug) { o.style.color = n; o.style.backgroundColor = n; }
    sel.appendChild(o);
  });

  sel.addEventListener("change", function () {
    if (Game.debug) return;
    sel.style.color = sel.value || "";
    sel.style.backgroundColor = sel.value || "";
  });

  Game.register({
    validate: function () {
      if (!sel.value) return "Please select your favorite color.";
      if (sel.value === "transparent") return "\"transparent\" is not a color. Please select a real color.";
      return null;
    },
    fill: function () { sel.value = "rebeccapurple"; sel.dispatchEvent(new Event("change")); }
  });
})();
