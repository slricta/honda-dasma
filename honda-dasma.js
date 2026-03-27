/* 

JavaScript Document

TemplateMo 611 Maison Doree

https://templatemo.com/tm-611-maison-doree

*/

// Header scroll effect
const header = document.getElementById('header');
function syncHeaderHeight() {
   if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
   }
}

window.addEventListener('scroll', () => {
   if (window.scrollY > 100) {
      header.classList.add('scrolled');
   } else {
      header.classList.remove('scrolled');
   }

   syncHeaderHeight();
});

window.addEventListener('resize', syncHeaderHeight);
window.addEventListener('load', syncHeaderHeight);
syncHeaderHeight();

// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

function openMobileNav() {
   mobileNav.classList.add('active');
   mobileOverlay.classList.add('active');
   document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
   mobileNav.classList.remove('active');
   mobileOverlay.classList.remove('active');
   document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMobileNav);
mobileNavClose.addEventListener('click', closeMobileNav);
mobileOverlay.addEventListener('click', closeMobileNav);

mobileNavLinks.forEach(link => {
   link.addEventListener('click', closeMobileNav);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href === '#') {
         window.scrollTo({
            top: 0,
            behavior: 'smooth'
         });
         return;
      }
      const target = document.querySelector(href);
      if (target) {
         const headerHeight = header.offsetHeight;
         const targetPosition = target.offsetTop - headerHeight;
         window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
         });
      }
   });
});

// Highlight nav links based on the section in view.
const sectionNavLinks = document.querySelectorAll('.nav-main a[href^="#"], .mobile-nav-links a[href^="#"]');
const trackedSectionIds = [...new Set([...sectionNavLinks]
   .map(link => link.getAttribute('href'))
   .filter(href => href && href !== '#'))];
const trackedSections = trackedSectionIds
   .map(id => document.querySelector(id))
   .filter(Boolean);

function setActiveNavLink(activeId) {
   sectionNavLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === activeId;
      link.classList.toggle('active', isActive);

      if (isActive) {
         link.setAttribute('aria-current', 'page');
      } else {
         link.removeAttribute('aria-current');
      }
   });
}

function updateActiveNavOnScroll() {
   if (!trackedSections.length) return;

   const headerHeight = header ? header.offsetHeight : 0;
   const scrollPosition = window.scrollY + headerHeight + 120;
   let activeId = null;

   trackedSections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
         activeId = `#${section.id}`;
      }
   });

   if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      activeId = `#${trackedSections[trackedSections.length - 1].id}`;
   }

   setActiveNavLink(activeId);
}

window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
window.addEventListener('resize', updateActiveNavOnScroll);
window.addEventListener('load', updateActiveNavOnScroll);
updateActiveNavOnScroll();

// Reusable hero slideshow initializer (works for home and individual vehicle pages)
const mobileHeroImageFolder = 'images/samples/mobile';
const mobileHeroMediaQuery = window.matchMedia('(max-width: 768px)');

function getMobileHeroImageSrc(desktopSrc) {
   if (!desktopSrc) {
      return desktopSrc;
   }

   const filename = desktopSrc.split('/').pop();
   if (!filename) {
      return desktopSrc;
   }

   const extensionIndex = filename.lastIndexOf('.');
   const hasExtension = extensionIndex !== -1;
   const baseName = hasExtension ? filename.slice(0, extensionIndex) : filename;
   const extension = hasExtension ? filename.slice(extensionIndex) : '';

   // Home page pattern: images/samples/<name>.jpg -> images/samples/mobile/<name>-mobile.jpg
   if (desktopSrc.includes('images/samples/')) {
      return `${mobileHeroImageFolder}/${baseName}-mobile${extension}`;
   }

   // Vehicle page pattern: images/cars/<model>/<name>.jpg -> images/cars/<model>/<name>-mobile.jpg
   if (desktopSrc.includes('images/cars/')) {
      return desktopSrc.replace(filename, `${baseName}-mobile${extension}`);
   }

   return desktopSrc;
}

