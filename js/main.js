(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function formatNumber(n) {
    return n.toLocaleString("th-TH");
  }

  function animateValue(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (target - start) * eased);
      el.textContent = formatNumber(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(step);
  }

  var statsObserved = false;
  var statEls = document.querySelectorAll(".stat-value[data-count]");

  if (statEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !statsObserved) {
            statsObserved = true;
            statEls.forEach(function (el) {
              var target = parseInt(el.getAttribute("data-count"), 10);
              animateValue(el, target, 1400);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    var section = document.getElementById("stats");
    if (section) observer.observe(section);
  } else {
    statEls.forEach(function (el) {
      el.textContent = formatNumber(parseInt(el.getAttribute("data-count"), 10));
    });
  }
})();
