// ===== CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyDt6q32lybULtI5TzlLZnsUvKdAxdLsCyk",
    authDomain: "ashraf-donation.firebaseapp.com",
    databaseURL: "https://ashraf-donation-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ashraf-donation",
    storageBucket: "ashraf-donation.firebasestorage.app",
    messagingSenderId: "287792466185",
    appId: "1:287792466185:web:0e7bc04da2cf8ba37eabd8"
};

const CLOUD_NAME = 'dt1bghcm4';
const UPLOAD_PRESET = 'mobile_upload';

// ===== INITIALIZE FIREBASE =====
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== GLOBAL VARIABLES =====
let totalDonations = 0;
const targetAmount = 10000000;

// ===== UTILITY FUNCTIONS =====

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + parseInt(angka).toLocaleString('id-ID');
}

// Parse Rupiah to number
function parseRupiah(rupiah) {
    if (!rupiah || rupiah === 'Rp ') return 0;
    const cleaned = rupiah.replace(/\D/g, '');
    return parseInt(cleaned) || 0;
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Berhasil disalin: ' + text);
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// Fallback copy method
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showNotification('Berhasil disalin: ' + text);
    } catch (err) {
        showNotification('Gagal menyalin', 'error');
    }
    document.body.removeChild(textarea);
}

// ===== NAVBAR SMART HIDE =====
function setupSmartNavbar() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 100) {
            header.classList.remove('hide');
            header.classList.add('show');
        } else if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hide');
            header.classList.remove('show');
        } else if (currentScroll < lastScroll) {
            header.classList.remove('hide');
            header.classList.add('show');
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        mobileToggle.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
    }

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('active') && 
            !navbar.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            toggleMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, .cta');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = 80;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active link
                    if (this.classList.contains('nav-link')) {
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                        });
                        this.classList.add('active');
                    }
                }
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ===== ACTIVE NAV LINK =====
function setupActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

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
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateActiveLink();
}

// ===== PROGRESS BAR =====
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const percentageText = document.getElementById('percentage');
    const collectedAmount = document.getElementById('collected-amount');

    const percentage = Math.min((totalDonations / targetAmount) * 100, 100);

    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
        progressBar.style.width = percentage + '%';
        percentageText.textContent = Math.round(percentage) + '%';
        collectedAmount.textContent = formatRupiah(totalDonations);
    });
}

// ===== LOAD DONATIONS FROM FIREBASE =====
function loadDonations() {
    console.log('Loading donations from Firebase...');

    db.ref('donations').orderByChild('timestamp').limitToLast(10).on('value', (snapshot) => {
        const donations = [];
        totalDonations = 0;

        snapshot.forEach((childSnapshot) => {
            const donation = childSnapshot.val();
            donations.unshift(donation);
            totalDonations += donation.amount;
        });

        console.log('Total donations loaded:', donations.length);
        console.log('Total amount:', totalDonations);

        updateProgressBar();
        displayDonations(donations);
    }, (error) => {
        console.error('Error loading donations:', error);
        showNotification('Gagal memuat data donasi', 'error');
    });
}

// ===== DISPLAY DONATIONS =====
function displayDonations(donations) {
    const supportList = document.getElementById('support-list');

    if (donations.length === 0) {
        supportList.innerHTML = `
            <div class="support-item loading">
                🤲 Doa terbaik Anda adalah support terbesar untuk Ashraf
            </div>
        `;
        return;
    }

    supportList.innerHTML = '';

    donations.forEach(donation => {
        const supportItem = document.createElement('div');
        supportItem.className = 'support-item';

        const name = donation.anonymous ? 'Hamba Allah' : (donation.name || 'Hamba Allah');
        const amount = formatRupiah(donation.amount);
        const prayer = donation.prayer || '';
        const date = new Date(donation.timestamp).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        supportItem.innerHTML = `
            <div class="support-header-info">
                <div class="support-name">${name}</div>
                <div class="support-amount">${amount}</div>
            </div>
            ${prayer ? `<div class="support-prayer">"${prayer}"</div>` : ''}
            <div class="support-date">${date}</div>
        `;

        supportList.appendChild(supportItem);
    });
}

