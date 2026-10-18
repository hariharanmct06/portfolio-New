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
        const root = document.getElementById('playground');
        if (!root) return;
        const $ = id => document.getElementById(id);
        const canvas = $('game'), stage = $('arena');
        if (!canvas || !stage) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
        const C = Object.freeze({gravity:1800, jump:620, boost:590, startSpeed:205, maxSpeed:315, step:1/120, recovery:455, maxParticles:90, maxLives:3});
        const SCENES = ['CIRCUIT BOARD','SERVER ROOM','AI LAB'];

        class Runner {
            constructor(random = Math.random) {
                this.random = random;
                this.W = 960;
                this.H = 380;
                this.best = 0;
                this.reduced = false;
                this.reset();
            }
            get ground() { return this.H - 76; }
            get playerX() { return Math.min(136, this.W * .2); }
            get multiplier() { return Math.min(5, 1 + Math.floor(this.chain / 5)); }
            reset() {
                this.status = 'ready'; this.time = 0; this.distance = 0; this.speed = C.startSpeed;
                this.score = 0; this.chain = 0; this.shield = false; this.hits = 0; this.lives = C.maxLives;
                this.flash = 0; this.flashColor = '#ff846b'; this.events = []; this.particles = [];
                this.popups = []; this.hazards = [];
                this.player = {y: this.ground, vy: 0, grounded: true, jumps: 0, invulnerable: 0, buffer: 0, coyote: 0, squash: 0};
                this.pickups = Array.from({length: 5}, (_, i) => ({type: 'chip', x: this.playerX + 130 + i * 49, alt: 35, phase: i}));
                this.nextX = this.W + 150; this.pattern = 0; this.fill();
            }
            resize(w, h) {
                const oldGround = this.ground, oldX = this.playerX;
                this.W = w; this.H = h;
                if (this.status === 'ready') { this.reset(); return; }
                this.player.y += this.ground - oldGround;
                const dx = this.playerX - oldX;
                for (const o of [...this.hazards, ...this.pickups]) o.x += dx;
                for (const o of [...this.particles, ...this.popups]) { o.x += dx; o.y += this.ground - oldGround; }
                this.nextX += dx; this.fill();
            }
            fill() {
                while (this.nextX < this.W + 1100 && this.hazards.length < 10) {
                    const n = this.pattern++, r = this.random();
                    const type = n < 3 ? ['block', 'spark', 'gap'][n] : (r < .16 ? 'clear' : r < .45 ? 'block' : r < .73 ? 'spark' : 'gap');
                    const w = type === 'gap' ? 84 + this.random() * 16 : type === 'spark' ? 32 : 36 + this.random() * 10;
                    const h = type === 'spark' ? 48 : 30 + this.random() * 8;
                    if (type !== 'clear') this.hazards.push({type, x: this.nextX, w, h, hit: false});
                    const center = this.nextX + w / 2;
                    for (let i = 0; i < 5 && this.pickups.length < 65; i++) {
                        this.pickups.push({type: 'chip', x: center - 88 + i * 44, alt: type === 'clear' ? 35 : [65, 108, 137, 108, 65][i], phase: n + i});
                    }
                    if (n % 4 === 1 && this.pickups.length < 65) {
                        this.pickups.push({type: 'shield', x: this.nextX + w + 190, alt: 38, phase: n});
                    }
                    this.nextX += w + C.recovery + this.random() * 75;
                }
            }
            start() { if (this.status === 'ready' || this.status === 'paused') this.status = 'running'; }
            pause() { if (this.status === 'running') this.status = 'paused'; }
            requestJump() { if (this.status !== 'running') return false; this.player.buffer = .13; return true; }
            event(type, extra = {}) { this.events.push({type, ...extra}); if (this.events.length > 40) this.events.shift(); }
            burst(x, y, color, count = 10) {
                if (this.reduced) count = Math.min(count, 3);
                for (let i = 0; i < count && this.particles.length < C.maxParticles; i++) {
                    const angle = this.random() * Math.PI * 2, v = 45 + this.random() * 105;
                    this.particles.push({x, y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v - 30, life: .3 + this.random() * .25, max: .55, color, size: 2 + this.random() * 2});
                }
            }
            popup(label, x, y, color) { this.popups.push({label, x, y, color, life: .85}); if (this.popups.length > 8) this.popups.shift(); }
            damage(hazard) {
                const p = this.player;
                if (this.status !== 'running' || p.invulnerable > 0) return;
                if (hazard) hazard.hit = true;
                if (this.shield) {
                    this.shield = false; p.invulnerable = 1.1; this.flashColor = '#8be6ae';
                    this.popup('SHIELD SAVE', this.playerX, this.player.y - 80, '#8be6ae');
                    this.event('save');
                } else {
                    const loss = Math.min(this.score, 50);
                    this.score -= loss; this.chain = 0; this.hits++; this.lives = Math.max(0, this.lives - 1);
                    p.invulnerable = 1.5; this.flashColor = '#ff846b';
                    this.popup(this.lives === 0 ? 'RUN COMPLETE' : '−1 HEART' + (loss ? ' · −' + loss : ''), this.playerX, this.player.y - 80, '#ffad92');
                    this.event('damage', {loss, lives: this.lives});
                    if (this.lives === 0) { this.status = 'over'; p.buffer = 0; this.event('over'); }
                }
                this.flash = .3; this.burst(this.playerX, this.player.y - 26, this.flashColor, 14);
            }
            collect(o) {
                if (this.status === 'over') return;
                o.collected = true;
                if (o.type === 'shield') {
                    const already = this.shield; this.shield = true;
                    this.burst(o.x, this.ground - o.alt, '#8be6ae', 14);
                    this.popup(already ? 'SHIELD READY' : 'SHIELD ONLINE', o.x, this.ground - o.alt - 20, '#8be6ae');
                    this.event('shield'); return;
                }
                const before = this.multiplier; this.chain++;
                const points = 10 * this.multiplier;
                this.score += points; this.best = Math.max(this.best, this.score);
                this.burst(o.x, this.ground - o.alt, '#ffbc75', 7);
                this.popup('+' + points, o.x, this.ground - o.alt - 15, '#ffd6a6');
                this.event('chip', {points});
                if (this.multiplier > before) this.event('combo', {multiplier: this.multiplier});
            }
            update(dt) {
                if (this.status !== 'running') return;
                this.time += dt; this.speed = Math.min(C.maxSpeed, C.startSpeed + this.time * .75);
                const dx = this.speed * dt; this.distance += dx; this.nextX -= dx;
                for (const o of [...this.hazards, ...this.pickups]) o.x -= dx;
                this.hazards = this.hazards.filter(o => o.x + o.w > -70);
                this.pickups = this.pickups.filter(o => !o.collected && o.x > -70);
                this.fill();
                const p = this.player;
                p.invulnerable = Math.max(0, p.invulnerable - dt);
                p.buffer = Math.max(0, p.buffer - dt);
                p.squash = Math.max(0, p.squash - dt);
                this.flash = Math.max(0, this.flash - dt);
                const gap = this.hazards.find(o => o.type === 'gap' && !o.hit && this.playerX > o.x + 3 && this.playerX < o.x + o.w - 3);
                if (p.grounded && gap && p.invulnerable === 0) { p.grounded = false; p.coyote = .09; }
                if (!p.grounded) p.coyote = Math.max(0, p.coyote - dt);
                if (p.buffer > 0 && (p.grounded || p.coyote > 0 || p.jumps < 2)) {
                    const first = p.grounded || p.coyote > 0;
                    p.jumps = first ? 1 : Math.max(1, p.jumps) + 1;
                    p.vy = -(first ? C.jump : C.boost);
                    p.grounded = false; p.coyote = 0; p.buffer = 0;
                    this.burst(this.playerX, p.y - 4, first ? '#9ddff3' : '#ffbc75', first ? 5 : 12);
                    this.event(first ? 'jump' : 'double');
                }
                if (!p.grounded) {
                    p.vy += C.gravity * dt; p.y += p.vy * dt;
                    const ceiling = this.ground - Math.min(215, this.ground - 83);
                    if (p.y < ceiling) { p.y = ceiling; p.vy = Math.max(0, p.vy); }
                    if (p.y >= this.ground && p.vy >= 0 && (!gap || p.invulnerable > 0)) {
                        p.y = this.ground; p.vy = 0; p.grounded = true; p.jumps = 0; p.squash = .12;
                        this.burst(this.playerX, this.ground - 3, '#728d9e', 4);
                    }
                    if (p.y > this.ground + 48) {
                        this.damage(gap); if (gap) gap.hit = true;
                        if (this.status === 'over') { p.y = this.ground; p.vy = 0; p.grounded = true; p.jumps = 0; return; }
                        p.y = this.ground - 10; p.vy = -470; p.grounded = false; p.jumps = 1; this.event('recover');
                    }
                }
                const left = this.playerX - 19, right = this.playerX + 19, top = p.y - 55, bottom = p.y - 5;
                for (const o of this.hazards) {
                    if (o.type === 'gap' || o.hit || p.invulnerable > 0) continue;
                    if (right > o.x + 3 && left < o.x + o.w - 3 && bottom > this.ground - o.h + 6 && top < this.ground) this.damage(o);
                }
                if (this.status === 'over') return;
                for (const o of this.pickups) {
                    if (o.collected || o.missed) continue;
                    const cy = this.ground - o.alt, radius = o.type === 'shield' ? 18 : 13;
                    const nearX = clamp(o.x, left, right), nearY = clamp(cy, top, bottom);
                    if ((o.x - nearX) ** 2 + (cy - nearY) ** 2 < radius * radius) this.collect(o);
                    else if (o.x + radius < left) { o.missed = true; if (o.type === 'chip') this.chain = 0; }
                }
                for (const o of this.particles) { o.life -= dt; o.x += (o.vx - this.speed * .25) * dt; o.y += o.vy * dt; o.vy += 300 * dt; }
                for (const o of this.popups) { o.life -= dt; o.y -= 28 * dt; o.x -= this.speed * .18 * dt; }
                this.particles = this.particles.filter(o => o.life > 0);
                this.popups = this.popups.filter(o => o.life > 0);
            }
        }

        const game = new Runner(), media = window.matchMedia('(prefers-reduced-motion: reduce)');
        game.reduced = media.matches;
        let storageOK = true, savedBest = 0;
        const BEST_KEY = 'hariharan.circuit-runner.best.v1';
        try {
            const n = Number(localStorage.getItem(BEST_KEY));
            savedBest = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
            localStorage.setItem(BEST_KEY, String(savedBest));
        } catch { storageOK = false; }
        game.best = savedBest;
        if (!storageOK && $('bestLabel')) $('bestLabel').textContent = 'SESSION BEST';

        let inView = true, dirty = true, last = 0, accumulator = 0, lastDraw = 0, lastHUD = -1, ambient = 0;
        let soundOn = true, audio = null, pauseReason = '', previousWidth = 0, previousHeight = 0;

        const compact = new Intl.NumberFormat('en-US', {notation: 'compact', maximumSignificantDigits: 3});
        const number = n => n < 100000 ? String(Math.floor(n)).padStart(5, '0') : compact.format(n);

        function announce(text) {
            const el = $('announcement');
            if (el) el.textContent = text;
        }

        function ensureAudio() {
            if (!audio) {
                try {
                    const AC = window.AudioContext || window.webkitAudioContext;
                    if (AC) audio = new AC();
                } catch(e) {}
            }
            if (audio && audio.state === 'suspended') {
                audio.resume().catch(() => {});
            }
        }

        function tone(freq, duration = .07, shape = 'sine', volume = .04) {
            if (!soundOn) return;
            ensureAudio();
            if (!audio) return;
            try {
                const osc = audio.createOscillator(), gain = audio.createGain(), now = audio.currentTime;
                osc.type = shape;
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(freq * .7, now + duration);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(.001, now + duration);
                osc.connect(gain);
                gain.connect(audio.destination);
                osc.start(now);
                osc.stop(now + duration);
            } catch(e) {}
        }

        function updateSoundButton() {
            const btn = $('sound'), path = $('soundPath');
            if (btn) {
                btn.setAttribute('aria-pressed', String(soundOn));
                btn.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
                btn.title = soundOn ? 'Sound on' : 'Sound off';
            }
            if (path) {
                path.setAttribute('d', soundOn ? 'M9 4 5 7H2v6h3l4 3V4m4 3c2 1 2 5 0 6m3-9c4 3 4 9 0 12' : 'M9 4 5 7H2v6h3l4 3V4M13 7l5 6m0-6-5 6');
            }
        }

        function focusGame() { canvas.focus({preventScroll: true}); }
        function canRun() { return inView && !document.hidden; }

        function begin(restart = false) {
            ensureAudio(); // Audio is ON when someone starts the game
            soundOn = true;
            updateSoundButton();

            if (restart || game.status === 'over') game.reset();
            if (!canRun()) {
                game.status = 'paused';
                pauseReason = 'The playground is out of view. Resume when you return.';
                sync();
                return;
            }
            game.start();
            pauseReason = '';
            last = 0;
            accumulator = 0;
            focusGame();
            if (soundOn) {
                tone(680, 0.12, 'sine', 0.05); // Welcoming sci-fi run start chord
            }
            sync();
        }

        function pause(reason = 'Your circuit is waiting. Pick up right where you left off.') {
            if (game.status !== 'running') return;
            game.pause();
            pauseReason = reason;
            accumulator = 0;
            sync();
            announce('Game paused. Press Resume to continue.');
        }

        function sync() {
            const active = game.status === 'running', paused = game.status === 'paused', over = game.status === 'over';
            if ($('overlay')) {
                $('overlay').hidden = active;
                $('overlay').classList.toggle('finished', over);
            }
            if ($('results')) $('results').hidden = !over;
            if ($('pause')) $('pause').disabled = game.status === 'ready' || over;
            if ($('jump')) $('jump').disabled = !active;
            if ($('pauseLabel')) $('pauseLabel').textContent = paused ? 'Resume' : 'Pause';
            if ($('pause')) $('pause').setAttribute('aria-label', paused ? 'Resume game' : 'Pause game');
            if ($('pauseIcon')) $('pauseIcon').innerHTML = paused ? '<path d="m7 4 9 6-9 6Z"/>' : '<path d="M7 4v12M13 4v12"/>';
            if ($('runState')) {
                $('runState').textContent = active ? 'SYSTEM RUNNING' : paused ? 'RUN PAUSED' : over ? 'RUN COMPLETE' : 'AWAITING INPUT';
                $('runState').classList.toggle('running', active);
            }
            if ($('overlayTitle')) $('overlayTitle').textContent = over ? 'Game over.' : paused ? 'Take a breather.' : 'Ready, runner?';
            if ($('overlayDescription')) {
                $('overlayDescription').textContent = over ? 'All three hearts are gone. Play again to beat your best.' : paused ? pauseReason : 'A tiny robot. Three hearts. Find your rhythm, then catch some air.';
            }
            if ($('overlaySymbol')) $('overlaySymbol').textContent = paused ? 'Ⅱ' : '↗';
            if ($('start')) $('start').textContent = over ? 'Play again →' : paused ? 'Resume run →' : 'Start run →';
            if ($('overlayHint')) $('overlayHint').textContent = over ? 'Press Enter or Space, or choose Play again.' : '1 chip = 10 points · 5 in a row = a bigger multiplier';
            if (over) {
                if ($('finalScore')) { $('finalScore').textContent = number(game.score); $('finalScore').title = game.score.toLocaleString('en-US'); }
                if ($('finalBest')) { $('finalBest').textContent = number(game.best); $('finalBest').title = game.best.toLocaleString('en-US'); }
                if ($('finalDistance')) $('finalDistance').textContent = compact.format(Math.floor(game.distance / 30)) + ' m';
            }
            dirty = true;
            updateHUD();
        }

        function updateHUD() {
            if ($('score')) $('score').textContent = number(game.score);
            if ($('best')) $('best').textContent = number(game.best);
            if ($('multiplier')) $('multiplier').textContent = '×' + game.multiplier;
            for (const [id, value] of [['score', game.score], ['best', game.best]]) {
                const el = $(id);
                if (el) { el.title = value.toLocaleString('en-US'); el.setAttribute('aria-label', value.toLocaleString('en-US') + ' points'); }
            }
            const progress = game.multiplier === 5 ? 5 : game.chain % 5;
            root.querySelectorAll('.combo-meter i').forEach((el, i) => el.classList.toggle('on', i < progress));
            if ($('multiplier')) {
                $('multiplier').setAttribute('aria-label', game.multiplier + ' times multiplier. ' + (game.multiplier === 5 ? 'Maximum multiplier.' : (5 - progress) + ' chips to next multiplier.'));
            }
            if ($('shieldText')) $('shieldText').textContent = game.shield ? 'ONLINE' : 'OFFLINE';
            if ($('shield')) $('shield').classList.toggle('active', game.shield);
            root.querySelectorAll('.heart').forEach((el, i) => el.classList.toggle('lost', i >= game.lives));
            if ($('lives')) $('lives').setAttribute('aria-label', game.lives + ' of ' + C.maxLives + ' hearts remaining');
            if ($('healthBar')) $('healthBar').classList.toggle('low', game.lives === 1);
            if ($('healthHint')) {
                $('healthHint').textContent = game.lives === 0 ? 'Three hearts down.' : game.lives === 1 ? 'Last heart. Stay sharp.' : game.lives === 2 ? '2 hearts remaining' : '3 hearts per run';
            }
            const jumps = game.player.grounded || game.player.coyote > 0 ? 2 : Math.max(0, 2 - Math.max(1, game.player.jumps));
            root.querySelectorAll('.jump-dot').forEach((el, i) => el.classList.toggle('available', i < jumps));
            if ($('flight')) $('flight').setAttribute('aria-label', jumps + ' jumps available');
            if ($('jumpText')) $('jumpText').textContent = jumps === 2 ? 'DOUBLE JUMP READY' : jumps === 1 ? 'AIR BOOST READY' : 'LAND TO RECHARGE';
            if ($('distance')) $('distance').textContent = String(Math.floor(game.distance / 30)).padStart(3, '0') + ' m';
            const zone = Math.floor(game.time / 26) % 3;
            if ($('sceneNumber')) $('sceneNumber').textContent = '0' + (zone + 1);
            if ($('sceneName')) $('sceneName').textContent = SCENES[zone];
            if (storageOK && game.best > savedBest) {
                savedBest = game.best;
                try { localStorage.setItem(BEST_KEY, String(savedBest)); } catch { storageOK = false; if ($('bestLabel')) $('bestLabel').textContent = 'SESSION BEST'; }
            }
        }

        if ($('start')) $('start').addEventListener('click', () => begin());
        if ($('pause')) $('pause').addEventListener('click', () => game.status === 'running' ? pause() : begin());
        if ($('restart')) $('restart').addEventListener('click', () => { begin(true); announce('New run started. Score reset.'); });

        function jump() {
            ensureAudio();
            focusGame();
            if (game.requestJump()) { dirty = true; }
        }

        if ($('jump')) {
            $('jump').addEventListener('pointerdown', e => {
                if (e.button !== 0 || $('jump').disabled) return;
                e.preventDefault();
                jump();
            });
            $('jump').addEventListener('click', e => { if (e.detail === 0) jump(); });
        }

        canvas.addEventListener('pointerdown', e => {
            if (e.button !== 0) return;
            ensureAudio();
            focusGame();
            if (game.status === 'running') game.requestJump();
            else if (game.status === 'ready') begin();
        });

        root.addEventListener('keydown', e => {
            if (e.target !== canvas || e.ctrlKey || e.metaKey || e.altKey) return;
            if (['Space', 'ArrowUp', 'KeyP', 'Escape', 'Enter'].includes(e.code)) {
                e.preventDefault();
                if (e.repeat) return;
                ensureAudio();
                if (e.code === 'Space' || e.code === 'ArrowUp') {
                    if (game.status === 'over') begin(true);
                    else if (game.status === 'ready') begin();
                    else game.requestJump();
                } else if (e.code === 'Enter') {
                    if (game.status !== 'running') begin();
                } else if (game.status === 'running') pause();
                else if (game.status === 'paused') begin();
            }
        });

        if ($('sound')) {
            $('sound').addEventListener('click', () => {
                soundOn = !soundOn;
                if (soundOn) {
                    ensureAudio();
                    tone(680);
                }
                updateSoundButton();
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) pause('The tab was hidden. Resume when you’re ready.');
        });
        window.addEventListener('blur', () => pause('Focus moved away. Your run is safely paused.'));
        window.addEventListener('pagehide', () => pause());

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                const e = entries[0];
                inView = e.isIntersecting && e.intersectionRatio >= .15;
                if (!inView) pause('The playground left the screen. Resume when you return.');
            }, {threshold: [0, .15]}).observe(stage);
        } else {
            const check = () => {
                const b = stage.getBoundingClientRect();
                inView = b.bottom > 40 && b.top < window.innerHeight - 40;
                if (!inView) pause('The playground left the screen. Resume when you return.');
            };
            window.addEventListener('scroll', check, {passive: true});
            check();
        }

        const motionChange = () => { game.reduced = media.matches; dirty = true; };
        if (media.addEventListener) media.addEventListener('change', motionChange);
        else if (media.addListener) media.addListener(motionChange);

        function resize() {
            const r = canvas.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) return;
            if (previousWidth && (Math.abs(r.width - previousWidth) > 80 || Math.abs(r.height - previousHeight) > 80)) {
                pause('The screen size changed. Resume when you’re ready.');
            }
            previousWidth = r.width; previousHeight = r.height;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const scale = Math.max(1, 500 / r.width, 300 / r.height);
            const w = r.width * scale, h = r.height * scale;
            canvas.width = Math.round(r.width * dpr);
            canvas.height = Math.round(r.height * dpr);
            game.resize(w, h);
            dirty = true;
            updateHUD();
        }

        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
        else window.addEventListener('resize', resize);

        /* Native Canvas artwork: procedural vectors, gradients, parallax & particle fx */
        const round = (x, y, w, h, r, fill, stroke) => {
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
        };
        function line(points, color, width = 1) {
            ctx.beginPath();
            points.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        function circle(x, y, r, fill, stroke) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
        }
        function background(zone, alpha, t) {
            ctx.save(); ctx.globalAlpha = alpha;
            const W = game.W, G = game.ground, shift = game.distance * .12;
            const bg = ctx.createLinearGradient(0, 0, 0, G);
            bg.addColorStop(0, ['#17232e', '#171e2b', '#15262c'][zone]);
            bg.addColorStop(1, '#101b24');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, G + 3);
            const glow = ctx.createRadialGradient(W * .68, G * .4, 0, W * .68, G * .4, W * .65);
            glow.addColorStop(0, ['#36566a35', '#374a7435', '#306b5b30'][zone]);
            glow.addColorStop(1, '#17232e00');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, G);
            if (zone === 0) {
                for (let i = -1; i < W / 210 + 2; i++) {
                    const x = i * 210 - (shift % 210), y = 65 + ((i + 20) % 3) * 47;
                    line([[x, G - 35], [x + 45, G - 80], [x + 45, y], [x + 105, y], [x + 129, y + 24], [x + 190, y + 24]], '#568ca51d', 2);
                    line([[x + 20, G - 20], [x + 65, G - 65], [x + 65, y + 55], [x + 165, y + 55]], '#8dc7df10', 1);
                    circle(x + 190, y + 24, 4, '#142630', '#6dacc039');
                    circle(x + 165, y + 55, 2, '#76bfd347');
                    round(x + 80, y + 82, 52, 34, 5, '#23374345', '#50738635');
                    for (let k = 0; k < 4; k++) line([[x + 88 + k * 11, y + 78], [x + 88 + k * 11, y + 82]], '#60879744');
                }
            } else if (zone === 1) {
                for (let i = -1; i < W / 150 + 2; i++) {
                    const x = i * 150 - (shift % 150);
                    round(x, 40, 112, G - 61, 6, '#111b25', '#48627838');
                    for (let j = 0; j < Math.min(9, Math.floor((G - 80) / 32)); j++) {
                        round(x + 10, 55 + j * 32, 92, 24, 3, '#26344166', '#5a718533');
                        line([[x + 19, 63 + j * 32], [x + 65, 63 + j * 32]], '#7993a333');
                        const lit = game.reduced || Math.sin(t * 1.6 + i * 3 + j) > -.2;
                        circle(x + 88, 67 + j * 32, 2, lit ? '#83d8ad88' : '#395346');
                    }
                }
            } else {
                for (let i = -1; i < W / 260 + 2; i++) {
                    const x = i * 260 - (shift % 260), y = G * .42;
                    round(x, 65, 218, G - 98, 14, '#15303533', '#6bbaa12a');
                    circle(x + 109, y + 28, 46, null, '#91d5cd25');
                    circle(x + 109, y + 28, 30, null, '#91d5cd30');
                    const nodes = [[x + 109, y - 18], [x + 65, y + 34], [x + 151, y + 37], [x + 109, y + 72]];
                    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) line([nodes[a], nodes[b]], '#8ed9cb22');
                    nodes.forEach((p, j) => circle(p[0], p[1], 4, '#7ab7bd55', '#b0ead047'));
                    line([[x + 25, G - 55], [x + 57, G - 55], [x + 73, G - 70], [x + 91, G - 39], [x + 109, G - 57], [x + 192, G - 57]], '#8be6ae40', 2);
                }
            }
            ctx.fillStyle = '#09131b55';
            ctx.fillRect(0, G - 20, W, 24);
            ctx.restore();
        }
        function track(t) {
            const W = game.W, G = game.ground;
            const metal = ctx.createLinearGradient(0, G, 0, game.H);
            metal.addColorStop(0, '#344653');
            metal.addColorStop(.12, '#24333f');
            metal.addColorStop(1, '#15212c');
            ctx.fillStyle = metal;
            ctx.fillRect(0, G, W, 76);
            line([[0, G + .5], [W, G + .5]], '#a0dceb', 2);
            line([[0, G + 7], [W, G + 7]], '#5f86984d');
            line([[0, G + 52], [W, G + 52]], '#364c5a');
            for (let i = -1; i < W / 95 + 2; i++) {
                const x = i * 95 - (game.distance % 95);
                line([[x, G + 15], [x + 23, G + 15], [x + 35, G + 29], [x + 76, G + 29]], '#8cd4e12b');
                circle(x + 76, G + 29, 2, '#8bbacc55');
                line([[x + 16, G + 54], [x + 16, G + 69]], '#3c535f80');
            }
            for (const o of game.hazards) {
                const x = o.x;
                if (x > W + 40 || x + o.w < 0) continue;
                if (o.type === 'gap') {
                    ctx.fillStyle = '#070f16';
                    ctx.fillRect(x, G - 2, o.w, 80);
                    line([[x - 2, G + 2], [x - 2, G + 36], [x + 8, G + 45]], '#7193a4', 2);
                    line([[x + o.w + 2, G + 2], [x + o.w + 2, G + 36], [x + o.w - 8, G + 45]], '#7193a4', 2);
                    line([[x + 12, G + 48], [x + 28, G + 38], [x + 44, G + 53], [x + 62, G + 43], [x + o.w - 12, G + 50]], '#ff9b4f40', 2);
                    for (let j = 0; j < 3; j++) {
                        line([[x - 14 - j * 10, G + 9], [x - 8 - j * 10, G + 15]], '#ffad6380', 2);
                        line([[x + o.w + 8 + j * 10, G + 9], [x + o.w + 14 + j * 10, G + 15]], '#ffad6380', 2);
                    }
                    if (o.hit || game.player.invulnerable > 0) {
                        ctx.setLineDash([4, 5]);
                        line([[x, G + 2], [x + o.w, G + 2]], '#8be6ae88');
                        ctx.setLineDash([]);
                    }
                }
            }
        }
        function hazard(o, t) {
            if (o.type === 'gap' || o.x > game.W + 50 || o.x + o.w < 0) return;
            const x = o.x, G = game.ground;
            ctx.save();
            if (o.hit) ctx.globalAlpha = .55;
            ctx.fillStyle = '#0004';
            ctx.beginPath();
            ctx.ellipse(x + o.w * .6, G + 4, o.w * .7, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            if (o.type === 'block') {
                round(x, G - o.h, o.w, o.h, 5, '#374653', '#8395a0');
                ctx.fillStyle = '#566572';
                ctx.beginPath();
                ctx.moveTo(x + 4, G - o.h);
                ctx.lineTo(x + o.w - 5, G - o.h);
                ctx.lineTo(x + o.w, G - o.h + 6);
                ctx.lineTo(x + 8, G - o.h + 6);
                ctx.closePath();
                ctx.fill();
                round(x + 7, G - o.h + 12, o.w - 14, 8, 2, '#17252f');
                line([[x + 10, G - o.h + 16], [x + o.w - 10, G - o.h + 16]], '#ffb272', 3);
                for (let i = 0; i < 3; i++) line([[x + 6 + i * 12, G - 6], [x + 11 + i * 12, G - 11]], '#ffae62aa', 2);
            } else {
                round(x - 2, G - 11, o.w + 4, 10, 3, '#344b59', '#92aeb9');
                round(x + 7, G - 21, o.w - 14, 11, 3, '#718897', '#b9cbd2');
                const flicker = game.reduced ? 0 : Math.sin(t * 31 + o.x * .03) * 3;
                ctx.globalAlpha = o.hit ? .4 : .15;
                circle(x + o.w / 2, G - 32, 26, '#ffaf6d');
                ctx.globalAlpha = o.hit ? .5 : 1;
                const bolt = [[x + o.w * .6, G - 49], [x + 7 + flicker, G - 31], [x + 22, G - 31], [x + 10, G - 12]];
                line(bolt, '#ff9d54', 6);
                line(bolt, '#fff0ce', 2);
            }
            ctx.restore();
        }
        function pickup(o, t) {
            if (o.collected || o.x > game.W + 40 || o.x < -30) return;
            const y = game.ground - o.alt + (game.reduced ? 0 : Math.sin(t * 3 + o.phase) * 2.5);
            ctx.save(); ctx.translate(o.x, y);
            if (o.missed) ctx.globalAlpha = .3;
            if (o.type === 'shield') {
                circle(0, 0, 22, '#8be6ae0e');
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const a = i * Math.PI / 3 - Math.PI / 2;
                    ctx.lineTo(Math.cos(a) * 19, Math.sin(a) * 19);
                }
                ctx.closePath(); ctx.fillStyle = '#213d36'; ctx.fill(); ctx.strokeStyle = '#8be6ae'; ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, -9); ctx.lineTo(8, -6); ctx.lineTo(7, 3);
                ctx.quadraticCurveTo(5, 8, 0, 10);
                ctx.quadraticCurveTo(-5, 8, -7, 3);
                ctx.lineTo(-8, -6);
                ctx.closePath();
                ctx.fillStyle = '#8be6ae'; ctx.fill();
                line([[-3, 0], [0, 3], [4, -3]], '#244a3b', 1.5);
            } else {
                for (let i = -1; i <= 1; i++) {
                    const a = i * 5;
                    line([[-14, a], [-9, a]], '#e6b87f', 2);
                    line([[9, a], [14, a]], '#e6b87f', 2);
                    line([[a, -14], [a, -9]], '#e6b87f', 2);
                    line([[a, 9], [a, 14]], '#e6b87f', 2);
                }
                round(-9, -9, 18, 18, 3, '#bd8050', '#ffd5a2');
                round(-5, -5, 10, 10, 2, '#ffca82');
                line([[-3, 1], [0, -2], [3, 1]], '#8b572d', 1.5);
            }
            ctx.restore();
        }
        function robot(t) {
            const p = game.player, x = game.playerX, G = game.ground;
            const alt = G - p.y;
            ctx.save(); ctx.globalAlpha = .28; ctx.fillStyle = '#02080e';
            ctx.beginPath(); ctx.ellipse(x + 3, G + 5, clamp(30 - alt * .06, 13, 30), 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            if (game.shield) {
                ctx.save(); ctx.globalAlpha = game.reduced ? .65 : .65 + Math.sin(t * 3) * .15;
                circle(x, p.y - 31, 46, '#8be6ae08', '#8be6ae99'); ctx.restore();
            }
            ctx.save();
            const blink = p.invulnerable > 0 && Math.floor(p.invulnerable * 13) % 2 === 0;
            ctx.globalAlpha = blink ? .45 : 1;
            const bob = p.grounded && !game.reduced ? Math.sin(t * 19) * .8 : 0;
            ctx.translate(x, p.y + bob);
            if (!game.reduced && !p.grounded) ctx.rotate(clamp(p.vy / 8000, -.09, .06));
            const squash = p.squash > 0 && !game.reduced ? Math.sin(p.squash / .12 * Math.PI) * .1 : 0;
            ctx.scale(1 + squash, 1 - squash);
            line([[1, -57], [4, -70], [11, -72]], '#9caeba', 2);
            circle(11, -72, 3, '#ffab65', '#ffd4a0');
            round(-17, -32, 34, 23, 7, '#aab9c3', '#d5e4eb');
            round(-12, -27, 24, 13, 4, '#334959');
            round(-7, -23, 14, 4, 2, '#ffae65');
            line([[-19, -24], [-26, -15]], '#9db0be', 4);
            circle(-26, -14, 3, '#ffb071');
            line([[18, -23], [23, -31]], '#aabac5', 4);
            circle(23, -32, 3, '#ffb071');
            const head = ctx.createLinearGradient(-22, -60, 20, -30);
            head.addColorStop(0, '#f0f4f3');
            head.addColorStop(1, '#9fb3c2');
            round(-23, -59, 46, 30, 9, head, '#e3eef4');
            round(-18, -54, 36, 18, 6, '#142b37', '#698e9f');
            const eyesClosed = !game.reduced && Math.sin(t * 1.5) > .996;
            if (game.status === 'over') {
                line([[-12, -49], [-5, -42]], '#ffad92', 2);
                line([[-12, -42], [-5, -49]], '#ffad92', 2);
                line([[5, -49], [12, -42]], '#ffad92', 2);
                line([[5, -42], [12, -49]], '#ffad92', 2);
            } else if (eyesClosed) {
                line([[-12, -45], [-5, -45]], '#a5e5f7', 2);
                line([[5, -45], [12, -45]], '#a5e5f7', 2);
            } else {
                round(-12, -49, 7, p.grounded ? 7 : 9, 3, '#a4e5f6');
                round(5, -49, 7, p.grounded ? 7 : 9, 3, '#a4e5f6');
            }
            line([[-3, -39], [0, -38], [3, -39]], '#74bfd5');
            circle(-20, -40, 2, '#f5a568');
            circle(20, -40, 2, '#f5a568');
            for (const wx of [-13, 13]) {
                ctx.save(); ctx.translate(wx, -7);
                circle(0, 0, 10, '#14212b', '#7390a2');
                circle(0, 0, 6, '#4a6375', '#b1c6d2');
                ctx.rotate(game.distance * .09);
                for (let i = 0; i < 3; i++) {
                    ctx.rotate(Math.PI / 3);
                    line([[-6, 0], [6, 0]], '#182d3b', 2);
                }
                circle(0, 0, 2.5, '#ffb06a');
                ctx.restore();
            }
            ctx.restore();
        }
        function draw(t) {
            const W = game.W, H = game.H;
            ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
            ctx.clearRect(0, 0, W, H);
            const zone = Math.floor(game.time / 26) % 3, mix = Math.min(1, (game.time % 26) / 2);
            if (game.time >= 26 && mix < 1 && !game.reduced) {
                background((zone + 2) % 3, 1, t);
                background(zone, mix, t);
            } else background(zone, 1, t);
            track(t);
            for (const o of game.pickups) pickup(o, t);
            for (const o of game.hazards) hazard(o, t);
            robot(t);
            for (const o of game.particles) {
                ctx.globalAlpha = clamp(o.life / o.max, 0, 1);
                ctx.fillStyle = o.color;
                ctx.fillRect(o.x, o.y, o.size, o.size);
            }
            ctx.globalAlpha = 1;
            ctx.textAlign = 'center';
            ctx.font = '600 11px ui-monospace, monospace';
            for (const o of game.popups) {
                ctx.globalAlpha = Math.min(1, o.life * 3);
                ctx.fillStyle = o.color;
                ctx.fillText(o.label, o.x, o.y);
            }
            ctx.globalAlpha = 1;
            if (game.flash > 0) {
                ctx.globalAlpha = (game.flash / .3) * (game.reduced ? .045 : .1);
                ctx.fillStyle = game.flashColor;
                ctx.fillRect(0, 0, W, H);
                ctx.globalAlpha = 1;
            }
        }
        function events() {
            for (const e of game.events) {
                if (e.type === 'chip') tone(740 + game.multiplier * 90, .045, 'sine', .018);
                if (e.type === 'jump') tone(360, .09);
                if (e.type === 'double') tone(570, .1);
                if (e.type === 'shield') { tone(940, .16); announce('Shield collected. One collision is protected.'); }
                if (e.type === 'save') { tone(630, .15); announce('Shield absorbed the collision. Keep going.'); }
                if (e.type === 'damage') { tone(130, .16, 'triangle'); announce('One heart lost. ' + e.lives + ' hearts remaining. ' + e.loss + ' points lost.'); }
                if (e.type === 'over') { tone(100, .3, 'triangle'); sync(); announce('Game over. Final score ' + game.score + '. Personal best ' + game.best + '. Choose Play again to start with three hearts.'); }
                if (e.type === 'combo') { tone(1100, .1); announce(e.multiplier + ' times multiplier!'); }
            }
            game.events.length = 0;
        }
        function frame(stamp) {
            const dt = last ? Math.min((stamp - last) / 1000, .1) : 0;
            last = stamp;
            if (game.status === 'running') {
                accumulator += dt;
                while (accumulator >= C.step && game.status === 'running') {
                    game.update(C.step);
                    accumulator -= C.step;
                }
                if (game.status === 'over') accumulator = 0;
                events();
                dirty = true;
            } else accumulator = 0;
            if (game.status === 'ready' && !game.reduced && !document.hidden && inView) {
                ambient += dt;
                if (stamp - lastDraw > 40) dirty = true;
            }
            if (dirty) {
                draw(game.status === 'ready' ? ambient : game.time);
                dirty = false;
                lastDraw = stamp;
            }
            if (stamp - lastHUD > 80) {
                updateHUD();
                lastHUD = stamp;
            }
            requestAnimationFrame(frame);
        }

        resize();
        sync();
        updateSoundButton();
        requestAnimationFrame(frame);
    })();
});
