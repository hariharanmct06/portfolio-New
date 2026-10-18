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
        heroVideo.playsInline = true;
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');
        
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

            // Ensure muted play starts immediately so video frames render
            if (heroVideo.paused) {
                heroVideo.play().catch(err => {
                    console.log("Background muted play prevented: ", err);
                    updatePlayButtonUI();
                });
            }
        };

        // If metadata is already loaded, apply speed settings, else wait for it
        if (heroVideo.readyState >= 1) {
            configureVideoPlayback();
        } else {
            heroVideo.addEventListener('loadedmetadata', configureVideoPlayback);
        }

        // Force browser to play muted in the background to start buffer loading and frame render
        heroVideo.play().catch(err => {
            console.log("Background muted play prevented: ", err);
        });

        // Dynamic Play / Unmute / Replay Button Controller
        const updatePlayButtonUI = () => {
            if (!videoReplayBtn || !heroVideo) return;

            if (heroVideo.ended) {
                videoReplayBtn.innerHTML = '<i class="fas fa-undo-alt"></i> <span>Replay Intro</span>';
                videoReplayBtn.style.display = 'inline-flex';
                videoReplayBtn.style.alignItems = 'center';
            } else if (heroVideo.paused) {
                videoReplayBtn.innerHTML = '<i class="fas fa-play"></i> <span>Play Intro</span>';
                videoReplayBtn.style.display = 'inline-flex';
                videoReplayBtn.style.alignItems = 'center';
            } else if (heroVideo.muted) {
                videoReplayBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>Unmute Intro</span>';
                videoReplayBtn.style.display = 'inline-flex';
                videoReplayBtn.style.alignItems = 'center';
            } else {
                // Video is actively playing unmuted
                videoReplayBtn.style.display = 'none';
            }
        };

        heroVideo.addEventListener('play', updatePlayButtonUI);
        heroVideo.addEventListener('pause', updatePlayButtonUI);
        heroVideo.addEventListener('ended', updatePlayButtonUI);
        heroVideo.addEventListener('volumechange', updatePlayButtonUI);

        // Click handler for play / unmute / replay button
        if (videoReplayBtn) {
            videoReplayBtn.addEventListener('click', () => {
                if (heroVideo.ended || heroVideo.paused) {
                    heroVideo.currentTime = 0;
                    heroVideo.muted = false;
                    heroVideo.loop = false;
                    const p = heroVideo.play();
                    if (p !== undefined) {
                        p.catch(() => {
                            heroVideo.muted = true;
                            heroVideo.play().catch(e => console.warn(e));
                        });
                    }
                } else if (heroVideo.muted) {
                    heroVideo.muted = false;
                }
                updatePlayButtonUI();
            });
        }

        // Automatic smooth scroll to the next content section strictly on playback completion
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
            const currentY = window.pageYOffset || document.documentElement.scrollTop;
            if (homeSection) {
                const homeRect = homeSection.getBoundingClientRect();
                if (homeRect.bottom < window.innerHeight * 0.35 || currentY >= (nextSection.offsetTop - 180)) {
                    hasAutoScrolledFromIntro = true;
                    window.__hasAutoScrolledFromIntro = true;
                    return;
                }
            }

            hasAutoScrolledFromIntro = true;
            window.__hasAutoScrolledFromIntro = true;
            window.__isIntroAutoScrolling = true;

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

            setTimeout(() => {
                window.__isIntroAutoScrolling = false;
            }, 1500);
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
                        const playPromise = heroVideo.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(err => {
                                console.warn("Unmuted autoplay restricted, playing muted as fallback:", err);
                                // Fallback to muted playback immediately so video is 100% visible
                                heroVideo.muted = true;
                                heroVideo.play().catch(e => {
                                    console.warn("Muted playback also blocked:", e);
                                });
                            });
                        }
                    } catch (videoErr) {
                        console.warn("Video playback trigger failed: ", videoErr);
                    }
                }
                
                // Fade out and remove loading screen overlay
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
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
    
    // Ensure the first accordion box is expanded by default on fresh page visits
    if (techModules.length > 0 && !document.querySelector('.tech-diagnostic-module.active')) {
        techModules[0].classList.add('active');
    }
    
    techModules.forEach(module => {
        module.addEventListener('click', (e) => {
            // Prevent interference if user clicks any interactive element inside
            if (e.target.closest('a, button, input')) return;
            
            const isActive = module.classList.contains('active');
            
            // Close all boxes, then expand the clicked box if it wasn't already active
            techModules.forEach(m => m.classList.remove('active'));
            
            if (!isActive) {
                module.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       ONE-TIME SLOW AUTOMATIC SCROLLING BEHAVIOR
       Sequence: First intentional downward scroll -> slow automatic scrolling ->
                 visitor intervenes -> manual scrolling for remainder of visit.
       ========================================================================== */
    const initOneTimeSlowAutoScroll = () => {
        // Reduced-motion check: Disable if visitor system prefers reduced motion
        const isReducedMotion = () => {
            return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        };

        if (isReducedMotion()) {
            return;
        }

        const STATE_IDLE = 'IDLE';
        const STATE_INITIATING = 'INITIATING';
        const STATE_AUTOSCROLLING = 'AUTOSCROLLING';
        const STATE_DISABLED = 'DISABLED';

        let state = STATE_IDLE;
        let rafId = null;
        let lastFrameTimestamp = null;
        let currentVirtualScrollY = 0;
        let autoScrollStartTime = 0;
        let gestureSettleTimer = null;
        let isTouching = false;
        let touchStartX = 0;
        let touchStartY = 0;
        let hasTouchDownward = false;

        // Gentle, consistent speed: ~28 CSS pixels per second (25-35 px/s range)
        const SPEED_PX_PER_SEC = 28;

        const getMaxScroll = () => {
            return Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            ) - window.innerHeight;
        };

        // Permanent shutdown for the remainder of this page visit
        const stopPermanently = (reason) => {
            if (state === STATE_DISABLED) return;
            state = STATE_DISABLED;

            if (gestureSettleTimer) {
                clearTimeout(gestureSettleTimer);
                gestureSettleTimer = null;
            }

            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            // Restore native smooth scrolling behavior
            document.documentElement.style.scrollBehavior = '';

            // Clean up event listeners so nothing ever fires again
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
        };

        // Frame-by-frame gentle scroll step (independent of screen refresh rate)
        const autoScrollStep = (timestamp) => {
            if (state !== STATE_AUTOSCROLLING) return;

            if (!lastFrameTimestamp) {
                lastFrameTimestamp = timestamp;
            }

            const elapsed = timestamp - lastFrameTimestamp;
            lastFrameTimestamp = timestamp;

            // Cap elapsed delta to 100ms to prevent jumps if frame stalls
            const deltaSec = Math.min(elapsed, 100) / 1000;
            currentVirtualScrollY += SPEED_PX_PER_SEC * deltaSec;

            const maxScroll = getMaxScroll();
            if (currentVirtualScrollY >= maxScroll - 2) {
                window.scrollTo(0, maxScroll);
                stopPermanently('bottom_reached');
                return;
            }

            window.scrollTo(0, currentVirtualScrollY);
            rafId = requestAnimationFrame(autoScrollStep);
        };

        const startAutoScrolling = () => {
            if (state === STATE_DISABLED) return;

            // Preloader check
            const preloaderEl = document.getElementById('preloader');
            if (preloaderEl && !preloaderEl.classList.contains('fade-out') && window.getComputedStyle(preloaderEl).display !== 'none') {
                return;
            }

            // Verify visitor has not reached the bottom
            const maxScroll = getMaxScroll();
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll >= maxScroll - 15) {
                stopPermanently('already_at_bottom');
                return;
            }

            state = STATE_AUTOSCROLLING;
            currentVirtualScrollY = currentScroll;
            lastFrameTimestamp = null;
            autoScrollStartTime = performance.now();

            // Set scrollBehavior to 'auto' while rAF runs for buttery smooth 60/120fps motion
            document.documentElement.style.scrollBehavior = 'auto';

            rafId = requestAnimationFrame(autoScrollStep);
        };

        const onGestureSettled = () => {
            if (state !== STATE_INITIATING) return;
            if (isTouching) return; // Do not start while visitor is still touching screen

            startAutoScrolling();
        };

        const resetGestureSettleTimer = () => {
            if (gestureSettleTimer) {
                clearTimeout(gestureSettleTimer);
            }
            gestureSettleTimer = setTimeout(onGestureSettled, 380);
        };

        // Check if intro video transition or preloader is active
        const isIntroActive = () => {
            if (window.__isIntroAutoScrolling) return true;
            const preloaderEl = document.getElementById('preloader');
            if (preloaderEl && !preloaderEl.classList.contains('fade-out') && window.getComputedStyle(preloaderEl).display !== 'none') {
                return true;
            }
            return false;
        };

        const isReadyForDownScroll = () => {
            if (state === STATE_DISABLED) return false;
            if (isIntroActive()) return false;
            return true;
        };

        // Mouse Wheel & Trackpad
        const handleWheel = (e) => {
            if (state === STATE_DISABLED) return;

            // When actively auto-scrolling:
            if (state === STATE_AUTOSCROLLING) {
                // Upward wheel is ALWAYS an intentional intervention
                if (e.deltaY < -1) {
                    stopPermanently('wheel_upward');
                    return;
                }
                // Downward wheel: treat the initiating burst as ONE action
                // Ignore residual downward inertia for the first 350ms of auto-scrolling
                const elapsedSinceStart = performance.now() - autoScrollStartTime;
                if (elapsedSinceStart > 350) {
                    stopPermanently('wheel_new_scroll');
                }
                return;
            }

            // During initiating gesture settle window:
            if (state === STATE_INITIATING) {
                if (e.deltaY < -2) {
                    // Upward scroll cancels auto-scroll permanently
                    stopPermanently('wheel_upward_canceled');
                } else if (e.deltaY > 0) {
                    // Part of same initiating burst: reset settle timer
                    resetGestureSettleTimer();
                }
                return;
            }

            // In IDLE state: detect first intentional downward scroll
            if (isReadyForDownScroll()) {
                if (e.deltaY > 5) {
                    state = STATE_INITIATING;
                    resetGestureSettleTimer();
                }
            }
        };

        // Touch gestures (iOS Safari, Android Chrome, Tablets)
        const handleTouchStart = (e) => {
            if (state === STATE_DISABLED) return;

            isTouching = true;

            // If auto-scrolling is running, touching the screen is an explicit pause
            if (state === STATE_AUTOSCROLLING) {
                const elapsedSinceStart = performance.now() - autoScrollStartTime;
                if (elapsedSinceStart > 100) {
                    stopPermanently('touch_pause');
                    return;
                }
            }

            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                hasTouchDownward = false;
            }
        };

        const handleTouchMove = (e) => {
            if (state === STATE_DISABLED) return;

            if (state === STATE_AUTOSCROLLING) {
                const elapsedSinceStart = performance.now() - autoScrollStartTime;
                if (elapsedSinceStart > 100) {
                    stopPermanently('touchmove_intervention');
                }
                return;
            }

            if (!e.touches || e.touches.length === 0) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY - currentY; // Finger dragging UP -> page scrolling DOWN
            const deltaX = touchStartX - currentX;

            // Upward scrolling gesture (finger dragging down)
            if (deltaY < -20 && Math.abs(deltaY) > Math.abs(deltaX)) {
                if (state === STATE_INITIATING) {
                    stopPermanently('touch_upward_canceled');
                }
                return;
            }

            // Downward scrolling gesture (finger dragging up)
            if (deltaY > 20 && Math.abs(deltaY) > Math.abs(deltaX)) {
                if (isReadyForDownScroll()) {
                    hasTouchDownward = true;
                    state = STATE_INITIATING;
                    resetGestureSettleTimer();
                }
            }
        };

        const handleTouchEnd = () => {
            isTouching = false;
            if (state === STATE_DISABLED) return;

            if (state === STATE_INITIATING && hasTouchDownward) {
                resetGestureSettleTimer();
            }
        };

        // Tap or Click handler:
        // Treat as explicit way to pause during auto-scrolling.
        // Passive listener ensures normal element actions (accordions, links, buttons) are preserved!
        const handlePointerDown = (e) => {
            if (state === STATE_AUTOSCROLLING) {
                const elapsedSinceStart = performance.now() - autoScrollStartTime;
                if (elapsedSinceStart > 100) {
                    stopPermanently('pointer_pause');
                }
            }
        };

        // Keyboard navigation
        const handleKeyDown = (e) => {
            if (state === STATE_DISABLED) return;

            const navKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Tab', 'Escape'];

            if (state === STATE_AUTOSCROLLING) {
                if (navKeys.includes(e.key)) {
                    stopPermanently('keyboard_intervention');
                }
                return;
            }

            if (isReadyForDownScroll()) {
                const isDownKey = e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
                if (isDownKey) {
                    state = STATE_INITIATING;
                    resetGestureSettleTimer();
                }
            } else if (state === STATE_INITIATING) {
                const isUpKey = e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Home' || (e.key === ' ' && e.shiftKey);
                if (isUpKey) {
                    stopPermanently('keyboard_upward_canceled');
                } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                    resetGestureSettleTimer();
                }
            }
        };

        // Visibility & Page Exit handlers
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPermanently('tab_hidden');
            }
        };

        const handlePageHide = () => {
            stopPermanently('page_hide');
        };

        // Reduced-motion runtime change listener
        if (window.matchMedia) {
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
                if (e.matches) {
                    stopPermanently('reduced_motion_enabled');
                }
            });
        }

        // Navigation elements: selecting a section or opening mobile menu permanently disables
        const navElements = document.querySelectorAll('.nav-link, .mobile-link, #mobileMenuBtn, #scrollToTop');
        navElements.forEach(el => {
            el.addEventListener('click', () => {
                stopPermanently('navigation_action');
            }, { passive: true });
        });

        // Register passive event listeners
        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
        window.addEventListener('pointerdown', handlePointerDown, { passive: true });
        window.addEventListener('keydown', handleKeyDown, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);
    };

    // Initialize One-Time Slow Auto-Scroller
    initOneTimeSlowAutoScroll();

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
       ROBOT PLAYGROUND INTERACTIVE ENGINE (Take Control — Hariharan’s Robot Playground)
       ========================================================================== */
    (function(){
        "use strict";
        var R = document.getElementById("rp");
        if (!R) return;
        var $ = function(i){ return document.getElementById(i); };
        var cv = $("cv"), ctx = cv.getContext("2d"), stage = $("stage");
        var W = 800, H = 520, BR = 17, SPEED = 210, START = {x: 400, y: 250};
        var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
        var IC = {
            0: "M12 9a3 3 0 100 6 3 3 0 000-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",
            1: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
            2: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z",
            3: "M9 21h6M10 21v-3h4v3M9 18c0-3 1-5 1-7a3 3 0 114 0c0 2 1 4 1 7zM12 3v2M11 4h2"
        };
        function svg(p){
            return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>';
        }
        var ZONES = [
            {n:"Robotics & Automation", s:"Robotics", x:150, y:140, r:38, t:"I’m Hariharan M, a Mechatronics student exploring how mechanical systems, electronics, and software work together."},
            {n:"AI & Coding", s:"AI & Coding", x:650, y:130, r:38, t:"I enjoy exploring AI applications, computer vision, and automation to turn ideas into useful experiences."},
            {n:"Design & Creativity", s:"Design", x:170, y:400, r:38, t:"I’m interested in UI/UX, digital experiences, and creative content that makes technology easier to understand."},
            {n:"Beyond Engineering", s:"Beyond", x:640, y:410, r:38, t:"Chess, magic, and mentalism are part of my world too—combining strategy, curiosity, and performance."}
        ];
        var OBS = [{x:300, y:80, w:36, h:150}, {x:470, y:290, w:150, h:34}, {x:250, y:340, w:100, h:34}];

        /* ---------- game state & logic (no DOM) ---------- */
        var S = {mode:"idle", x:START.x, y:START.y, vx:0, vy:0, ang:0, wheel:0, t:0, found:[0,0,0,0], open:-1, done:false, free:false, celebrate:0};
        var KEYS = {up:["ArrowUp","KeyW"], down:["ArrowDown","KeyS"], left:["ArrowLeft","KeyA"], right:["ArrowRight","KeyD"]};
        var codes = {}, pad = {};
        function held(d){ return !!pad[d] || KEYS[d].some(function(c){ return codes[c]; }); }
        function clamp(v,a,b){ return v<a?a:v>b?b:v; }
        function resolve(){
            S.x = clamp(S.x, 38, W - 38);
            S.y = clamp(S.y, 38, H - 38);
            OBS.forEach(function(o){
                var cx = clamp(S.x, o.x, o.x + o.w), cy = clamp(S.y, o.y, o.y + o.h), dx = S.x - cx, dy = S.y - cy, d = Math.hypot(dx, dy);
                if (d < BR) {
                    if (d > 0.001) { S.x = cx + dx / d * BR; S.y = cy + dy / d * BR; }
                    else {
                        var l = S.x - o.x, r = o.x + o.w - S.x, u = S.y - o.y, b = o.y + o.h - S.y, m = Math.min(l, r, u, b);
                        if (m === l) S.x = o.x - BR; else if (m === r) S.x = o.x + o.w + BR; else if (m === u) S.y = o.y - BR; else S.y = o.y + o.h + BR;
                    }
                }
            });
        }
        function update(dt){
            S.t += dt;
            if (S.celebrate > 0) S.celebrate -= dt;
            if (S.mode === "playing") {
                var ix = (held("right")?1:0) - (held("left")?1:0), iy = (held("down")?1:0) - (held("up")?1:0), m = Math.hypot(ix, iy);
                if (m) { ix /= m; iy /= m; }
                var a = 1 - Math.exp(-dt * 14);
                S.vx += (ix * SPEED - S.vx) * a;
                S.vy += (iy * SPEED - S.vy) * a;
                S.x += S.vx * dt; resolve();
                S.y += S.vy * dt; resolve();
                var sp = Math.hypot(S.vx, S.vy);
                S.wheel += sp * dt * 1.2;
                if (sp > 12) {
                    var tg = Math.atan2(S.vy, S.vx), df = ((tg - S.ang + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
                    S.ang += df * (1 - Math.exp(-dt * 12));
                }
                ZONES.forEach(function(z, i){
                    if (!S.found[i] && Math.hypot(S.x - z.x, S.y - z.y) < z.r) discover(i);
                });
            } else if (!RM) {
                S.ang = Math.sin(S.t * .7) * .7;
            }
        }

        /* ---------- rendering ---------- */
        function rr(x, y, w, h, r){
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(x, y, w, h, r);
            } else {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                ctx.lineTo(x + w, y + h - r);
                ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                ctx.lineTo(x + r, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
            }
        }
        function draw(){
            var k = cv.width / W;
            ctx.setTransform(k, 0, 0, k, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "#0c0e10"; rr(14, 34, 772, 484, 34); ctx.fill();
            var g = ctx.createLinearGradient(0, 14, 0, 498);
            g.addColorStop(0, "#2a2f37");
            g.addColorStop(1, "#1f2329");
            ctx.fillStyle = g; rr(14, 14, 772, 484, 34); ctx.fill();
            ctx.strokeStyle = "rgba(143,211,255,.25)"; ctx.lineWidth = 2; rr(14, 14, 772, 484, 34); ctx.stroke();
            ctx.strokeStyle = "rgba(255,255,255,.04)"; ctx.lineWidth = 1; ctx.beginPath();
            for (var gx = 60; gx < W - 40; gx += 50) { ctx.moveTo(gx, 30); ctx.lineTo(gx, 484); }
            for (var gy = 60; gy < H - 40; gy += 50) { ctx.moveTo(30, gy); ctx.lineTo(770, gy); }
            ctx.stroke();
            ctx.setLineDash([6, 10]); ctx.strokeStyle = "rgba(143,211,255,.14)"; ctx.lineWidth = 2; ctx.beginPath();
            ZONES.forEach(function(z){ ctx.moveTo(START.x, START.y); ctx.lineTo(z.x, z.y); });
            ctx.stroke(); ctx.setLineDash([]);
            ctx.strokeStyle = "rgba(255,138,61,.45)"; ctx.beginPath(); ctx.arc(START.x, START.y, 26, 0, 7); ctx.stroke();
            OBS.forEach(function(o){
                ctx.fillStyle = "rgba(0,0,0,.35)"; rr(o.x + 8, o.y + 14, o.w, o.h, 10); ctx.fill();
                ctx.fillStyle = "#14171b"; rr(o.x, o.y + 9, o.w, o.h, 10); ctx.fill();
                ctx.fillStyle = "#39404b"; rr(o.x, o.y, o.w, o.h, 10); ctx.fill();
                ctx.strokeStyle = "rgba(143,211,255,.35)"; ctx.lineWidth = 1.5; rr(o.x + 3, o.y + 3, o.w - 6, o.h - 6, 8); ctx.stroke();
            });
            ZONES.forEach(function(z, i){
                var f = S.found[i], col = f ? "#4ade80" : "#8fd3ff", p = (RM || f) ? 0 : Math.sin(S.t * 3) * 2;
                if (f) {
                    var rg = ctx.createRadialGradient(z.x, z.y, 6, z.x, z.y, z.r + 34);
                    rg.addColorStop(0, "rgba(74,222,128,.4)");
                    rg.addColorStop(1, "rgba(74,222,128,0)");
                    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(z.x, z.y, z.r + 34, 0, 7); ctx.fill();
                }
                ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(z.x + 4, z.y + 8, z.r, z.r * .9, 0, 0, 7); ctx.fill();
                ctx.fillStyle = f ? "rgba(74,222,128,.22)" : "rgba(143,211,255,.08)";
                ctx.strokeStyle = col; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(z.x, z.y, z.r + p, 0, 7); ctx.fill(); ctx.stroke();
                ctx.fillStyle = col; ctx.font = "700 22px system-ui,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText(f ? "✓" : String(i + 1), z.x, z.y + 1);
                ctx.font = "600 14px system-ui,sans-serif"; ctx.fillStyle = "#f4f6f8"; ctx.fillText(z.s, z.x, z.y + z.r + 20);
                if (S.celebrate > 0 && !RM) {
                    var q = (3 - S.celebrate) % 1;
                    ctx.strokeStyle = "rgba(74,222,128," + (1 - q) * .8 + ")"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.arc(z.x, z.y, z.r + q * 60, 0, 7); ctx.stroke();
                }
            });
            drawRobot();
        }
        function drawRobot(){
            ctx.save(); ctx.translate(S.x, S.y);
            ctx.fillStyle = "rgba(0,0,0,.38)"; ctx.beginPath(); ctx.ellipse(3, 12, 21, 12, 0, 0, 7); ctx.fill();
            ctx.rotate(S.ang);
            [-1, 1].forEach(function(s){
                ctx.fillStyle = "#0f1216"; rr(-11, s * 15 - 4.5, 22, 9, 4.5); ctx.fill();
                ctx.strokeStyle = "#59626f"; ctx.lineWidth = 1.5; ctx.beginPath();
                for (var i = 0; i < 4; i++) {
                    var x = ((i * 6 + S.wheel) % 24 + 24) % 24 - 12;
                    if (Math.abs(x) < 9) { ctx.moveTo(x, s * 15 - 3); ctx.lineTo(x, s * 15 + 3); }
                }
                ctx.stroke();
            });
            ctx.fillStyle = "#e8edf3"; rr(-16, -12.5, 32, 25, 10); ctx.fill();
            ctx.strokeStyle = "#9aa6b4"; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = "#11151a"; rr(1, -9.5, 14, 19, 7); ctx.fill();
            var b = (!RM && (S.t % 3.4) > 3.25) ? .15 : 1;
            ctx.fillStyle = "#8fd3ff"; ctx.shadowColor = "#8fd3ff"; ctx.shadowBlur = 6;
            [-4.5, 4.5].forEach(function(e){ ctx.beginPath(); ctx.ellipse(8.5, e, 2.7, 2.7 * b, 0, 0, 7); ctx.fill(); });
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#9aa6b4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-13, -6); ctx.stroke();
            ctx.fillStyle = "#ff8a3d"; ctx.beginPath(); ctx.arc(-13, -6, 2.6 + (RM ? 0 : Math.sin(S.t * 5) * .5), 0, 7); ctx.fill();
            ctx.restore();
        }

        /* ---------- loop & intersection observer ---------- */
        var raf = 0, last = 0, inView = true;
        function needs(){ return inView && (S.mode === "playing" || (!RM && (S.mode === "idle" || S.mode === "explore"))); }
        function frame(ts){
            raf = 0;
            var dt = Math.min(.05, (ts - last) / 1000 || 0);
            last = ts;
            update(dt);
            draw();
            if (needs() && !document.hidden) raf = requestAnimationFrame(frame);
        }
        function kick(){
            if (!raf && !document.hidden && needs()) {
                last = performance.now();
                raf = requestAnimationFrame(frame);
            } else if (!raf) draw();
        }
        function size(){
            var w = stage.clientWidth || 600, d = Math.min(window.devicePixelRatio || 1, 2), pw = Math.min(Math.round(w * d), 1200);
            cv.width = pw; cv.height = Math.round(pw * H / W); draw();
        }
        if (window.ResizeObserver) new ResizeObserver(size).observe(stage); else addEventListener("resize", size);

        if ('IntersectionObserver' in window) {
            inView = false;
            var obs = new IntersectionObserver(function(entries){
                inView = entries[0].isIntersecting;
                if (inView) {
                    kick();
                } else {
                    if (S.mode === "playing") setPause(true);
                    if (raf) { cancelAnimationFrame(raf); raf = 0; }
                }
            }, { threshold: 0.05 });
            obs.observe(R);
        }

        /* ---------- UI ---------- */
        var chips = $("chips"), cardEl = $("card"), stEl = $("st");
        ZONES.forEach(function(z, i){
            var li = document.createElement("li"), b = document.createElement("button");
            b.className = "chip"; b.type = "button"; b.disabled = true; b.setAttribute("aria-label", z.n + " (not discovered yet)");
            b.innerHTML = svg(IC[i]) + '<span></span>'; b.lastChild.textContent = z.n;
            b.addEventListener("click", function(){ if (S.found[i]) openCard(i); else if (S.free) discover(i); });
            li.appendChild(b); chips.appendChild(li);
        });
        function say(t){ stEl.textContent = t; }
        function setMode(m){
            S.mode = m; R.dataset.mode = m;
            $("intro").hidden = !(m === "idle");
            $("pauseov").hidden = !(m === "paused");
            $("pause").disabled = !(m === "playing" || m === "paused");
            $("pause").textContent = m === "paused" ? "Resume" : "Pause";
            refreshChips(); kick();
        }
        function refreshChips(){
            [].forEach.call(chips.children, function(li, i){
                var b = li.firstChild, f = S.found[i];
                b.disabled = !(f || S.free); b.classList.toggle("found", !!f);
                b.setAttribute("aria-label", ZONES[i].n + (f ? " (discovered). Open card" : S.free ? ". Open card" : " (not discovered yet)"));
                b.setAttribute("aria-pressed", S.open === i ? "true" : "false");
            });
            var n = S.found.reduce(function(a, b){ return a + b; }, 0);
            $("cnt").textContent = n; $("fill").style.width = n * 25 + "%";
        }
        function openCard(i){
            S.open = i; $("ct").textContent = ZONES[i].n; $("cp").textContent = ZONES[i].t;
            cardEl.classList.remove("show", "pop"); void cardEl.offsetWidth; cardEl.classList.add("show"); if (!RM) cardEl.classList.add("pop");
            refreshChips();
        }
        function closeCard(){
            S.open = -1; cardEl.classList.remove("show", "pop"); refreshChips();
            if (S.mode === "playing") stage.focus({preventScroll: true});
        }
        function discover(i){
            S.found[i] = 1; openCard(i); say("Discovered: " + ZONES[i].n + ".");
            if (S.found.every(Boolean)) complete();
        }
        function complete(){ S.done = true; S.celebrate = 3; $("done").hidden = false; say("Exploration complete."); kick(); }
        function start(){ setMode("playing"); say("Driving. Find the glowing markers."); stage.focus({preventScroll: true}); }
        function explore(){ S.free = true; setMode("explore"); say("Choose a zone below to open its card."); }
        function setPause(on){
            if (on && S.mode === "playing") { codes = {}; pad = {}; clearPad(); setMode("paused"); say("Paused. Press Resume to continue."); }
            else if (!on && S.mode === "paused") { setMode("playing"); say("Driving."); stage.focus({preventScroll: true}); }
        }
        function reset(toPlay){
            var wasPlay = S.mode === "playing" || S.mode === "paused";
            S.x = START.x; S.y = START.y; S.vx = S.vy = 0; S.ang = 0; S.found = [0, 0, 0, 0]; S.open = -1; S.done = false; S.celebrate = 0; S.free = false;
            codes = {}; pad = {}; clearPad();
            $("done").hidden = true; cardEl.classList.remove("show", "pop");
            if (toPlay === true || wasPlay) { setMode("playing"); say("Back at the start. Zones discovered: 0/4."); stage.focus({preventScroll: true}); }
            else { setMode("idle"); say("Press Start Exploring to begin."); }
            draw();
        }
        $("start").addEventListener("click", start);
        $("free").addEventListener("click", explore);
        $("pause").addEventListener("click", function(){ setPause(S.mode === "playing"); });
        $("resume").addEventListener("click", function(){ setPause(false); });
        $("reset").addEventListener("click", function(){ reset(); });
        $("again").addEventListener("click", function(){ reset(true); });
        $("cx").addEventListener("click", closeCard);

        /* ---------- input ---------- */
        var map = {}; Object.keys(KEYS).forEach(function(d){ KEYS[d].forEach(function(c){ map[c] = d; }); });
        document.addEventListener("keydown", function(e){
            if (S.mode !== "playing" || !map[e.code] || !R.contains(document.activeElement)) return;
            codes[e.code] = true; e.preventDefault();
        });
        document.addEventListener("keyup", function(e){ if (codes[e.code]) delete codes[e.code]; });
        var padBtns = [].slice.call($("dpad").querySelectorAll("button"));
        function clearPad(){ padBtns.forEach(function(b){ b.classList.remove("on"); }); pad = {}; }
        padBtns.forEach(function(b){
            var d = b.dataset.d;
            function off(){ delete pad[d]; b.classList.remove("on"); }
            b.addEventListener("pointerdown", function(e){
                if (S.mode !== "playing") return;
                e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch(_) {}
                pad[d] = true; b.classList.add("on"); stage.focus({preventScroll: true});
            });
            ["pointerup", "pointercancel", "lostpointercapture", "pointerleave"].forEach(function(n){ b.addEventListener(n, off); });
            b.addEventListener("contextmenu", function(e){ e.preventDefault(); });
        });
        R.addEventListener("focusout", function(){
            setTimeout(function(){ if (S.mode === "playing" && !R.contains(document.activeElement)) setPause(true); }, 0);
        });
        R.addEventListener("pointerdown", function(e){
            if (S.mode === "playing" && !e.target.closest("button")) stage.focus({preventScroll: true});
        });
        addEventListener("blur", function(){ if (S.mode === "playing") setPause(true); });
        document.addEventListener("visibilitychange", function(){
            if (document.hidden) { if (S.mode === "playing") setPause(true); if (raf) { cancelAnimationFrame(raf); raf = 0; } } else kick();
        });
        setMode("idle"); size();
    })();
});
