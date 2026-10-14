// Fake AWT modal dialogs. Every call returns a Promise and dialogs queue up one at a time.
var Dialog = (function () {
  var layer = null;
  var queue = Promise.resolve();
  var openCount = 0;

  var ICONS = { warn: "!", error: "X", info: "i", question: "?" };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // opts: { title, message, icon, buttons: [label], grid: [label], extra: Node }
  // Resolves with the clicked label.
  function render(opts) {
    return new Promise(function (resolve) {
      layer = layer || document.getElementById("dialog-layer");
      openCount++;

      var box = el("div", "dialog frame");
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");

      var bar = el("div", "titlebar");
      bar.appendChild(el("span", "title-text", opts.title || "Message"));
      box.appendChild(bar);

      var body = el("div", "dialog-body");
      if (opts.icon) body.appendChild(el("div", "dialog-icon " + opts.icon, ICONS[opts.icon]));
      var msg = el("div", "dialog-msg", opts.message || "");
      if (opts.extra) msg.appendChild(opts.extra);
      body.appendChild(msg);
      box.appendChild(body);

      function close(label) {
        layer.removeChild(box);
        openCount--;
        resolve(label);
      }

      if (opts.grid) {
        var grid = el("div", "dialog-grid");
        opts.grid.forEach(function (label) {
          var b = el("button", "awt-btn", label);
          b.type = "button";
          b.addEventListener("click", function () { close(label); });
          grid.appendChild(b);
        });
        box.appendChild(grid);
      }

      var btns = el("div", "dialog-buttons");
      (opts.buttons || ["OK"]).forEach(function (label) {
        var b = el("button", "awt-btn", label);
        b.type = "button";
        b.addEventListener("click", function () { close(label); });
        btns.appendChild(b);
      });
      box.appendChild(btns);

      layer.appendChild(box);
      var first = btns.querySelector("button");
      if (first) first.focus({ preventScroll: true });
    });
  }

  function show(opts) {
    var p = queue.then(function () { return render(opts); });
    queue = p.catch(function () {});
    return p;
  }

  return {
    show: show,
    alert: function (message, icon, title) {
      return show({ message: message, icon: icon || "info", title: title || "Message" });
    },
    error: function (message) {
      return show({ message: message, icon: "warn", title: "Validation Error" });
    },
    confirm: function (message, yes, no) {
      return show({ message: message, icon: "question", title: "Confirm", buttons: [yes || "Yes", no || "No"] })
        .then(function (label) { return label === (yes || "Yes"); });
    },
    // A fake uncaught Java exception.
    exception: function (name, trace) {
      var pre = el("div", "exception", "Exception in thread \"AWT-EventQueue-0\" " + name + "\n" + trace);
      return show({ title: "Java Console", icon: "error", message: "An unexpected error occurred.", extra: pre });
    },
    isOpen: function () { return openCount > 0; }
  };
})();
