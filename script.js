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
       CIRCUIT RUNNER INTERACTIVE ENGINE (Circuit Runner — Hariharan’s Tech Playground)
       ========================================================================== */
    (function(){
        "use strict";
        var R = document.getElementById("cr");
        if (!R) return;
        var $ = function(id){ return document.getElementById(id); };
        var cv = $('cv');
        if (!cv) return;
        var ctx = cv.getContext('2d'), stage = $('stage'), ov = $('ov');
        if (!stage || !ov || !ctx) return;

        var W=800, H=360, G=290, RX=130, RW=44, RH=46, GRAV=2300, JV=780, BASE=270, MAXS=470, ZL=6000;
        var OR='#ff7a1a', ICE='#7fd6ff', GR='#3dff9a', TN=['Circuit board','Server room','AI lab'];
        var RMQ = matchMedia('(prefers-reduced-motion: reduce)');
        var RM = RMQ.matches;
        if (RMQ.addEventListener) RMQ.addEventListener('change', function(e){ RM = e.matches; });

        var rnd = function(a,b){ return a + Math.random()*(b-a); };
        var hs = function(n){ n = Math.sin(n*127.1+311.7)*43758.5453; return n - Math.floor(n); };
        var rr = function(x,y,w,h,r){
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x,y,w,h,r);
            else ctx.rect(x,y,w,h);
        };

        var state='ready', score=0, best=0, streak=0, miss=0, mult=1, shield=false, invuln=0, flash=0, shake=0, scrollX=0, speed=BASE, elapsed=0, nextX=0, t=0, sinceShield=3, wr=0, sq=0, bl=2, y=G, vy=0, jumpsUsed=0, grounded=true, jumpBuf=0, chips=[], haz=[], gaps=[], pups=[], parts=[], floats=[], raf=0, last=0, snd=false, ac=null;

        try { best = +localStorage.getItem('circuitRunnerBest') || 0; } catch(e){}
        function saveBest(){ try { localStorage.setItem('circuitRunnerBest', String(Math.floor(best))); } catch(e){} }
        function beep(f,d,ty,v){
            if (!snd || !ac) return;
            try {
                var o = ac.createOscillator(), g = ac.createGain(), n = ac.currentTime;
                o.type = ty || 'sine';
                o.frequency.value = f;
                g.gain.setValueAtTime(v || .05, n);
                g.gain.exponentialRampToValueAtTime(.0001, n+d);
                o.connect(g);
                g.connect(ac.destination);
                o.start();
                o.stop(n+d);
            } catch(e){}
        }
        function reset(){
            score=0; streak=0; miss=0; mult=1; shield=false; invuln=0; flash=0; shake=0; scrollX=0; speed=BASE; elapsed=0; t=0; sinceShield=3; wr=0; sq=0; bl=2; y=G; vy=0; jumpsUsed=0; grounded=true; jumpBuf=0; chips=[]; haz=[]; gaps=[]; pups=[]; parts=[]; floats=[]; nextX=RX+560; hud(true); draw();
        }

        /* ---------- generation ---------- */
        function chip(x,yy,opt){ chips.push({x:x, y:yy, opt:!!opt}); }
        function arc(cx,n){
            var sp = speed*.6;
            for (var i=0; i<n; i++){
                var u = .1 + .8*i/(n-1);
                chip(cx + (u-.5)*sp, G - 23 - .85*4*132*u*(1-u));
            }
        }
        function spawn(x){
            if (sinceShield>=8 && !shield && Math.random()<.6){
                sinceShield=0; pups.push({x:x+100, y:G-85}); arc(x+100,5); return [220, false];
            }
            sinceShield++;
            var hard = Math.min(1, elapsed/60), k = Math.random()*(100-14*hard) + 14*hard;
            if (k<16){
                var n = 4 + (Math.random()*3|0);
                for (var i=0; i<n; i++) chip(x+i*40, G-28);
                return [n*40, false];
            }
            if (k<34){
                haz.push({t:'b', x:x+120, w:30, h:34, bot:0}); arc(x+135, 5); return [270, true];
            }
            if (k<46){
                haz.push({t:'b', x:x+100, w:30, h:34, bot:0}, {t:'b', x:x+166, w:30, h:34, bot:0}); arc(x+148, 6); return [300, true];
            }
            if (k<62){
                var gw = Math.max(80, Math.min(140, speed*.28));
                gaps.push({x:x+110, w:gw}); arc(x+110+gw/2, 5); return [220+gw, true];
            }
            if (k<78){
                haz.push({t:'s', x:x+110, w:26, h:28, bot:8}); arc(x+123, 5); return [260, true];
            }
            if (k<88){
                for (var i=0; i<4; i++) chip(x+i*40, G-215, true);
                return [200, false];
            }
            for (var i=0; i<7; i++) chip(x+i*42, G-30-40*Math.sin(i*.9));
            return [300, false];
        }
        function cull(a,m){
            var j=0;
            for (var i=0; i<a.length; i++){
                var o = a[i];
                if (!o.dead && o.x + (o.w||0) > m) a[j++] = o;
            }
            a.length = j;
        }

        /* ---------- fx ---------- */
        function burst(x,yy,n,c,sp,life){
            if (RM) n = Math.min(n, 2);
            for (var i=0; i<n && parts.length<90; i++){
                var a = Math.random()*6.283, v = rnd(.3,1)*(sp||160);
                parts.push({x:x, y:yy, vx:Math.cos(a)*v, vy:Math.sin(a)*v-40, l:life||.45, m:life||.45, c:c, s:rnd(2,4)});
            }
        }
        function ring(x,yy,c){
            if (!RM && parts.length<90) parts.push({ring:1, x:x, y:yy, l:.4, m:.4, c:c, vx:0, vy:0});
        }
        function fl(x,yy,txt,c){
            if (floats.length<8) floats.push({x:x, y:yy, txt:txt, c:c, l:.8});
        }

        /* ---------- game ---------- */
        function tryJump(){
            if (!grounded && jumpsUsed>=2) return false;
            jumpsUsed = grounded ? 1 : jumpsUsed + 1;
            vy = -(jumpsUsed>1 ? JV*.92 : JV);
            grounded = false; sq = -.7;
            var cx = RX + RW/2;
            if (jumpsUsed>1){
                ring(cx, y-20, ICE); burst(cx, y, 6, ICE, 120, .35); beep(760, .12, 'triangle');
            } else {
                burst(cx, G, 4, '#8a929c', 90, .3); beep(480, .1, 'triangle');
            }
            return true;
        }
        function press(){
            if (state==='running') jumpBuf = .12;
        }
        function hit(h){
            if (invuln>0) return;
            var cx = RX + RW/2;
            if (shield){
                shield = false; invuln = .9;
                ring(cx, y-24, ICE); burst(cx, y-24, 10, ICE, 200);
                if (h) h.dead = true;
                fl(cx, y-24-36, 'Shield!', ICE);
                beep(300, .25, 'square');
            } else {
                var loss = Math.min(Math.floor(score), 50);
                score -= loss; streak = 0; miss = 0; mult = 1; invuln = 1.5; flash = 1; shake = RM ? 0 : .3;
                burst(cx, y-24, 10, OR, 200);
                fl(cx, y-60, '-' + loss, '#ff5a4a');
                if (h) h.hit = true;
                beep(120, .3, 'sawtooth', .07);
                if (!RM && $('bxsc') && $('bxsc').animate){
                    $('bxsc').animate([{color:'#ff5a4a', transform:'scale(1.08)'},{color:'#e9edf2', transform:'none'}], 300);
                }
            }
        }
        function update(dt){
            elapsed += dt; t += dt;
            speed = Math.min(MAXS, BASE + elapsed*3.2);
            scrollX += speed*dt; wr += speed*dt/8; score += speed*dt/60;
            while (nextX < scrollX + W + 260){
                var hard = Math.min(1, elapsed/60), r = spawn(nextX);
                nextX += r[0] + (r[1] ? speed*(1.15 - .25*hard) + rnd(20, 100)*(1 - hard*.5) : rnd(70, 150));
            }
            jumpBuf -= dt;
            if (jumpBuf > 0 && tryJump()) jumpBuf = 0;
            var rc = RX + RW/2 + scrollX;
            var over = gaps.some(function(g){ return rc-12 > g.x && rc+12 < g.x+g.w; });
            vy += GRAV*dt; y += vy*dt;
            if (y >= G){
                if (over && invuln <= 0){
                    grounded = false;
                    if (y > G + 34){
                        hit(null); y = G; vy = -JV*.85; jumpsUsed = 1; sq = -.6;
                    }
                } else {
                    if (!grounded && vy > 200){
                        sq = .8; burst(RX + RW/2, G, 4, '#8a929c', 90, .3);
                    }
                    y = G; vy = 0; grounded = true; jumpsUsed = 0;
                }
            } else {
                grounded = false;
            }
            sq += (0 - sq)*Math.min(1, dt*8);
            invuln = Math.max(0, invuln - dt);
            flash = Math.max(0, flash - dt*3);
            shake = Math.max(0, shake - dt);
            bl -= dt;
            if (bl < -.12) bl = rnd(1.8, 4);

            var L = scrollX + RX + 8, R = scrollX + RX + RW - 8, T = y - RH + 6, B = y - 3, cx = RX + RW/2, cy = y - 23;
            for (var i = 0; i < haz.length; i++){
                var h = haz[i];
                if (h.dead || h.hit || invuln > 0) continue;
                if (R > h.x && L < h.x + h.w && B > G - h.bot - h.h && T < G - h.bot){ hit(h); }
            }
            for (var i = 0; i < chips.length; i++){
                var c = chips[i];
                if (c.dead) continue;
                var sx = c.x - scrollX;
                if (Math.hypot(sx - cx, c.y - cy) < 28){
                    c.dead = true; streak++; miss = 0;
                    mult = Math.min(5, 1 + (streak/4|0));
                    var p = 10 * mult;
                    score += p;
                    burst(sx, c.y, 8, GR, 170, .4);
                    fl(sx, c.y - 12, '+' + p, GR);
                    beep(520 + Math.min(streak, 12)*40, .08, 'square', .03);
                } else if (!c.m && sx < cx - 26){
                    c.m = 1;
                    if (!c.opt && ++miss >= 2){ streak = 0; mult = 1; }
                }
            }
            for (var i = 0; i < pups.length; i++){
                var p = pups[i];
                if (!p.dead && Math.hypot(p.x - scrollX - cx, p.y - cy) < 30){
                    p.dead = true; shield = true;
                    ring(cx, cy, ICE); burst(cx, cy, 10, ICE, 170);
                    fl(cx, y - 60, 'Shield ready', ICE);
                    beep(660, .2, 'sine', .06);
                }
            }
            cull(chips, scrollX - 50);
            cull(haz, scrollX - 50);
            cull(gaps, scrollX - 50);
            cull(pups, scrollX - 50);
            for (var i = parts.length - 1; i >= 0; i--){
                var prt = parts[i];
                prt.l -= dt; prt.x += prt.vx*dt; prt.y += prt.vy*dt; prt.vy += 300*dt;
                if (prt.l <= 0) parts.splice(i, 1);
            }
            for (var i = floats.length - 1; i >= 0; i--){
                var flt = floats[i];
                flt.l -= dt; flt.y -= 40*dt;
                if (flt.l <= 0) floats.splice(i, 1);
            }
            if (score > best) best = score;
            hud();
        }

        var hc = {};
        function hud(f){
            var v = {sc: Math.floor(score), mu: '×' + mult, sh: shield ? 'On' : 'Off', bs: Math.floor(best)};
            for (var k in v){
                if (f || hc[k] !== v[k]){
                    hc[k] = v[k];
                    var el = $(k);
                    if (el) el.textContent = v[k];
                }
            }
            var shEl = $('sh'), muEl = $('mu');
            if (shEl) shEl.className = shield ? 'on' : '';
            if (muEl) muEl.className = mult > 1 ? 'mx' : '';
        }

        /* ---------- rendering ---------- */
        var gc = {};
        function lg(k, a, b, c0, c1){
            return gc[k] || (gc[k] = (function(){
                var g = ctx.createLinearGradient(0, a, 0, b);
                g.addColorStop(0, c0);
                g.addColorStop(1, c1);
                return g;
            })());
        }
        function layer(f, cs, fn){
            var o = scrollX * f, i0 = Math.floor(o / cs);
            for (var i = i0; i <= i0 + Math.ceil(W / cs) + 1; i++){
                fn(i, i * cs - o, hs(i * 7.31 + f * 13));
            }
        }
        function bg(k, a){
            ctx.globalAlpha = a;
            ctx.fillStyle = lg('b' + k, 0, G, ['#1c222b', '#1a1f27', '#15263a'][k], ['#33404f', '#303846', '#2a4560'][k]);
            ctx.fillRect(0, 0, W, G);
            if (k === 0){
                ctx.strokeStyle = 'rgba(127,214,255,.38)'; ctx.lineWidth = 2;
                layer(.2, 170, function(i, x, r){
                    var y1 = 50 + r * 140, y2 = 190 + hs(i * 3.1) * 60;
                    ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x + 60, y1); ctx.lineTo(x + 90, y1 + 30); ctx.lineTo(x + 170, y1 + 30);
                    ctx.moveTo(x, y2); ctx.lineTo(x + 100, y2); ctx.lineTo(x + 120, y2 - 20); ctx.lineTo(x + 170, y2 - 20);
                    ctx.stroke(); ctx.beginPath(); ctx.arc(x + 170, y1 + 30, 3, 0, 6.3); ctx.stroke();
                });
                layer(.45, 260, function(i, x, r){
                    if (r < .35) return;
                    var y1 = 60 + r * 130;
                    ctx.fillStyle = '#2b333d'; rr(x, y1, 80, 48, 5); ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.stroke();
                    ctx.fillStyle = 'rgba(180,190,200,.25)';
                    for (var j = 0; j < 5; j++){ ctx.fillRect(x + 8 + j * 15, y1 - 5, 6, 5); ctx.fillRect(x + 8 + j * 15, y1 + 48, 6, 5); }
                    ctx.fillStyle = 'rgba(255,122,26,.6)'; ctx.beginPath(); ctx.arc(x + 10, y1 + 10, 2.5, 0, 6.3); ctx.fill();
                });
            } else if (k === 1){
                ctx.fillStyle = '#090b0e'; ctx.fillRect(0, 0, W, 14);
                layer(.22, 120, function(i, x, r){
                    var top = 70 + r * 50;
                    ctx.fillStyle = '#262d37'; ctx.fillRect(x, top, 96, G - top);
                    for (var yy = top + 10; yy < G - 10; yy += 16){
                        ctx.fillStyle = '#12161b'; ctx.fillRect(x + 8, yy, 80, 10);
                        var on = RM ? hs(i + yy) > .5 : Math.sin(t * 3 + i * 5 + yy) > .2;
                        if (on){
                            ctx.fillStyle = hs(i * yy) > .65 ? 'rgba(255,122,26,.8)' : 'rgba(61,255,154,.7)';
                            ctx.fillRect(x + 12, yy + 3, 4, 4);
                        }
                    }
                });
                layer(.5, 300, function(i, x, r){
                    if (r < .45) return;
                    ctx.fillStyle = '#323b47'; ctx.fillRect(x, 120, 60, G - 120);
                    ctx.fillStyle = 'rgba(127,214,255,.35)'; ctx.fillRect(x + 28, 130, 3, G - 150);
                });
            } else {
                ctx.fillStyle = 'rgba(127,214,255,.3)';
                layer(.15, 40, function(i, x){
                    for (var yy = 30; yy < G; yy += 40) ctx.fillRect(x, yy, 2, 2);
                });
                var rg = ctx.createRadialGradient(620, 120, 10, 620, 120, 170);
                rg.addColorStop(0, 'rgba(127,214,255,' + (.16 + (RM ? 0 : Math.sin(t * 1.5) * .04)) + ')');
                rg.addColorStop(1, 'rgba(127,214,255,0)');
                ctx.fillStyle = rg; ctx.fillRect(420, 0, 380, G);
                layer(.35, 220, function(i, x){
                    var a = [], b = [];
                    for (var j = 0; j < 4; j++){ a.push(40 + hs(i * 5 + j) * 190); b.push(40 + hs((i + 1) * 5 + j) * 190); }
                    ctx.strokeStyle = 'rgba(127,214,255,.3)'; ctx.beginPath();
                    for (var j = 0; j < a.length; j++){ ctx.moveTo(x, a[j]); ctx.lineTo(x + 220, b[j]); }
                    ctx.stroke();
                    for (var j = 0; j < 4; j++){
                        ctx.fillStyle = j % 3 ? 'rgba(127,214,255,.5)' : 'rgba(255,122,26,.55)';
                        ctx.beginPath(); ctx.arc(x, a[j], 4, 0, 6.3); ctx.fill();
                    }
                });
            }
            ctx.globalAlpha = 1;
        }
        function draw(){
            ctx.setTransform(cv.width / W, 0, 0, cv.width / W, 0, 0);
            ctx.clearRect(0, 0, W, H); ctx.save();
            if (shake > 0) ctx.translate(rnd(-4, 4) * shake / .3, rnd(-3, 3) * shake / .3);
            var pos = Math.max(0, scrollX) / ZL, z = Math.floor(pos), f = pos - z, b = RM ? (f > .9 ? 1 : 0) : Math.max(0, (f - .85) / .15);
            bg(z % 3, 1);
            if (b > 0) bg((z + 1) % 3, b);
            ctx.fillStyle = lg('gr', G, H, '#59616c', '#2b3038');
            ctx.fillRect(0, G, W, H - G);
            ctx.fillStyle = '#626a74'; ctx.fillRect(0, G, W, 3);
            ctx.fillStyle = 'rgba(255,122,26,.85)'; ctx.fillRect(0, G + 3, W, 2);
            ctx.strokeStyle = ICE; ctx.globalAlpha = .7; ctx.lineWidth = 2; ctx.setLineDash([18, 14]);
            ctx.lineDashOffset = scrollX % 32;
            ctx.beginPath(); ctx.moveTo(0, G + 22); ctx.lineTo(W, G + 22); ctx.stroke();
            ctx.setLineDash([]); ctx.globalAlpha = 1;
            ctx.fillStyle = '#14171b';
            for (var x = -(scrollX % 80); x < W; x += 80){ ctx.beginPath(); ctx.arc(x + 40, G + 46, 2.5, 0, 6.3); ctx.fill(); }
            for (var i = 0; i < gaps.length; i++){
                var g = gaps[i];
                var sx = g.x - scrollX;
                if (sx > W || sx + g.w < 0) continue;
                ctx.fillStyle = '#050608'; ctx.fillRect(sx, G, g.w, H - G);
                ctx.fillStyle = OR; ctx.fillRect(sx - 3, G, 3, H - G); ctx.fillRect(sx + g.w, G, 3, H - G);
                ctx.strokeStyle = ICE; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(sx, G + 22); ctx.lineTo(sx + 14, G + 22 + (Math.sin(t * 9 + g.x) > 0 ? 8 : 3));
                ctx.moveTo(sx + g.w, G + 22); ctx.lineTo(sx + g.w - 14, G + 26); ctx.stroke();
                if (!RM && Math.sin(t * 22 + g.x) > .4){
                    ctx.strokeStyle = '#ffd38a'; ctx.beginPath(); ctx.moveTo(sx + 4, G - 2); ctx.lineTo(sx + 10, G - 12); ctx.lineTo(sx + 6, G - 20); ctx.stroke();
                }
            }
            for (var i = 0; i < haz.length; i++){
                var h = haz[i];
                var sx = h.x - scrollX;
                if (sx > W || sx + h.w < -10) continue;
                ctx.globalAlpha = h.hit ? .35 : 1;
                if (h.t === 'b'){
                    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(sx + 15, G + 2, 20, 4, 0, 0, 6.3); ctx.fill();
                    ctx.fillStyle = lg('hb', G - 34, G, '#6a717b', '#3b4047'); rr(sx, G - 34, 30, 34, 5); ctx.fill();
                    ctx.fillStyle = OR; ctx.fillRect(sx, G - 34, 30, 6);
                    ctx.fillStyle = '#14171b'; ctx.fillRect(sx + 13, G - 24, 4, 12); ctx.fillRect(sx + 13, G - 8, 4, 4);
                } else {
                    var cx = sx + 13, cy = G - 22, j = RM ? .3 : 1;
                    var gl = ctx.createRadialGradient(cx, cy, 2, cx, cy, 26);
                    gl.addColorStop(0, 'rgba(255,170,80,.7)'); gl.addColorStop(1, 'rgba(255,122,26,0)');
                    ctx.fillStyle = gl; ctx.fillRect(cx - 26, cy - 26, 52, 52);
                    ctx.strokeStyle = '#ffd38a'; ctx.lineWidth = 2; ctx.beginPath();
                    for (var a = 0; a < 6; a++){
                        var an = a * 1.047 + t * (RM ? 0 : 8);
                        ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * (14 + rnd(-4, 4) * j), cy + Math.sin(an) * (14 + rnd(-4, 4) * j));
                    }
                    ctx.stroke(); ctx.fillStyle = '#fff3dc'; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 6.3); ctx.fill();
                }
                ctx.globalAlpha = 1;
            }
            for (var i = 0; i < chips.length; i++){
                var c = chips[i];
                var sx = c.x - scrollX;
                if (sx > W + 20 || sx < -20) continue;
                var yy = c.y + (RM ? 0 : Math.sin(t * 4 + c.x * .05) * 3);
                ctx.fillStyle = 'rgba(61,255,154,.16)'; ctx.beginPath(); ctx.arc(sx, yy, 14, 0, 6.3); ctx.fill();
                ctx.fillStyle = '#16251d'; rr(sx - 8, yy - 8, 16, 16, 3); ctx.fill();
                ctx.strokeStyle = GR; ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = GR; ctx.fillRect(sx - 3, yy - 3, 6, 6);
                for (var k = -1; k <= 1; k += 2){ ctx.fillRect(sx + k * 10 - 1, yy - 4, 2, 3); ctx.fillRect(sx + k * 10 - 1, yy + 2, 2, 3); }
            }
            for (var i = 0; i < pups.length; i++){
                var p = pups[i];
                var sx = p.x - scrollX, yy = p.y + (RM ? 0 : Math.sin(t * 3) * 4);
                ctx.fillStyle = 'rgba(127,214,255,.18)'; ctx.beginPath(); ctx.arc(sx, yy, 18, 0, 6.3); ctx.fill();
                ctx.strokeStyle = ICE; ctx.lineWidth = 2.5; ctx.beginPath();
                ctx.moveTo(sx, yy - 11); ctx.lineTo(sx + 9, yy - 7); ctx.lineTo(sx + 8, yy + 3); ctx.lineTo(sx, yy + 11); ctx.lineTo(sx - 8, yy + 3); ctx.lineTo(sx - 9, yy - 7);
                ctx.closePath(); ctx.stroke(); ctx.fillStyle = 'rgba(127,214,255,.35)'; ctx.fill();
            }
            robot();
            for (var i = 0; i < parts.length; i++){
                var prt = parts[i];
                ctx.globalAlpha = Math.max(0, prt.l / prt.m);
                if (prt.ring){
                    ctx.strokeStyle = prt.c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(prt.x, prt.y, 16 + (1 - prt.l / prt.m) * 40, 0, 6.3); ctx.stroke();
                } else {
                    ctx.fillStyle = prt.c; ctx.fillRect(prt.x, prt.y, prt.s, prt.s);
                }
            }
            ctx.globalAlpha = 1;
            ctx.font = '700 15px ui-monospace,Menlo,monospace'; ctx.textAlign = 'center';
            for (var i = 0; i < floats.length; i++){
                var flt = floats[i];
                ctx.globalAlpha = Math.min(1, flt.l * 2); ctx.fillStyle = flt.c; ctx.fillText(flt.txt, flt.x, flt.y);
            }
            ctx.globalAlpha = 1; ctx.restore();
            if (flash > 0){ ctx.fillStyle = 'rgba(255,60,40,' + (flash * .25) + ')'; ctx.fillRect(0, 0, W, H); }
            ctx.font = '12px system-ui,sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(233,237,242,.5)'; ctx.fillText(TN[z % 3], W - 14, 22);
        }
        function robot(){
            var cx = RX + RW / 2, sc = 1 - Math.min(.6, (G - y) / 300);
            ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(cx, G + 3, 22 * sc, 5 * sc, 0, 0, 6.3); ctx.fill();
            ctx.save();
            if (invuln > 0 && Math.floor(t * 16) % 2) ctx.globalAlpha = .4;
            ctx.translate(cx, y); ctx.rotate(Math.max(-.2, Math.min(.25, vy / 3500))); ctx.scale(1 + sq * .22, 1 - sq * .28);
            if (shield){
                ctx.fillStyle = 'rgba(127,214,255,.14)'; ctx.strokeStyle = 'rgba(127,214,255,.85)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(0, -24, 34 + (RM ? 0 : Math.sin(t * 6) * 1.5), 0, 6.3); ctx.fill(); ctx.stroke();
            }
            var dxs = [-13, 13];
            for (var i = 0; i < dxs.length; i++){
                var dx = dxs[i];
                ctx.save(); ctx.translate(dx, -8); ctx.fillStyle = '#0c0e11'; ctx.strokeStyle = '#9aa3ad'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(0, 0, 8, 0, 6.3); ctx.fill(); ctx.stroke(); ctx.rotate(wr);
                ctx.beginPath();
                for (var k = 0; k < 3; k++){ ctx.moveTo(0, 0); ctx.lineTo(Math.cos(k * 2.094) * 7, Math.sin(k * 2.094) * 7); }
                ctx.stroke(); ctx.fillStyle = OR; ctx.beginPath(); ctx.arc(0, 0, 2.2, 0, 6.3); ctx.fill(); ctx.restore();
            }
            var wob = Math.sin(t * 9) * 2 - vy * .004;
            ctx.strokeStyle = '#8a929c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(wob, -54); ctx.stroke();
            ctx.fillStyle = OR; ctx.beginPath(); ctx.arc(wob, -56, 3.5, 0, 6.3); ctx.fill();
            var bg2 = ctx.createLinearGradient(0, -42, 0, -12);
            bg2.addColorStop(0, '#c0c7cf'); bg2.addColorStop(1, '#59616b');
            ctx.fillStyle = bg2; rr(-20, -42, 40, 30, 8); ctx.fill();
            ctx.fillStyle = OR; rr(-18, -19, 36, 4, 2); ctx.fill();
            ctx.fillStyle = '#0a0c10'; rr(-14, -38, 28, 14, 5); ctx.fill();
            var eh = bl < 0 ? 1.5 : 8, lk = vy < -100 ? -1.5 : vy > 200 ? 1.5 : 0;
            ctx.fillStyle = invuln > 0 ? OR : ICE;
            rr(-9, -31 + lk - eh / 2, 6, eh, 2); ctx.fill();
            rr(3, -31 + lk - eh / 2, 6, eh, 2); ctx.fill();
            ctx.restore();
            for (var i = 0; i < 2; i++){
                var av = grounded || (2 - jumpsUsed) > i;
                ctx.fillStyle = av ? ICE : 'rgba(127,214,255,.12)';
                ctx.strokeStyle = 'rgba(127,214,255,.5)';
                ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx + (i - .5) * 14, y - RH - 26, 4, 0, 6.3); ctx.fill(); ctx.stroke();
            }
        }

        /* ---------- control ---------- */
        function frame(ts){
            if (state !== 'running') return;
            var dt = last ? Math.max(0, Math.min(.05, (ts - last) / 1000 || 0)) : 0;
            last = ts; update(dt); draw();
            raf = requestAnimationFrame(frame);
        }
        function btns(){
            var pb = $('pb');
            if (pb){
                pb.disabled = state === 'ready';
                pb.textContent = state === 'paused' ? 'Resume' : 'Pause';
            }
        }
        function start(){
            if (state === 'running') return;
            state = 'running';
            if (ov) ov.hidden = true;
            last = 0;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(frame);
            btns();
            stage.focus({preventScroll: true});
        }
        function pause(msg){
            if (state !== 'running') return;
            state = 'paused';
            cancelAnimationFrame(raf);
            saveBest();
            var ot = $('ot'), om = $('om'), go = $('go');
            if (ot) ot.textContent = 'Paused';
            if (om) om.textContent = msg || 'Take a breath. Your run is safe.';
            if (go) go.textContent = 'Resume';
            if (ov) ov.hidden = false;
            btns(); draw();
        }
        function restart(){
            cancelAnimationFrame(raf); saveBest(); state = 'ready'; reset(); start();
        }

        if ($('go')) $('go').onclick = start;
        if ($('pb')) $('pb').onclick = function(){ return state === 'running' ? pause() : start(); };
        if ($('rb')) $('rb').onclick = restart;
        if ($('sb')) $('sb').onclick = function(){
            snd = !snd;
            if (snd && !ac){
                try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ snd = false; }
            }
            if (snd && ac && ac.resume) ac.resume();
            $('sb').textContent = 'Sound: ' + (snd ? 'on' : 'off');
            $('sb').setAttribute('aria-pressed', snd);
        };

        stage.addEventListener('keydown', function(e){
            if (e.target.tagName === 'BUTTON') return;
            if (e.code === 'Space' || e.code === 'ArrowUp'){
                e.preventDefault();
                if (e.repeat) return;
                if (state === 'running') press();
                else if (state === 'ready') start();
            } else if (e.code === 'KeyP'){
                e.preventDefault();
                if ($('pb')) $('pb').click();
            }
        });

        cv.addEventListener('pointerdown', function(){
            stage.focus({preventScroll: true});
            press();
        });

        if ($('jb')) $('jb').addEventListener('pointerdown', function(e){
            e.preventDefault();
            press();
        });

        document.addEventListener('visibilitychange', function(){
            if (document.hidden) pause('Paused because the tab was hidden.');
        });
        addEventListener('pagehide', saveBest);

        if ('IntersectionObserver' in window){
            new IntersectionObserver(function(es){
                if (es[0].intersectionRatio < .3) pause('Paused because the game left the screen.');
            }, {threshold: [0, .3, .6, 1]}).observe(stage);
        }

        function resize(){
            var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
            cv.width = Math.max(1, Math.round(r.width * d));
            cv.height = Math.max(1, Math.round(r.height * d));
            draw();
        }
        var rq = 0;
        var rsz = function(){ cancelAnimationFrame(rq); rq = requestAnimationFrame(resize); };
        if ('ResizeObserver' in window) new ResizeObserver(rsz).observe(stage);
        else addEventListener('resize', rsz);

        reset();
        resize();
        addEventListener('error', function(e){
            var m = String(e.message || e);
            if (/ResizeObserver|Script error/i.test(m) || !e.error) return;
            console.error(e.error);
            if ($('ot')) $('ot').textContent = 'Something went wrong';
            if ($('om')) $('om').textContent = m;
            if (ov) ov.hidden = false;
        });
    })();
});
