/**
 * KOPI SENJA - SCRIPT INTERAKTIF
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMenuFilter();
  initStoreStatus();
  initContactForm();
  initScrollSpy();
});

/* ----------------------------------------------------
   1. Navigasi & Mobile Menu
   ---------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle Navbar Shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Hamburger Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking nav item
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ----------------------------------------------------
   2. Filter Kategori Menu Kopi
   ---------------------------------------------------- */
function initMenuFilter() {
  const tabs = document.querySelectorAll('.menu-tab-btn');
  const cards = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab class
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Global Order item via WhatsApp
window.orderItem = function(itemName, price) {
  const phone = '6281234567890';
  const text = encodeURIComponent(`Halo Kopi Senja, saya ingin memesan menu:\n- ${itemName} (Rp ${price})\n\nApakah masih tersedia? Terima kasih!`);
  const waUrl = `https://wa.me/${phone}?text=${text}`;
  
  showToast(`Membuka WhatsApp untuk memesan ${itemName}...`);
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 600);
};

/* ----------------------------------------------------
   3. Cek Status Jam Operasional Kedai Real-time
   ---------------------------------------------------- */
function initStoreStatus() {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');

  if (!statusIndicator || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0: Minggu, 6: Sabtu
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours + minutes / 60;

  let isOpen = false;
  let closingHour = '22.00';

  if (day === 0 || day === 6) {
    // Weekend: 07:30 - 23:00
    closingHour = '23.00';
    if (currentTime >= 7.5 && currentTime < 23) {
      isOpen = true;
    }
  } else {
    // Weekday: 08:00 - 22:00
    closingHour = '22.00';
    if (currentTime >= 8 && currentTime < 22) {
      isOpen = true;
    }
  }

  if (isOpen) {
    statusIndicator.classList.remove('closed');
    statusText.textContent = `Buka Sekarang • Tutup pukul ${closingHour} WIB`;
  } else {
    statusIndicator.classList.add('closed');
    statusText.textContent = `Sedang Tutup • Buka kembali besok pagi`;
  }
}

/* ----------------------------------------------------
   4. Formulir Pesan & Reservasi
   ---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const phone = form.elements['phone'].value.trim();
    const service = form.elements['service'].value;
    const message = form.elements['message'].value.trim();

    if (!name || !phone || !message) {
      showToast('Harap lengkapi semua bidang yang wajib diisi.');
      return;
    }

    // Direct WhatsApp Option or Success Message
    const targetPhone = '6281234567890';
    const waText = encodeURIComponent(
      `Halo Kopi Senja!\n\nNama: ${name}\nNo. HP: ${phone}\nKeperluan: ${service}\nPesan: ${message}`
    );
    const waUrl = `https://wa.me/${targetPhone}?text=${waText}`;

    // Tampilkan pesan konfirmasi
    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <strong>Terima kasih, Kak ${escapeHtml(name)}!</strong><br>
        Pesan Anda telah kami catat. Anda juga bisa langsung melanjutkan chat ke WhatsApp kami.<br>
        <a href="${waUrl}" target="_blank" style="display:inline-block; margin-top:8px; font-weight:700; color:#1B5E20; text-decoration:underline;">
          Klik di sini untuk langsung chat via WhatsApp &rarr;
        </a>
      `;
    }

    showToast('Pesan berhasil terkirim! Tim kami akan segera merespons.');
    form.reset();
  });
}

/* ----------------------------------------------------
   5. ScrollSpy Navigasi Aktif
   ---------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ----------------------------------------------------
   6. Toast Helper
   ---------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
}