// ===== UPLOAD FILE TO CLOUDINARY =====
async function uploadFile(file) {
    return new Promise((resolve, reject) => {
        console.log('=== STARTING CLOUDINARY UPLOAD ===');
        console.log('File details:', {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const xhr = new XMLHttpRequest();

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, true);
        xhr.timeout = 30000; // 30 second timeout

        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                console.log('Upload progress:', percentComplete.toFixed(0) + '%');
            }
        };

        xhr.onload = function () {
            console.log('XHR status:', xhr.status);
            
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    console.log('✅ Upload successful!');
                    console.log('File URL:', data.secure_url);
                    resolve(data.secure_url);
                } catch (e) {
                    console.error('Error parsing response:', e);
                    reject(new Error('Gagal memproses response dari Cloudinary'));
                }
            } else {
                console.error('Upload failed with status:', xhr.status);
                reject(new Error('Upload gagal. Status: ' + xhr.status));
            }
        };

        xhr.onerror = function () {
            console.error('XHR error occurred');
            reject(new Error('Network error saat upload'));
        };

        xhr.ontimeout = function () {
            console.error('XHR timeout');
            reject(new Error('Upload timeout'));
        };

        console.log('Sending request to Cloudinary...');
        xhr.send(formData);
    });
}

// ===== FILE UPLOAD SETUP =====
function setupFileUpload() {
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('file');

    if (!fileUpload || !fileInput) {
        console.error('File upload elements not found');
        return;
    }

    console.log('File upload setup initialized');

    fileUpload.addEventListener('click', function (e) {
        console.log('File upload div clicked');
        fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
        console.log('File input changed, files:', this.files);

        if (this.files && this.files.length > 0) {
            const file = this.files[0];
            const fileSize = (file.size / 1024 / 1024).toFixed(2);

            console.log('File selected:', {
                name: file.name,
                size: fileSize + ' MB',
                type: file.type
            });

            fileUpload.innerHTML = `
                <p style="margin: 0 0 8px 0;">✅ <strong>File terpilih:</strong> ${file.name}</p>
                <span class="file-info">Ukuran: ${fileSize} MB</span>
            `;
            fileUpload.classList.add('has-file');

            showNotification('File berhasil dipilih: ' + file.name, 'success');
        } else {
            console.log('No file selected');
        }
    });
}

// ===== AMOUNT INPUT FORMATTING =====
function setupAmountFormatting() {
    const amountInput = document.getElementById('amount');
    
    if (!amountInput) return;
    
    amountInput.value = 'Rp ';

    amountInput.addEventListener('focus', function () {
        if (this.value === 'Rp ') {
            this.setSelectionRange(3, 3);
        }
    });

    amountInput.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');

        if (value) {
            value = parseInt(value).toLocaleString('id-ID');
            this.value = 'Rp ' + value;
        } else {
            this.value = 'Rp ';
        }
    });

    amountInput.addEventListener('blur', function () {
        if (this.value === 'Rp ' || this.value === '') {
            this.value = 'Rp ';
        }
    });
}

// ===== FORM VALIDATION =====
function validateForm(name, contact, amount, file) {
    console.log('=== VALIDATING FORM ===');
    console.log('Validation data:', { name, contact, amount, hasFile: !!file });

    if (!contact || contact.trim() === '') {
        console.error('Contact is empty');
        showNotification('⚠️ Harap isi nomor telepon atau email', 'error');
        return false;
    }

    // Basic contact validation
    const contactRegex = /^(\d{10,15}|[^\s@]+@[^\s@]+\.[^\s@]+)$/;
    if (!contactRegex.test(contact.trim())) {
        showNotification('⚠️ Format nomor telepon atau email tidak valid', 'error');
        return false;
    }

    if (!amount || amount < 1000) {
        console.error('Amount is invalid:', amount);
        showNotification('⚠️ Nominal donasi minimal Rp 1.000', 'error');
        return false;
    }

    if (!file) {
        console.error('No file provided');
        showNotification('⚠️ Harap upload bukti transfer', 'error');
        return false;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        console.error('Invalid file type:', file.type);
        showNotification('⚠️ File harus berupa gambar (JPG, PNG, GIF, WEBP) atau PDF', 'error');
        return false;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        console.error('File too large:', fileSize + 'MB');
        showNotification('⚠️ Ukuran file maksimal 5MB. File Anda: ' + fileSize + 'MB', 'error');
        return false;
    }

    console.log('✅ Validation passed');
    return true;
}