function initHeroSlideshows() {
   const heroSections = document.querySelectorAll('.hero');
   if (!heroSections.length) return;

   heroSections.forEach((heroSection) => {
      const slides = [...heroSection.querySelectorAll('.hero-slide')];
      if (!slides.length) return;

      const dots = [...heroSection.querySelectorAll('.dot')];
      const heroTitle = heroSection.querySelector('[data-hero-title], #heroTitle, .hero-model-title');
      const heroDescription = heroSection.querySelector('[data-hero-description], #heroDescription, .hero-model-description');
      const carouselPrev = heroSection.querySelector('.carousel-prev');
      const carouselNext = heroSection.querySelector('.carousel-next');
      const heroSlideImages = heroSection.querySelectorAll('.hero-slide img');
      const slideVideos = slides
         .map((slide) => slide.querySelector('video'))
         .filter(Boolean);

      let currentSlide = slides.findIndex((slide) => slide.classList.contains('active'));
      if (currentSlide < 0) currentSlide = 0;
      let slideTimer;

      function syncHeroImagesForViewport() {
         const useMobileHeroImage = mobileHeroMediaQuery.matches;

         heroSlideImages.forEach((img) => {
            if (!img.dataset.desktopSrc) {
               img.dataset.desktopSrc = img.getAttribute('src');
            }

            if (useMobileHeroImage) {
               if (!img.dataset.mobileSrc) {
                  // Optional override for custom mobile file names per slide.
                  const customMobileSrc = img.getAttribute('data-mobile-src');
                  img.dataset.mobileSrc = customMobileSrc || getMobileHeroImageSrc(img.dataset.desktopSrc);
               }

               if (img.dataset.mobileSrc !== img.dataset.desktopSrc && !img.dataset.mobileFallbackBound) {
                  img.addEventListener('error', () => {
                     img.setAttribute('src', img.dataset.desktopSrc || img.getAttribute('src'));
                  });
                  img.dataset.mobileFallbackBound = 'true';
               }

               img.setAttribute('src', img.dataset.mobileSrc);
            } else {
               img.setAttribute('src', img.dataset.desktopSrc);
            }
         });
      }

      function updateDots() {
         if (!dots.length) return;
         dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
         });
      }

      function updateHeroText() {
         if (!heroTitle && !heroDescription) return;

         const activeSlide = slides[currentSlide];
         const nextTitle = activeSlide?.dataset?.title || '';
         const nextDescription = activeSlide?.dataset?.description || '';

         if (heroTitle) heroTitle.textContent = nextTitle;
         if (heroDescription) heroDescription.textContent = nextDescription;
      }

      function syncSlideVideos() {
         slideVideos.forEach((video) => {
            const parentSlide = video.closest('.hero-slide');
            const isActive = parentSlide && parentSlide.classList.contains('active');

            if (isActive) {
               video.currentTime = 0;
               video.play().catch(() => {});
            } else {
               video.pause();
            }
         });
      }

      function scheduleAutoAdvance() {
         clearTimeout(slideTimer);
         if (slides.length <= 1) return;

         const activeSlide = slides[currentSlide];
         const activeVideo = activeSlide.querySelector('video');
         // Let video slides advance on the video's ended event.
         if (activeVideo) return;

         slideTimer = setTimeout(() => {
            changeSlide();
         }, 5000);
      }

      function changeSlide(nextIndex = null) {
         const previousSlide = currentSlide;
         currentSlide = nextIndex === null
            ? (currentSlide + 1) % slides.length
            : (nextIndex + slides.length) % slides.length;

         slides[previousSlide].classList.remove('active');
         slides[currentSlide].classList.add('active');

         updateDots();
         updateHeroText();
         syncSlideVideos();
         scheduleAutoAdvance();
      }

      carouselPrev?.addEventListener('click', () => {
         changeSlide(currentSlide - 1);
      });

      carouselNext?.addEventListener('click', () => {
         changeSlide();
      });

      dots.forEach((dot, index) => {
         dot.addEventListener('click', () => {
            const dotIndex = Number.isNaN(parseInt(dot.dataset.slide, 10))
               ? index
               : parseInt(dot.dataset.slide, 10);
            changeSlide(dotIndex);
         });
      });

      slideVideos.forEach((video) => {
         video.addEventListener('ended', () => {
            const activeSlide = slides[currentSlide];
            if (activeSlide && activeSlide.contains(video)) {
               changeSlide();
            }
         });
      });

      updateDots();
      updateHeroText();
      syncHeroImagesForViewport();
      syncSlideVideos();
      scheduleAutoAdvance();

      mobileHeroMediaQuery.addEventListener('change', syncHeroImagesForViewport);
   });
}

initHeroSlideshows();

// Explore button
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
   exploreBtn.addEventListener('click', () => {
      const vehiclesSection = document.getElementById('vehicles');
      if (vehiclesSection) {
         vehiclesSection.scrollIntoView({ behavior: 'smooth' });
      }
   });
}

// Form submission
const form = document.getElementById('appointmentForm');
if (form) {
   form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for your inquiry! We will contact you within 24 hours to confirm your appointment.');
      form.reset();
   });
}

// Intersection Observer for scroll animations
const observerOptions = {
   threshold: 0.1,
   rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         entry.target.style.opacity = '1';
         entry.target.style.transform = 'translateY(0)';
      }
   });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section:not(.hero)').forEach(section => {
   section.style.opacity = '0';
   section.style.transform = 'translateY(30px)';
   section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
   observer.observe(section);
});

// Video hover functionality for vehicle items
document.querySelectorAll('[data-video]').forEach(item => {
   const video = item.querySelector('.vehicle-video');
   if (!video) return;

   item.addEventListener('mouseenter', () => {
      video.currentTime = 0;
      video.play();
      item.classList.add('playing');
   });

   item.addEventListener('mouseleave', () => {
      video.pause();
      item.classList.remove('playing');
   });
});