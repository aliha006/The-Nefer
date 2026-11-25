// Init AOS
AOS.init({ duration: 900, once: true, easing: 'ease-in-out', offset: 60 });

// Init Lucide Icons
lucide.createIcons();

(function () {

    const preloader = document.getElementById("preloader");

    if (!preloader) return;

    let isHidden = false;

    // Reveal website
    function hidePreloader() {

        if (isHidden) return;

        isHidden = true;

        // Allow the animation to finish
        const elapsed = Date.now() - startTime;
        const minimumTime = 4800;

        const remaining = Math.max(0, minimumTime - elapsed);

        setTimeout(function () {

            preloader.classList.add("loaded");

            document.body.style.overflow = "";

            setTimeout(function () {
                preloader.remove();
            }, 800);

        }, remaining);

    }

    const startTime = Date.now();

    // Lock scrolling while preloader is visible
    document.body.style.overflow = "hidden";

    // Normal page loading
    if (document.readyState === "complete") {

        hidePreloader();

    } else {

        window.addEventListener("load", hidePreloader, { once: true });

    }

    // Safety fallback: never leave the website covered indefinitely
    setTimeout(hidePreloader, 6500);

})();


// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
const logoText = document.getElementById('logo-text');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    navbar.querySelectorAll('.nav-link').forEach(l => {
      l.style.color = document.documentElement.classList.contains('dark') ? '#CBD5E1' : '#0F172A';
    });
  } else {
    navbar.classList.remove('scrolled');
    navbar.querySelectorAll('.nav-link').forEach(l => { l.style.color = ''; });
  }
});

// ---- MOBILE MENU ----
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  menuOpen.classList.toggle('hidden', !isOpen);
  menuClose.classList.toggle('hidden', isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuOpen.classList.remove('hidden');
    menuClose.classList.add('hidden');
  });
});


// ---- SCROLL TOP ----
const scrollBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- FAQ ACCORDION ----
function toggleFAQ(el) {
  const answer = el.nextElementSibling;
  const isOpen = answer.classList.contains('open');

  document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question.active').forEach(q => q.classList.remove('active'));

  if (!isOpen) {
    answer.classList.add('open');
    el.classList.add('active');
  }
  lucide.createIcons();
}

// ---- ANIMATED COUNTERS ----
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const current = Math.floor(progress * target);
    el.textContent = target > 999 ? current.toLocaleString() + '+' : current + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target > 999 ? target.toLocaleString() + '+' : target + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ---- TESTIMONIAL SLIDER ----
const track = document.getElementById('testimonial-track');
if (track) {

  const slides = track.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slider-dots');
  let currentSlide = 0;
  let slidesPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;

  function updateSlider() {
    slidesPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const offset = currentSlide * (100 / slidesPerView);
    track.style.transform = `translateX(-${offset}%)`;
    dotsContainer.querySelectorAll('button').forEach((d, i) => {
      d.classList.toggle('bg-red-600', i === currentSlide);
      d.classList.toggle('bg-gray-300', i !== currentSlide);
      d.classList.toggle('w-6', i === currentSlide);
      d.classList.toggle('w-2.5', i !== currentSlide);
    });
  }

  const totalSlides = Math.ceil(slides.length / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1));
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.className = `h-2.5 rounded-full transition-all ${i === 0 ? 'bg-red-600 w-6' : 'bg-gray-300 dark:bg-slate-600 w-2.5'}`;
    dot.addEventListener('click', () => { currentSlide = i; updateSlider(); });
    dotsContainer.appendChild(dot);
  }

  document.getElementById('slide-prev').addEventListener('click', () => {
    currentSlide = Math.max(0, currentSlide - 1);
    updateSlider();
  });
  document.getElementById('slide-next').addEventListener('click', () => {
    currentSlide = Math.min(slides.length - 1, currentSlide + 1);
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);

  // Auto-play slider
  setInterval(() => {
    currentSlide = currentSlide >= slides.length - slidesPerView ? 0 : currentSlide + 1;
    updateSlider();
  }, 5000);
}

// ---- THE NEFER FORM SUBMISSION ----

document.getElementById('appt-form').addEventListener('submit', async (e) => {

  e.preventDefault();

  const form = e.target;
  const button = document.getElementById('submit-btn');

  button.disabled = true;
  button.textContent = 'Sending...';

  try {

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    });

    const result = await response.json();

    if (result.success) {
      showToast('Thank you for contacting THE NEFER! Your inquiry has been received.');
      form.reset();
    } else {
      showToast('Unable to submit your inquiry. Please try again.');
    }

  } catch (error) {

    showToast('Something went wrong. Please check your internet connection.');

  } finally {

    button.disabled = false;
    button.innerHTML = '<i data-lucide="send" class="w-5 h-5"></i> Send Project Inquiry';

    if (window.lucide) {
      lucide.createIcons();
    }

  }

});

// Re-init icons after dynamic content
lucide.createIcons();

document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".testimonial-slide");
    const dots = document.querySelectorAll(".testimonial-dot");

    let currentSlide = 0;
    let testimonialInterval;

    function showTestimonial(index) {

        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        dots.forEach(dot => {
            dot.classList.remove("active");
        });

        slides[index].classList.add("active");
        dots[index].classList.add("active");

        currentSlide = index;
    }

    function nextTestimonial() {

        let next = (currentSlide + 1) % slides.length;

        showTestimonial(next);

    }

    function startAutoplay() {

        clearInterval(testimonialInterval);

        testimonialInterval = setInterval(nextTestimonial, 4500);

    }

    dots.forEach((dot, index) => {

        dot.addEventListener("click", function () {

            showTestimonial(index);
            startAutoplay();

        });

    });

    showTestimonial(0);
    startAutoplay();

});
// ===================== CONTACT FORM SUBMISSION =====================

const appointmentForm = document.getElementById("appt-form");

if (appointmentForm) {

    appointmentForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const submitBtn = document.getElementById("submit-btn");
        const toast = document.getElementById("toast");
        const toastMsg = document.getElementById("toast-msg");

        // Prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";

        try {

            const formData = new FormData(appointmentForm);

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {

                // Clear all form fields
                appointmentForm.reset();

                // Success notification
                toastMsg.textContent = "Your message has been sent successfully!";

                toast.classList.remove("translate-x-full", "opacity-0");

                // Hide notification after 4 seconds
                setTimeout(() => {
                    toast.classList.add("translate-x-full", "opacity-0");
                }, 4000);

            } else {

                throw new Error(result.message || "Submission failed.");

            }

        } catch (error) {

            console.error("Form Error:", error);

            toastMsg.textContent = "Something went wrong. Please try again.";

            toast.classList.remove("translate-x-full", "opacity-0");

            setTimeout(() => {
                toast.classList.add("translate-x-full", "opacity-0");
            }, 4000);

        }

        // Restore submit button
        submitBtn.disabled = false;

        submitBtn.innerHTML = `
            Send Message
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
        `;

        if (window.lucide) {
            lucide.createIcons();
        }

    });

}
