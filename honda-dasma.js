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

// Hero image slideshow
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
const heroTitle = document.getElementById('heroTitle');
const heroDescription = document.getElementById('heroDescription');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const exploreBtn = document.getElementById('exploreBtn');
const heroVideo = document.querySelector('.hero-slide video');
const heroSlideImages = document.querySelectorAll('.hero-slide img');
const mobileHeroImageFolder = 'images/samples/mobile';
const mobileHeroMediaQuery = window.matchMedia('(max-width: 768px)');
let currentSlide = 0;
let slideTimer;

function getMobileHeroImageSrc(desktopSrc) {
   const filename = desktopSrc.split('/').pop();
   if (!filename) {
      return desktopSrc;
   }

   const extensionIndex = filename.lastIndexOf('.');
   if (extensionIndex === -1) {
      return `${mobileHeroImageFolder}/${filename}-mobile`;
   }

   const baseName = filename.slice(0, extensionIndex);
   const extension = filename.slice(extensionIndex);
   return `${mobileHeroImageFolder}/${baseName}-mobile${extension}`;
}

function syncHeroImagesForViewport() {
   const useMobileHeroImage = mobileHeroMediaQuery.matches;

   heroSlideImages.forEach((img) => {
      if (!img.dataset.desktopSrc) {
         img.dataset.desktopSrc = img.getAttribute('src');
      }

      if (useMobileHeroImage) {
         if (!img.dataset.mobileSrc) {
            img.dataset.mobileSrc = getMobileHeroImageSrc(img.dataset.desktopSrc);
         }
         img.setAttribute('src', img.dataset.mobileSrc);
      } else {
         img.setAttribute('src', img.dataset.desktopSrc);
      }
   });
}

function scheduleAutoAdvance() {
   clearTimeout(slideTimer);

   if (currentSlide === 0 && heroVideo) {
      return;
   }

   slideTimer = setTimeout(changeSlide, 5000);
}

function updateDots() {
   dots.forEach(dot => dot.classList.remove('active'));
   dots[currentSlide].classList.add('active');
}

function changeSlide(newSlide = null) {
   const previousSlide = currentSlide;

   if (newSlide !== null) {
      currentSlide = newSlide;
   } else {
      currentSlide = (currentSlide + 1) % slides.length;
   }

   slides[previousSlide].classList.remove('active');

   // Fade out text
   heroTitle.style.opacity = '0';
   heroDescription.style.opacity = '0';

   setTimeout(() => {
      heroTitle.textContent = slides[currentSlide].dataset.title;
      heroDescription.textContent = slides[currentSlide].dataset.description;
      heroTitle.style.opacity = '1';
      heroDescription.style.opacity = '1';
   }, 500);

   slides[currentSlide].classList.add('active');
   updateDots();

   // Keep hero video in sync with the active slide.
   if (heroVideo) {
      if (currentSlide === 0) {
         heroVideo.currentTime = 0;
         heroVideo.play().catch(() => {});
      } else {
         heroVideo.pause();
      }
   }

   scheduleAutoAdvance();
}

// Arrow navigation
carouselPrev.addEventListener('click', () => {
   const targetSlide = (currentSlide - 1 + slides.length) % slides.length;
   changeSlide(targetSlide);
});

carouselNext.addEventListener('click', () => {
   changeSlide();
});

// Dot navigation
dots.forEach(dot => {
   dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide);
      changeSlide(slideIndex);
   });
});

// Explore button
if (exploreBtn) {
   exploreBtn.addEventListener('click', () => {
      const vehiclesSection = document.getElementById('vehicles');
      if (vehiclesSection) {
         vehiclesSection.scrollIntoView({ behavior: 'smooth' });
      }
   });
}

if (heroVideo) {
   heroVideo.addEventListener('ended', () => {
      if (currentSlide === 0) {
         changeSlide();
      }
   });

   heroVideo.currentTime = 0;
   heroVideo.play().catch(() => {});
}

syncHeroImagesForViewport();
mobileHeroMediaQuery.addEventListener('change', syncHeroImagesForViewport);

scheduleAutoAdvance();

// Form submission
const form = document.getElementById('appointmentForm');
form.addEventListener('submit', function (e) {
   e.preventDefault();
   alert('Thank you for your inquiry! We will contact you within 24 hours to confirm your appointment.');
   form.reset();
});

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