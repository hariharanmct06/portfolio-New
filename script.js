/* ==========================================================================
   CUSTOMIZABLE CHATBOT KNOWLEDGE BASE (RAG DATABASE)
   ==========================================================================
   To update what your AI Assistant answers, edit the categories, keywords,
   and responses in the array below. Keywords are used to search and match
   the user's questions. HTML markup is supported in responses.
   ========================================================================== */
const BOT_KNOWLEDGE_BASE = [
    {
        category: "education",
        keywords: ["education", "study", "studied", "school", "college", "institutions", "suguna", "sns", "degree", "grade", "10th", "12th", "mechatronics"],
        response: "Hariharan completed his 10th (SSLC) in 2024 and 12th (HSC) in 2026 at <strong>Suguna RIP V School</strong>. He is starting his <strong>B.E. Mechatronics Engineering</strong> at <strong>SNS Institutions</strong> in September 2026."
    },
    {
        category: "skills",
        keywords: ["skills", "coding", "programming", "python", "c++", "n8n", "workflows", "automation", "github", "git", "communication", "ai", "artificial"],
        response: "Hariharan has a solid foundation in coding with <strong>Python</strong> and <strong>C++</strong>. He creates workflow automations using <strong>n8n</strong>, manages version control with <strong>GitHub</strong>, and is a beginner-level <strong>AI learner</strong>. He also has excellent <strong>communication skills</strong>."
    },
    {
        category: "interests",
        keywords: ["interests", "passions", "cybersecurity", "cyber", "security", "uiux", "ui/ux", "design", "industry 4.0", "smart", "robotics", "automation"],
        response: "Hariharan's core interest lies in <strong>Industry 4.0</strong> automation and robotics. He is a passionate <strong>Cybersecurity enthusiast</strong> and a <strong>UI/UX design learner</strong>."
    },
    {
        category: "contact",
        keywords: ["contact", "email", "gmail", "whatsapp", "phone", "number", "linkedin", "reach", "connect", "social"],
        response: "Here is how you can connect with Hariharan:<br>" +
                  "• <strong>Gmail</strong>: <a href='mailto:hariharanmct06@gmail.com'>hariharanmct06@gmail.com</a><br>" +
                  "• <strong>WhatsApp</strong>: <a href='https://wa.me/918667808803' target='_blank'>+91 8667808803</a><br>" +
                  "• <strong>LinkedIn</strong>: <a href='https://www.linkedin.com/in/hariharan-m-4a8533407' target='_blank'>LinkedIn Profile</a>"
    },
    {
        category: "languages",
        keywords: ["languages", "speak", "know", "tamil", "english", "malayalam", "french"],
        response: "Hariharan knows these languages:<br>" +
                  "• <strong>Tamil</strong>: Native / Mother tongue (100%)<br>" +
                  "• <strong>English</strong>: Fluent / Professional (100%)<br>" +
                  "• <strong>Malayalam</strong>: Conversational (80%)<br>" +
                  "• <strong>French</strong>: Basic Learning level (30%)"
    },
    {
        category: "about",
        keywords: ["who", "whois", "hariharan", "profile", "bio", "about", "introduce", "intro"],
        response: "Hariharan M is a B.E. Mechatronics candidate at SNS Institutions. He is an automation designer (n8n), coder (Python & C++), GitHub practitioner, beginner AI student, and cybersecurity learner."
    }
];

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

    // Chatbot Elements
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotFab = document.getElementById('chatbotFab');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const botCloseBtn = document.getElementById('botCloseBtn');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const suggestionChips = document.querySelectorAll('.suggest-chip');

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    if (mobileMenuBtn && mobileNavMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNavMenu.classList.toggle('open');
            // Toggle hamburger icon animation
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            bars[0].style.transform = mobileMenuBtn.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            bars[1].style.opacity = mobileMenuBtn.classList.contains('active') ? '0' : '1';
            bars[2].style.transform = mobileMenuBtn.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });

        // Close menu on click of mobile nav link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNavMenu.classList.remove('open');
                
                const bars = mobileMenuBtn.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    /* ==========================================================================
       STICKY HEADER & BACK-TO-TOP BUTTON
       ========================================================================== */
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

            // Simulate Network Request Delay
            setTimeout(() => {
                // Use mailto link backup if they want to physically send
                const mailtoLink = `mailto:hariharanmct06@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent("Name: " + nameVal + "\nEmail: " + emailVal + "\n\n" + messageVal)}`;
                
                // Show Success Notification
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fas fa-circle-check"></i> Thank you! Your message mockup is ready. Opening your default mail client to complete sending...';
                
                // Reset form values
                contactForm.reset();
                
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Open default email client after success banner appears
                setTimeout(() => {
                    window.location.href = mailtoLink;
                }, 1500);

            }, 1200);
        });
    }

    /* ==========================================================================
       RAG CHATBOT ENGINE & WINDOW CONTROLLER
       ========================================================================== */
    // Open/Close Widget
    if (chatbotFab && chatbotWindow && botCloseBtn) {
        chatbotFab.addEventListener('click', () => {
            chatbotWindow.classList.toggle('open');
            chatbotFab.querySelector('.fab-pulse').style.display = 'none'; // Hide attention pulse once opened
        });

        botCloseBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('open');
        });
    }

    // Tokenizer & scoring search RAG logic
    const queryRAG = (userQuery) => {
        const query = userQuery.toLowerCase().replace(/[?,.!\/]/g, ' ').trim();
        const tokens = query.split(/\s+/).filter(token => token.length > 2);

        if (tokens.length === 0) {
            return "Please ask a specific question. I know about Hariharan's education, skills, automation, n8n, AI, and cybersecurity!";
        }

        let bestMatch = null;
        let highestScore = 0;

        BOT_KNOWLEDGE_BASE.forEach(doc => {
            let score = 0;
            tokens.forEach(token => {
                if (doc.keywords.includes(token)) {
                    score += 2; // Keyword match
                } else {
                    // Part of speech / substring checking
                    doc.keywords.forEach(keyword => {
                        if (keyword.includes(token) || token.includes(keyword)) {
                            score += 0.8;
                        }
                    });
                }
            });

            if (score > highestScore) {
                highestScore = score;
                bestMatch = doc;
            }
        });

        // Threshold matching check
        if (highestScore >= 1.5 && bestMatch) {
            return bestMatch.response;
        } else {
            return "I'm not sure I understand that question completely. I'm trained on Hariharan's specific details. Try asking about:<br>" +
                   "• His **education** path (Suguna school, SNS institutions)<br>" +
                   "• Technical **skills** (Python, C++, n8n automation workflows, GitHub)<br>" +
                   "• Core **interests** (Industry 4.0, Cybersecurity, UI/UX designing)<br>" +
                   "• **Languages** he speaks, or his **contact details**.";
        }
    };

    // Render chatbot logs
    const appendChatMessage = (sender, content) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = content;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return msgDiv;
    };

    // Handle user inputs
    const handleBotTransaction = (queryText) => {
        // Render User Query
        appendChatMessage('user', queryText);
        
        // Show Typing Dots
        const typingDiv = appendChatMessage('bot', `<div class="typing-dots"><span></span><span></span><span></span></div>`);
        
        // Retrieve RAG response and resolve typing animation
        setTimeout(() => {
            const responseText = queryRAG(queryText);
            typingDiv.innerHTML = responseText;
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 800);
    };

    // Submitting chat questions
    if (chatbotForm) {
        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatbotInput.value.trim();
            if (!text) return;
            handleBotTransaction(text);
            chatbotInput.value = '';
        });
    }

    // Suggestion chips triggers
    if (suggestionChips.length > 0) {
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const queryType = chip.getAttribute('data-query');
                let promptQuery = "";
                
                if (queryType === 'education') promptQuery = "Tell me about your education history";
                else if (queryType === 'skills') promptQuery = "What programming skills and automation tools do you know?";
                else if (queryType === 'interests') promptQuery = "What are your interests in Industry 4.0?";
                else if (queryType === 'contact') promptQuery = "How can I contact Hariharan?";
                
                if (promptQuery) {
                    handleBotTransaction(promptQuery);
                }
            });
        });
    }
});