// ===== FORM SUBMISSION =====
function setupFormSubmission() {
    const form = document.getElementById('donation-form');
    const submitBtn = document.getElementById('submit-btn');

    if (!form || !submitBtn) {
        console.error('Form elements not found');
        return;
    }

    console.log('Form submission setup initialized');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('=== FORM SUBMITTED ===');

        // Get form elements
        const nameInput = document.getElementById('name');
        const contactInput = document.getElementById('contact');
        const amountInput = document.getElementById('amount');
        const prayerInput = document.getElementById('prayer');
        const fileInput = document.getElementById('file');

        // Check if all elements exist
        if (!nameInput || !contactInput || !amountInput || !prayerInput || !fileInput) {
            console.error('Form input elements not found');
            showNotification('❌ Error: Form elements tidak ditemukan', 'error');
            return;
        }

        // Get values
        const nameValue = nameInput.value.trim();
        const contact = contactInput.value.trim();
        const amountValue = amountInput.value;
        const prayer = prayerInput.value.trim();

        console.log('Form values:', {
            name: nameValue || 'Hamba Allah',
            contact: contact,
            amount: amountValue,
            prayer: prayer ? prayer.substring(0, 50) + '...' : 'none',
            filesCount: fileInput.files.length
        });

        // Check if file exists
        if (!fileInput.files || fileInput.files.length === 0) {
            console.error('No file selected');
            showNotification('⚠️ Harap upload bukti transfer terlebih dahulu', 'error');
            return;
        }

        const file = fileInput.files[0];
        const name = nameValue || 'Hamba Allah';
        const amount = parseRupiah(amountValue);

        console.log('Parsed data:', { name, contact, amount, fileName: file.name });

        // Validate
        if (!validateForm(name, contact, amount, file)) {
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Mengirim...';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';

        try {
            // Step 1: Upload file to Cloudinary
            showNotification('📤 Mengupload bukti transfer... Mohon tunggu', 'success');
            console.log('=== STEP 1: Uploading to Cloudinary ===');

            const proofUrl = await uploadFile(file);

            console.log('✅ Cloudinary upload complete');
            console.log('Proof URL:', proofUrl);

            // Step 2: Save to Firebase
            showNotification('💾 Menyimpan data donasi ke database...', 'success');
            console.log('=== STEP 2: Saving to Firebase ===');

            const donationData = {
                name: name,
                contact: contact,
                amount: amount,
                prayer: prayer || '',
                proofUrl: proofUrl,
                anonymous: name === 'Hamba Allah',
                timestamp: Date.now()
            };

            console.log('Donation data to save:', donationData);

            const newDonationRef = db.ref('donations').push();
            await newDonationRef.set(donationData);

            console.log('✅ Firebase save complete');
            console.log('Donation ID:', newDonationRef.key);

            // Success!
            showNotification('🎉 Terima kasih atas dukungan dan doa Anda! Semoga menjadi berkah 🤍', 'success');
            showDonationPopup();

            // Reset form
            form.reset();
            const fileUploadDiv = document.getElementById('file-upload');
            if (fileUploadDiv) {
                fileUploadDiv.innerHTML = `
                    <p>📷 Klik untuk upload bukti transfer</p>
                    <span class="file-info">Format: JPG, PNG, PDF (Max 5MB)</span>
                `;
                fileUploadDiv.classList.remove('has-file');
            }
            amountInput.value = 'Rp ';

            console.log('Form reset complete');

            // Scroll to support section after 1 second
            setTimeout(() => {
                const supportSection = document.querySelector('.support-section');
                if (supportSection) {
                    const headerHeight = 80;
                    const targetPosition = supportSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    console.log('Scrolled to support section');
                }
            }, 1500);

        } catch (error) {
            console.error('=== ERROR OCCURRED ===');
            console.error('Error details:', error);
            console.error('Error message:', error.message);

            let userMessage = '❌ Terjadi kesalahan saat mengirim donasi';
            if (error.message.includes('timeout')) {
                userMessage = '❌ Upload timeout. Coba lagi dengan koneksi yang lebih stabil';
            } else if (error.message.includes('network')) {
                userMessage = '❌ Gagal terhubung ke internet. Periksa koneksi Anda';
            }

            showNotification(userMessage, 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Kirim Donasi & Doa';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';

            console.log('=== FORM SUBMISSION COMPLETE ===');
        }
    });
}


