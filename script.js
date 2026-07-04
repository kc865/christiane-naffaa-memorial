(function () {
  const track = document.getElementById('gallery-track');
  const lightbox = document.getElementById('lightbox');
  const lightboxStage = document.querySelector('.lightbox__stage');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxThumbs = document.getElementById('lightbox-thumbs');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');

  let images = window.GALLERY_IMAGES || [];
  let currentIndex = 0;
  let thumbEls = [];

  buildGallery(images);
  buildThumbs(images);
  initScrollCue();

  function initScrollCue() {
    const scrollCue = document.querySelector('.scroll-cue');
    const gallerySection = document.getElementById('gallery-section');
    if (!scrollCue || !gallerySection || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      const isBelowViewport = entry.boundingClientRect.top > 0;
      scrollCue.classList.toggle('is-visible', !entry.isIntersecting && isBelowViewport);
    });
    observer.observe(gallerySection);
  }

  function buildGallery(files) {
    if (!files.length) return;

    // Duplicate the list once so the CSS animation (translateX -50%) loops seamlessly.
    const loopFiles = files.concat(files);

    loopFiles.forEach((file, i) => {
      const originalIndex = i % files.length;
      const item = document.createElement('div');
      item.className = 'gallery__item';
      item.dataset.index = String(originalIndex);

      const img = document.createElement('img');
      img.src = 'pics/' + file;
      img.alt = 'Photo souvenir';
      img.loading = 'lazy';

      item.appendChild(img);
      item.addEventListener('click', () => openLightbox(originalIndex));
      track.appendChild(item);
    });
  }

  function buildThumbs(files) {
    files.forEach((file, index) => {
      const thumb = document.createElement('img');
      thumb.className = 'lightbox__thumb';
      thumb.src = 'pics/' + file;
      thumb.alt = 'Aller à la photo ' + (index + 1);
      thumb.loading = 'lazy';
      thumb.addEventListener('click', () => {
        currentIndex = index;
        updateLightboxImage();
      });
      lightboxThumbs.appendChild(thumb);
      thumbEls.push(thumb);
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const file = images[currentIndex];
    lightboxImage.src = 'pics/' + file;
    lightboxImage.alt = 'Photo souvenir ' + (currentIndex + 1) + ' sur ' + images.length;
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;

    thumbEls.forEach((thumb, index) => {
      thumb.classList.toggle('is-active', index === currentIndex);
    });
    const activeThumb = thumbEls[currentIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', showPrev);
  btnNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxStage) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch swipe support (scoped to the image stage so it doesn't fight with scrolling the thumbnail strip)
  let touchStartX = null;
  lightboxStage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  lightboxStage.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx > 0) showPrev();
      else showNext();
    }
    touchStartX = null;
  });
})();
