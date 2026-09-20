// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Testimonial slider — auto-advances with a swipe transition, manual controls reset the timer
  var slider = document.getElementById('testimonialSlider');
  if (slider) {
    var slides = Array.from(slider.querySelectorAll('.t-slide'));
    var dots = Array.from(document.querySelectorAll('.t-dot'));
    var current = 0;
    var autoDelay = 6000;
    var timer = null;

    function goTo(next) {
      next = (next + slides.length) % slides.length;
      if (next === current) return;
      var oldSlide = slides[current];
      var newSlide = slides[next];
      oldSlide.classList.remove('active');
      oldSlide.classList.add('leaving');
      newSlide.classList.add('active');
      dots.forEach(function (d, idx) { d.classList.toggle('active', idx === next); });
      setTimeout(function () { oldSlide.classList.remove('leaving'); }, 650);
      current = next;
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(function () { goTo(current + 1); }, autoDelay);
    }
    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function manualGo(next) {
      goTo(next);
      startAuto();
    }

    slider.querySelector('.t-prev').addEventListener('click', function () { manualGo(current - 1); });
    slider.querySelector('.t-next').addEventListener('click', function () { manualGo(current + 1); });
    dots.forEach(function (d, idx) { d.addEventListener('click', function () { manualGo(idx); }); });

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    startAuto();
  }

  // Pill single-select groups
  document.querySelectorAll('.pill-group').forEach(function (group) {
    var multi = group.hasAttribute('data-multi');
    group.querySelectorAll('.pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        if (!multi) {
          group.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('selected'); });
        }
        pill.classList.toggle('selected');
        var input = group.parentElement.querySelector('input[type=hidden]');
        if (input) {
          var selected = Array.from(group.querySelectorAll('.pill.selected')).map(function (p) { return p.textContent.trim(); });
          input.value = selected.join(', ');
        }
      });
    });
  });

  // Application form fake-submit (no backend wired yet)
  var appForm = document.getElementById('application-form');
  if (appForm) {
    appForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = appForm.querySelector('button[type=submit]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

      var data = new URLSearchParams(new FormData(appForm)).toString();
      fetch(appForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body: data
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (result.success) {
            appForm.style.display = 'none';
            var success = document.getElementById('form-success');
            if (success) success.classList.add('show');
            window.scrollTo({ top: success.offsetTop - 140, behavior: 'smooth' });
          } else {
            throw new Error(result.message || 'Submission failed');
          }
        })
        .catch(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
          alert('Something went wrong sending your application. Please try again, or email directly.');
        });
    });
  }

  // Simple newsletter/contact bar on home page (footer mini form on index)
  var miniForm = document.getElementById('mini-contact-form');
  if (miniForm) {
    miniForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = miniForm.querySelector('button');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending...';

      var data = new URLSearchParams(new FormData(miniForm)).toString();
      fetch(miniForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body: data
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (result.success) {
            btn.textContent = 'Sent';
            setTimeout(function () { btn.textContent = original; btn.disabled = false; miniForm.reset(); }, 2200);
          } else {
            throw new Error(result.message || 'Submission failed');
          }
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = original;
          alert('Something went wrong sending your message. Please try again, or email directly.');
        });
    });
  }
});
