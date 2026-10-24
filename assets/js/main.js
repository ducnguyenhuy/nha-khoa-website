// Nha Khoa IVY SMILE – tương tác giao diện

// Đặt URL nhận dữ liệu form (Formspree, Google Apps Script…) để nhận lịch hẹn thật.
// Để trống thì form chỉ hiện thông báo cảm ơn, không gửi đi đâu.
const BOOKING_ENDPOINT = '';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ===== Header & nút lên đầu trang ===== */
const header = $('.header');
const toTop = $('.to-top');

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 10);
  toTop.classList.toggle('is-visible', y > 500);
  document.body.classList.toggle('scrolled', y > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

/* ===== Menu mobile ===== */
const nav = $('#nav');
const navToggle = $('.nav-toggle');
const navBackdrop = $('.nav-backdrop');
const mobileQuery = window.matchMedia('(max-width: 1024px)');

function setNav(open) {
  nav.classList.toggle('is-open', open);
  navBackdrop.hidden = !open;
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.innerHTML = `<svg class="ico"><use href="#${open ? 'i-x' : 'i-menu'}"/></svg>`;
  document.body.classList.toggle('modal-open', open);
}

navToggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
navBackdrop.addEventListener('click', () => setNav(false));

// Trên mobile, bấm mục có menu con thì mở/đóng menu con thay vì chuyển trang
$$('.nav__item.has-sub > a').forEach(link => {
  link.addEventListener('click', e => {
    if (!mobileQuery.matches) return;
    e.preventDefault();
    link.parentElement.classList.toggle('is-open');
  });
});

$$('.nav a:not(.has-sub > a)').forEach(link => {
  link.addEventListener('click', () => { if (mobileQuery.matches) setNav(false); });
});

mobileQuery.addEventListener('change', () => setNav(false));

/* ===== Slider banner ===== */
$$('[data-slider]').forEach(slider => {
  const track = $('.slider__track', slider);
  const slides = $$('.slide', slider);
  const dotsWrap = $('.slider__dots', slider);
  let index = 0;
  let timer;

  if (slides.length < 2) {
    slider.classList.add('is-single');
    return;
  }

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ảnh ${i + 1}`);
    dot.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.append(dot);
    return dot;
  });

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 5000);
  }

  $('.slider__arrow--prev', slider).addEventListener('click', () => { go(index - 1); restart(); });
  $('.slider__arrow--next', slider).addEventListener('click', () => { go(index + 1); restart(); });
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', restart);

  // Vuốt trên điện thoại
  let startX = null;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });

  go(0);
  restart();
});

/* ===== Hiệu ứng xuất hiện khi cuộn ===== */
const revealItems = $$('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Các thẻ cùng hàng xuất hiện lần lượt
  revealItems.forEach(el => {
    const siblings = $$(':scope > [data-reveal]', el.parentElement);
    el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 5) * 80}ms`);
    io.observe(el);
  });
} else {
  revealItems.forEach(el => el.classList.add('is-in'));
}

/* ===== Popup đặt lịch ===== */
const modal = $('#booking');
const form = $('.form', modal);
const done = $('.form__done', modal);
const errorBox = $('.form__error', modal);
const intro = $('.modal__head p', modal);
let lastFocus = null;

function openBooking(service) {
  lastFocus = document.activeElement;
  form.hidden = false;
  done.hidden = true;
  intro.hidden = false;
  if (service) form.service.value = service;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  setTimeout(() => form.name.focus(), 50);
}

function closeBooking() {
  modal.hidden = true;
  if (!nav.classList.contains('is-open')) document.body.classList.remove('modal-open');
  lastFocus?.focus();
}

document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-booking]');
  if (!trigger) return;
  e.preventDefault();
  if (nav.classList.contains('is-open')) setNav(false);
  openBooking(trigger.dataset.booking);
});

$$('[data-close]', modal).forEach(el => el.addEventListener('click', closeBooking));

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!modal.hidden) closeBooking();
  else if (nav.classList.contains('is-open')) setNav(false);
});

// Không cho chọn ngày trong quá khứ
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
form.date.min = today.toISOString().slice(0, 10);

const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

function fieldError(input, message) {
  input.closest('.field').classList.add('is-invalid');
  errorBox.textContent = message;
  input.focus();
}

form.addEventListener('input', e => {
  e.target.closest('.field')?.classList.remove('is-invalid');
  errorBox.textContent = '';
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.name = data.name.trim();
  data.phone = data.phone.replace(/[\s.-]/g, '');

  if (data.name.length < 2) return fieldError(form.name, 'Vui lòng nhập họ và tên.');
  if (!PHONE_RE.test(data.phone)) return fieldError(form.phone, 'Số điện thoại chưa đúng, ví dụ: 0912 345 678.');

  const submitBtn = $('button[type="submit"]', form);
  submitBtn.disabled = true;
  submitBtn.textContent = 'Đang gửi…';

  try {
    if (BOOKING_ENDPOINT) {
      const res = await fetch(BOOKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.status);
    }
    form.reset();
    form.hidden = true;
    intro.hidden = true;
    done.hidden = false;
  } catch {
    errorBox.textContent = 'Gửi chưa thành công, vui lòng thử lại hoặc gọi hotline.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gửi thông tin';
  }
});

/* ===== Bong bóng tư vấn ===== */
const chatHint = $('[data-chat-hint]');
$('.chat-hint__close', chatHint).addEventListener('click', () => chatHint.remove());

/* ===== Năm ở footer ===== */
$$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