// ===== DONATION POPUP =====
function showDonationPopup() {
    const popup = document.getElementById('donation-popup');
    if (popup) {
        popup.classList.add('show');
        document.body.style.overflow = 'hidden';
        createConfetti();
    }
}

function closeDonationPopup() {
    const popup = document.getElementById('donation-popup');
    if (popup) {
        popup.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function createConfetti() {
    const popup = document.getElementById('donation-popup');
    const colors = ['#00c8ff', '#00ffb3', '#ff6b6b', '#ffd93d', '#6b5fff'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        popup.appendChild(confetti);

        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 5000);
    }
}

// Setup popup event listeners
function setupPopupEvents() {
    const popup = document.getElementById('donation-popup');
    
    // Close popup when clicking outside
    popup.addEventListener('click', function (e) {
        if (e.target === this) {
            closeDonationPopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('show')) {
            closeDonationPopup();
        }
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function setupPerformance() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Prevent layout shifts
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
}

// ===== INITIALIZE APP =====
function init() {
    console.log('🚀 Initializing application...');

    try {
        // Setup all functionality
        setupSmartNavbar();
        setupMobileMenu();
        setupSmoothScroll();
        setupAnimations();
        setupActiveNav();
        setupFileUpload();
        setupAmountFormatting();
        setupFormSubmission();
        setupPopupEvents();
        setupPerformance();
        
        // Load data
        loadDonations();

        console.log('✅ Application initialized successfully!');
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        showNotification('Terjadi kesalahan saat memuat aplikasi', 'error');
    }
}

// ===== START APP =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for global access
window.copyToClipboard = copyToClipboard;
window.closeDonationPopup = closeDonationPopup;

// Photo Modal Functionality
let currentPhotoIndex = 0;
let galleryPhotos = [];

function initPhotoModal() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryPhotos = Array.from(galleryCards).map(card => {
        const img = card.querySelector('img');
        const caption = card.querySelector('.gallery-caption');
        return {
            src: img.src,
            alt: img.alt,
            caption: caption.textContent
        };
    });

    // Add click event to each gallery card
    galleryCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openPhotoModal(index));
    });

    // Modal close event
    const modal = document.getElementById('photo-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', closePhotoModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePhotoModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('show')) {
            if (e.key === 'Escape') closePhotoModal();
            if (e.key === 'ArrowLeft') navigatePhotos(-1);
            if (e.key === 'ArrowRight') navigatePhotos(1);
        }
    });
}

function openPhotoModal(index) {
    currentPhotoIndex = index;
    const modal = document.getElementById('photo-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    
    modalImage.src = galleryPhotos[index].src;
    modalImage.alt = galleryPhotos[index].alt;
    modalCaption.textContent = galleryPhotos[index].caption;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Re-enable scrolling
}

function navigatePhotos(direction) {
    currentPhotoIndex += direction;
    
    // Loop around
    if (currentPhotoIndex < 0) {
        currentPhotoIndex = galleryPhotos.length - 1;
    } else if (currentPhotoIndex >= galleryPhotos.length) {
        currentPhotoIndex = 0;
    }
    
    openPhotoModal(currentPhotoIndex);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initPhotoModal();
});
