/* ==========================================================================
   CUSTOMIZABLE CHATBOT KNOWLEDGE BASE (RAG DATABASE)
   ==========================================================================
   To update what your AI Assistant answers, edit the categories, keywords,
   and responses in the array below. Keywords are used to search and match
   the user's questions. HTML markup is supported in responses.
   ========================================================================== */


/* ==========================================================================
   INITIALIZATION & GLOBALS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Navigation elements
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Typewriter element
    const typewriterElement = document.querySelector('.typewriter-text');
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Chatbot FAB Element
    const chatbotFab = document.getElementById('chatbotFab');

    /* ==========================================================================
       MOBILE MENU TOGGLE, BACKDROP, AND TOUCH GESTURES
       ========================================================================== */
    if (mobileMenuBtn && mobileNavMenu) {
        // Create and inject mobile nav backdrop dynamically
        let backdrop = document.getElementById('mobileNavBackdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'mobileNavBackdrop';
            backdrop.className = 'mobile-nav-backdrop';
            document.body.appendChild(backdrop);
        }

        const openMobileMenu = () => {
            mobileMenuBtn.classList.add('active');
            mobileNavMenu.classList.add('open');
            backdrop.classList.add('open');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
            
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            if (bars.length >= 3) {
                bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            }
        };

        const closeMobileMenu = () => {
            mobileMenuBtn.classList.remove('active');
            mobileNavMenu.classList.remove('open');
            backdrop.classList.remove('open');
            document.body.style.overflow = ''; // Unlock background scrolling
            
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            if (bars.length >= 3) {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        };

        // Toggle mobile menu on button click
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileNavMenu.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close mobile menu on backdrop click
        backdrop.addEventListener('click', () => {
            closeMobileMenu();
        });

        // Close menu on click of mobile nav link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Touch swipe gesture detection for mobile navigation drawer
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipeGesture();
        }, { passive: true });

        const handleSwipeGesture = () => {
            const swipeDistanceX = touchEndX - touchStartX;
            const swipeDistanceY = touchEndY - touchStartY;
            
            // Verify swipe is horizontal and prominent
            if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) * 1.5) {
                const isMenuOpen = mobileNavMenu.classList.contains('open');
                
                // Swipe right to close
                if (isMenuOpen && swipeDistanceX > 70) {
                    closeMobileMenu();
                }
                // Swipe left from right edge (within 50px of edge) to open
                else if (!isMenuOpen && swipeDistanceX < -70 && touchStartX > window.innerWidth - 50) {
                    openMobileMenu();
                }
            }
        };
    }

    /* ==========================================================================
       STICKY HEADER & BACK-TO-TOP BUTTON
       ========================================================================== */
    let skillsSectionAccessed = false;

    const handleScroll = () => {
        const scrollPos = window.scrollY;
        
        // Sticky Header
        if (scrollPos > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        // Scroll To Top Button
        if (scrollPos > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }

        // Active Section Scroll Spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Trigger video play/stop on section access
        if (currentSectionId === 'skills') {
            if (!skillsSectionAccessed) {
                skillsSectionAccessed = true;
                
                // Stop Home page intro video immediately
                const heroVideo = document.getElementById('heroVideo');
                if (heroVideo) {
                    heroVideo.pause();
                }
                
                // Autoplay skills video unmuted exactly once
                const skillsVideo = document.getElementById('skillsVideo');
                if (skillsVideo) {
                    skillsVideo.currentTime = 0;
                    skillsVideo.muted = false;
                    skillsVideo.play().catch(err => {
                        console.log("Skills video autoplay failed: ", err);
                    });
                }
            }
        } else {
            skillsSectionAccessed = false;
            
            // Optionally pause skillsVideo if they scroll away
            if (currentSectionId === 'home') {
                const skillsVideo = document.getElementById('skillsVideo');
                if (skillsVideo) {
                    skillsVideo.pause();
                }
            }
        }

        if (currentSectionId) {
            // Update desktop link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
            // Update mobile link
            mobileLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Scroll Reveal Animations Trigger
        const revealElements = document.querySelectorAll('.reveal');
        const triggerPoint = window.innerHeight * 0.85;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerPoint) {
                element.classList.add('active');
                
                // If it is a skills category, animate progress bars
                if (element.classList.contains('skills-category')) {
                    const fills = element.querySelectorAll('.progress-fill');
                    fills.forEach(fill => {
                        const targetWidth = fill.parentNode.previousElementSibling.lastElementChild.textContent;
                        fill.style.width = targetWidth;
                    });
                }
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger scroll check on load to reveal elements currently visible
    setTimeout(handleScroll, 100);

    // Scroll to Top action
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       TYPEWRITER EFFECT
       ========================================================================== */
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentWord = '';

        const type = () => {
            const fullWord = words[wordIndex];
            
            if (isDeleting) {
                currentWord = fullWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentWord = fullWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            typewriterElement.textContent = currentWord;
            
            let typeSpeed = isDeleting ? 30 : 60;
            
            if (!isDeleting && charIndex === fullWord.length) {
                typeSpeed = 1800; // Wait time at complete word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400; // Small delay before typing next word
            }
            
            setTimeout(type, typeSpeed);
        };
        
        // Start typewriter
        setTimeout(type, 500);
    }

    /* ==========================================================================
       SKILL PROGRESS & REVEAL CLASSES INITIALIZATION
       ========================================================================== */
    // Add scroll reveal classes to sections for smooth load in
    document.querySelectorAll('.skills-category').forEach(el => el.classList.add('reveal'));
    document.querySelectorAll('.about-card-item').forEach(el => el.classList.add('reveal'));
    document.querySelectorAll('.lang-card').forEach(el => el.classList.add('reveal'));
    document.querySelectorAll('.timeline-item').forEach(el => el.classList.add('reveal'));
    
    // Staggered bento cards reveal transition delays
    document.querySelectorAll('.bento-card').forEach((el, index) => {
        el.classList.add('reveal');
        el.style.setProperty('--delay', `${index * 150}ms`);
    });

    /* ==========================================================================
       CONTACT FORM SUBMIT (SIMULATED PROMPT)
       ========================================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Data
            const nameVal = document.getElementById('name').value;
            const emailVal = document.getElementById('email').value;
            const subjectVal = document.getElementById('subject').value;
            const messageVal = document.getElementById('message').value;

            // Form Submit button visual loading feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            // Send real email via FormSubmit API
            fetch("https://formsubmit.co/ajax/hariharanmct06@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    _subject: `Portfolio Enquiry: ${subjectVal}`,
                    message: messageVal,
                    _captcha: "false"
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Form submission failed");
                }
            })
            .then(data => {
                // Show Success Notification
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fas fa-circle-check"></i> Thank you! Your enquiry has been sent directly to Hariharan M. (Note: If this is the first submission, please verify your email when prompted by FormSubmit)';
                formStatus.style.display = 'block';
                
                // Reset form values
                contactForm.reset();
            })
            .catch(error => {
                // Show Error Notification / fallback visual
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fas fa-circle-check"></i> opening your default email app to send...';
                formStatus.style.display = 'block';
                
                // Fallback to mailto link
                const mailtoLink = `mailto:hariharanmct06@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent("Name: " + nameVal + "\nEmail: " + emailVal + "\n\n" + messageVal)}`;
                window.location.href = mailtoLink;
            })
            .finally(() => {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            });
        });
    }

    // Floating AI chatbot link pulse removal on click
    if (chatbotFab) {
        chatbotFab.addEventListener('click', () => {
            const pulse = chatbotFab.querySelector('.fab-pulse');
            if (pulse) pulse.style.display = 'none';
        });
    }

    // Interactive Spotlight Effect for Cards (Mouse Follow Glow) - Spotlight Only
    const spotlightOnlyCards = document.querySelectorAll('.skills-category, .lang-card');
    spotlightOnlyCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Spotlight + 3D Tilt Cards (Only for non-touch devices to keep it smooth)
    const tiltCards = document.querySelectorAll('.shape-card-3d, .stat-box, .bento-card');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set mouse variables for spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Apply 3D tilt if not on mobile/touch
            if (!isTouchDevice) {
                const width = rect.width;
                const height = rect.height;
                const relativeX = (x / width) - 0.5;
                const relativeY = (y / height) - 0.5;
                
                // Tilt rotation range (max 12 degrees)
                const maxRotation = 12;
                const rotateX = (-relativeY * maxRotation).toFixed(2);
                const rotateY = (relativeX * maxRotation).toFixed(2);
                
                // Quick transition during mousemove for responsiveness, dynamic scale
                card.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease, border-color 0.5s ease';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!isTouchDevice) {
                // Smooth transition reset when leaving the card
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease, border-color 0.5s ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            }
        });
    });

    // Interactive 3D Education Timeline Card Flip
    const timelineCards = document.querySelectorAll('.timeline-card-3d');
    timelineCards.forEach(card => {
        card.addEventListener('click', () => {
            const inner = card.querySelector('.card-3d-inner');
            if (inner) {
                inner.classList.toggle('flipped');
            }
        });
    });

});

// ==========================================================================
// PRELOADER LOADING SCREEN HANDLER & ENTER BUTTON AUDIO CONTROLLER
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const preloaderEnterBtn = document.getElementById('preloaderEnterBtn');
    const heroVideo = document.getElementById('heroVideo');
    const videoReplayBtn = document.getElementById('videoReplayBtn');
    
    // Slow down the video sound & verify pitch preservation for clarity
    if (heroVideo) {
        heroVideo.muted = true; // Start muted to satisfy browser checks
        
        const configureVideoPlayback = () => {
            heroVideo.playbackRate = 0.95; // Slightly faster for natural feel
            heroVideo.preservesPitch = true;
            heroVideo.webkitPreservesPitch = true;
            heroVideo.mozPreservesPitch = true;
            heroVideo.loop = false; // Ensure it does not loop automatically
            
            // Detect if video is portrait (width < height)
            if (heroVideo.videoWidth < heroVideo.videoHeight) {
                heroVideo.classList.add('video-portrait');
            }
        };

        // If metadata is already loaded, apply speed settings, else wait for it
        if (heroVideo.readyState >= 1) {
            configureVideoPlayback();
        } else {
            heroVideo.addEventListener('loadedmetadata', configureVideoPlayback);
        }

        // Force browser to play muted in the background to start buffer loading
        heroVideo.play().catch(err => {
            console.log("Background muted play prevented: ", err);
        });

        // Automatic smooth scroll to the next content section once intro video finishes playing
        let hasAutoScrolledFromIntro = false;

        const handleIntroVideoEnded = () => {
            if (hasAutoScrolledFromIntro) return;

            // Ensure preloader is dismissed before performing automatic scroll
            const preloaderOverlay = document.getElementById('preloader');
            if (preloaderOverlay && !preloaderOverlay.classList.contains('fade-out') && window.getComputedStyle(preloaderOverlay).display !== 'none') {
                return;
            }

            const nextSection = document.getElementById('about') || document.querySelector('.about-section');
            if (!nextSection) return;

            // If the user has already scrolled away from the intro, do not unexpectedly move them
            const homeSection = document.getElementById('home');
            if (homeSection) {
                const homeRect = homeSection.getBoundingClientRect();
                if (homeRect.bottom < window.innerHeight * 0.35 || window.scrollY >= (nextSection.offsetTop - 180)) {
                    hasAutoScrolledFromIntro = true;
                    return;
                }
            }

            hasAutoScrolledFromIntro = true;

            const sectionHeading = nextSection.querySelector('.section-header, .section-title, h2') || nextSection;
            const header = document.querySelector('.header');

            const headerTop = header ? (parseFloat(window.getComputedStyle(header).top) || 0) : 0;
            const headerHeight = header ? (header.offsetHeight + headerTop) : 76;
            const navbarOffset = headerHeight + 16; // Maintain 16px clearance below floating navbar

            const headingTopInDoc = window.pageYOffset + sectionHeading.getBoundingClientRect().top;
            const sectionTopInDoc = window.pageYOffset + nextSection.getBoundingClientRect().top;
            const targetScrollTop = Math.max(0, Math.round(Math.min(sectionTopInDoc, headingTopInDoc - navbarOffset)));

            const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

            if (prefersReducedMotion) {
                document.documentElement.style.scrollBehavior = 'auto';
            }

            try {
                window.scrollTo({
                    top: targetScrollTop,
                    behavior: scrollBehavior
                });
            } catch (err) {
                window.scrollTo(0, targetScrollTop);
            }

            if (prefersReducedMotion) {
                setTimeout(() => {
                    document.documentElement.style.scrollBehavior = '';
                }, 50);
            }
        };

        heroVideo.addEventListener('ended', handleIntroVideoEnded);
    }

    if (preloader) {
        // Wait 1.2 seconds for progress bar to visual finish
        setTimeout(() => {
            const waitText = document.querySelector('.preloader-wait-text');
            const loadingText = document.querySelector('.preloader-loading-text');
            
            if (waitText) waitText.style.display = 'none';
            if (loadingText) loadingText.innerHTML = 'READY';
            
            // Show the premium Enter button
            if (preloaderEnterBtn) {
                preloaderEnterBtn.style.display = 'inline-flex';
                preloaderEnterBtn.style.alignItems = 'center';
            }
        }, 1200);

        // Clicking the Enter button unmutes the voice and starts the portfolio
        if (preloaderEnterBtn) {
            preloaderEnterBtn.addEventListener('click', () => {
                if (heroVideo) {
                    try {
                        if (heroVideo.readyState >= 1) {
                            heroVideo.currentTime = 0; // Play from the start
                        }
                        heroVideo.muted = false; // Unmute voice
                        heroVideo.play().catch(err => {
                            console.log("Audio play failed on click: ", err);
                        });
                    } catch (videoErr) {
                        console.log("Video playback trigger failed: ", videoErr);
                    }
                }
                
                // Fade out and remove loading screen overlay
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            });
        }

        // Replay button display controller based on playback states
        if (heroVideo && videoReplayBtn) {
            const showReplayBtn = () => {
                videoReplayBtn.style.display = 'inline-flex';
                videoReplayBtn.style.alignItems = 'center';
            };
            const hideReplayBtn = () => {
                videoReplayBtn.style.display = 'none';
            };

            heroVideo.addEventListener('play', hideReplayBtn);
            heroVideo.addEventListener('pause', showReplayBtn);
            heroVideo.addEventListener('ended', showReplayBtn);

            // Replay button click handler
            videoReplayBtn.addEventListener('click', () => {
                heroVideo.currentTime = 0;
                heroVideo.muted = false; // Keep voice unmuted
                heroVideo.loop = false;  // Ensure it does not loop automatically
                heroVideo.play().catch(err => {
                    console.log("Replay failed: ", err);
                });
            });
        }
    }

    // Skills Section Video Replay Handler
    const skillsVideo = document.getElementById('skillsVideo');
    const photoReplayBtn = document.getElementById('photoReplayBtn');
    
    if (photoReplayBtn && skillsVideo) {
        photoReplayBtn.addEventListener('click', () => {
            skillsVideo.currentTime = 0;
            skillsVideo.muted = false; // Unmute on explicit user replay click
            skillsVideo.loop = false; // Ensure it does not loop
            skillsVideo.play().catch(err => {
                console.log("Skills video replay failed: ", err);
            });
        });
    }

    /* ==========================================================================
       INTERACTIVE TECHNOLOGY DASHBOARD MODULES
       ========================================================================== */
    const techModules = document.querySelectorAll('.tech-diagnostic-module');
    
    techModules.forEach(module => {
        module.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate document click trigger
            const isActive = module.classList.contains('active');
            techModules.forEach(m => m.classList.remove('active'));
            
            if (!isActive) {
                module.classList.add('active');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.tech-diagnostic-module')) {
            techModules.forEach(m => m.classList.remove('active'));
        }
    });


});

// ==========================================================================
// SCREENSHOT & RIGHT-CLICK PROTECTION HANDLERS
// ==========================================================================
// 1. Prevent Right-Click menu
document.addEventListener('contextmenu', e => e.preventDefault());

// 2. Prevent hotkeys for inspection, printing, and saving
document.addEventListener('keydown', e => {
    // Disable Print Screen key itself (clears clipboard)
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert("Screenshots and screen prints are restricted on this portfolio.");
        e.preventDefault();
    }
    
    // Ctrl + P (Print), Ctrl + S (Save page), Ctrl + U (View source)
    if (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'P' || e.key === 'S' || e.key === 'U')) {
        e.preventDefault();
    }
    
    // F12 (DevTools)
    if (e.key === 'F12') {
        e.preventDefault();
    }
    
    // Ctrl + Shift + I / C / J (DevTools / Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'c' || e.key === 'j' || e.key === 'I' || e.key === 'C' || e.key === 'J')) {
        e.preventDefault();
    }
});

// 3. Blur page content when window loses focus (Snipping tool / window switching)
window.addEventListener('blur', () => {
    document.body.style.filter = 'blur(10px)';
    document.body.style.transition = 'filter 0.1s ease';
});

window.addEventListener('focus', () => {
    document.body.style.filter = 'none';
});

/* ==========================================================================
   FUTURISTIC ABOUT COMMAND CENTER INTERACTIVE LOGIC
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Canvas Engine for About Me Section
    const particleCanvas = document.getElementById('aboutParticleCanvas');
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        const particleCount = 35;

        function resizeCanvas() {
            if (particleCanvas.parentElement) {
                particleCanvas.width = particleCanvas.parentElement.clientWidth;
                particleCanvas.height = particleCanvas.parentElement.clientHeight;
            }
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * (particleCanvas.width || 800);
                this.y = Math.random() * (particleCanvas.height || 600);
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#36D7FF' : '#FF7B1A';
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connecting laser threads
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.save();
                        ctx.globalAlpha = (1 - dist / 100) * 0.15;
                        ctx.strokeStyle = '#36D7FF';
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // 2. Animated Stats Counter & Laser Scanner Pass Trigger on Scroll
    const aboutSection = document.getElementById('about');
    let animatedStats = false;

    if (aboutSection && 'IntersectionObserver' in window) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animatedStats = true;
                    // Trigger count up for numbers
                    document.querySelectorAll('.holo-stat-capsule[data-target]').forEach(capsule => {
                        const target = parseInt(capsule.getAttribute('data-target'));
                        const numberEl = capsule.querySelector('.stat-number');
                        if (numberEl) {
                            let count = 0;
                            const isPlus = numberEl.textContent.includes('+');
                            const interval = setInterval(() => {
                                count++;
                                numberEl.textContent = count + (isPlus ? '+' : '');
                                if (count >= target) clearInterval(interval);
                            }, 250);
                        }
                    });
                }
            });
        }, { threshold: 0.25 });
        aboutObserver.observe(aboutSection);
    }

    // 3. Cyber Video Resume Button Magnetic Attraction & Ripple
    const hudVideoBtn = document.getElementById('hudVideoBtn');
    if (hudVideoBtn) {
        hudVideoBtn.addEventListener('mousemove', (e) => {
            const rect = hudVideoBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            hudVideoBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.04)`;
        });

        hudVideoBtn.addEventListener('mouseleave', () => {
            hudVideoBtn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    }

    /* ==========================================================================
       FAVORITE SPORTS & PASSIONS SECTION INTERACTIVE ENGINE (Strict Addition)
       ========================================================================== */
    const passionsSection = document.getElementById('passions');
    if (passionsSection) {
        // 1. IntersectionObserver for Entrance Animation & Auto-pause when off-screen
        const scanLine = passionsSection.querySelector('.passions-scan-line');
        const passionCards = passionsSection.querySelectorAll('.passion-card');
        let passionsActive = false;
        let isPassionsInView = false;

        if ('IntersectionObserver' in window) {
            const passionsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isPassionsInView = entry.isIntersecting;
                    if (entry.isIntersecting && !passionsActive) {
                        passionsActive = true;
                        // Trigger robotic scan line sweep
                        if (scanLine) scanLine.classList.add('scanning');
                        
                        // Staggered card reveal
                        passionCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('in-view');
                            }, 200 + index * 120);
                        });
                    }
                });
            }, { threshold: 0.2 });
            passionsObserver.observe(passionsSection);
        } else {
            passionCards.forEach(card => card.classList.add('in-view'));
        }

        // 2. Background Constellation Canvas
        const bgCanvas = document.getElementById('passionsConstellationCanvas');
        if (bgCanvas) {
            const ctx = bgCanvas.getContext('2d');
            let bgWidth = 0, bgHeight = 0;
            let bgParticles = [];
            const particleCount = 35;

            function resizeBgCanvas() {
                if (bgCanvas.parentElement) {
                    bgWidth = bgCanvas.width = bgCanvas.parentElement.clientWidth;
                    bgHeight = bgCanvas.height = bgCanvas.parentElement.clientHeight;
                }
            }
            resizeBgCanvas();
            window.addEventListener('resize', resizeBgCanvas);

            for (let i = 0; i < particleCount; i++) {
                bgParticles.push({
                    x: Math.random() * (bgWidth || 800),
                    y: Math.random() * (bgHeight || 600),
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 2 + 1,
                    color: Math.random() > 0.5 ? '#FF7B1A' : '#38bdf8',
                    alpha: Math.random() * 0.4 + 0.1
                });
            }

            function drawBgConstellation() {
                if (isPassionsInView && ctx) {
                    ctx.clearRect(0, 0, bgWidth, bgHeight);
                    for (let i = 0; i < bgParticles.length; i++) {
                        const p = bgParticles[i];
                        p.x += p.vx;
                        p.y += p.vy;
                        if (p.x < 0 || p.x > bgWidth) p.vx *= -1;
                        if (p.y < 0 || p.y > bgHeight) p.vy *= -1;

                        ctx.save();
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();

                        // Connect nearby particles
                        for (let j = i + 1; j < bgParticles.length; j++) {
                            const p2 = bgParticles[j];
                            const dx = p.x - p2.x;
                            const dy = p.y - p2.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < 100) {
                                ctx.save();
                                ctx.globalAlpha = (1 - dist / 100) * 0.12;
                                ctx.strokeStyle = '#38bdf8';
                                ctx.lineWidth = 0.6;
                                ctx.beginPath();
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.stroke();
                                ctx.restore();
                            }
                        }
                    }
                }
                requestAnimationFrame(drawBgConstellation);
            }
            drawBgConstellation();
        }

        // 3. Card-level Interactive Particle Canvases (Chess, Cricket, Gym, Magic)
        const cardCanvases = document.querySelectorAll('.card-particle-canvas');
        cardCanvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            let width = (canvas.width = canvas.parentElement.clientWidth || 300);
            let height = (canvas.height = canvas.parentElement.clientHeight || 180);
            let particles = [];

            function addBurst(x, y, count = 12, color = '#38bdf8') {
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 3 + 1;
                    particles.push({
                        x: x || width / 2,
                        y: y || height / 2,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        radius: Math.random() * 2.5 + 1,
                        alpha: 1,
                        color: color
                    });
                }
            }

            const card = canvas.closest('.passion-card');
            if (card) {
                const passionType = card.getAttribute('data-passion');
                const colorMap = {
                    chess: '#FF7B1A',
                    cricket: '#38bdf8',
                    gym: '#22c55e',
                    magic: '#a855f7'
                };

                card.addEventListener('mouseenter', (e) => {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    addBurst(x, y, 15, colorMap[passionType] || '#38bdf8');
                });

                card.addEventListener('click', (e) => {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    addBurst(x, y, 20, colorMap[passionType] || '#38bdf8');

                    // Special trigger for Cricket impact shockwave
                    if (passionType === 'cricket') {
                        const shockwave = card.querySelector('#cricketShockwave');
                        if (shockwave) {
                            shockwave.style.left = `${x - 20}px`;
                            shockwave.style.top = `${y - 20}px`;
                            shockwave.style.animation = 'none';
                            void shockwave.offsetWidth;
                            shockwave.style.animation = 'shockwavePulse 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                        }
                    }
                });
            }

            function renderCardParticles() {
                if (isPassionsInView && ctx) {
                    ctx.clearRect(0, 0, width, height);
                    for (let i = particles.length - 1; i >= 0; i--) {
                        const p = particles[i];
                        p.x += p.vx;
                        p.y += p.vy;
                        p.alpha -= 0.025;
                        if (p.alpha <= 0) {
                            particles.splice(i, 1);
                            continue;
                        }
                        ctx.save();
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }
                }
                requestAnimationFrame(renderCardParticles);
            }
            renderCardParticles();
        });

        // 4. Parallax Plane & Spring Tilt tracking on mousemove
        let targetMouseX = 0, targetMouseY = 0;
        let currentMouseX = 0, currentMouseY = 0;

        passionsSection.addEventListener('mousemove', (e) => {
            const rect = passionsSection.getBoundingClientRect();
            targetMouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            targetMouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        });

        passionsSection.addEventListener('mouseleave', () => {
            targetMouseX = 0;
            targetMouseY = 0;
        });

        function updatePassionsParallax() {
            if (isPassionsInView) {
                currentMouseX += (targetMouseX - currentMouseX) * 0.08;
                currentMouseY += (targetMouseY - currentMouseY) * 0.08;

                // Parallax Depth Plane 1 (Background Grid)
                const bgGrid = passionsSection.querySelector('.passions-bg-grid');
                if (bgGrid) {
                    bgGrid.style.transform = `translate(${currentMouseX * 12}px, ${currentMouseY * 12}px)`;
                }

                // Parallax Depth Plane 2 (Card Layer Spring Tilt)
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth > 768) {
                    passionCards.forEach(card => {
                        const tiltX = -currentMouseY * 5;
                        const tiltY = currentMouseX * 5;
                        card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
                    });
                }

                // Parallax Depth Plane 3 (3D Stage Floating Elements)
                const knight = document.getElementById('chessKnight');
                if (knight) {
                    knight.style.transform = `translateZ(30px) rotateX(-55deg) translate(${currentMouseX * 10}px, ${currentMouseY * 10}px)`;
                }
                const bat = document.getElementById('cricketBat');
                if (bat) {
                    bat.style.transform = `rotate(${-35 + currentMouseX * 12}deg) translateZ(20px)`;
                }
                const wand = document.getElementById('magicWand');
                if (wand) {
                    wand.style.transform = `rotate(${40 + currentMouseX * 12}deg) translateZ(25px)`;
                }
            }
            requestAnimationFrame(updatePassionsParallax);
        }
        updatePassionsParallax();
    }
});

