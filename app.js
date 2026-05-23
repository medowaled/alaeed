/* ==========================================================================
   JavaScript Application Logic for Manar's Eid Gift Website
   ========================================================================== */

// ==========================================================================
// 1. Configuration & Constant Declarations
// ==========================================================================

// --- ANNIVERSARY DATE CONFIGURATION ---
// Set the date and time when you got together. Format: YYYY-MM-DDTHH:MM:SS
// You can edit this date to change the beginning of the love counter.
const ANNIVERSARY_DATE = "2020-10-12T00:00:00"; 

// --- ROMANTIC EID LETTER MESSAGES ---
const LETTERS_DATA = {
    "1": {
        title: "رسالة الشوق 💌",
        text: "كل ثانية بتعدي وأنتي مش قدام عيني بيزيد فيها شوقي ليكي. أنتي مش بس حبيبتي، أنتي قطعتي من قلبي وروحي اللي مابأقدرش أعيش من غيرها. بحبك جداً."
    },
    "2": {
        title: "رسالة العهد والوعد 💍",
        text: "من يوم ما دخلتي حياتي في 12/10/2020 وأنا عاهدت نفسي ووعدتك إنك هتفضلي دايماً الأولى والأخيرة في قلبي. بوعدك أفضل السند والونس ليكي طول العمر يا أميرتي."
    },
    "3": {
        title: "رسالة العيد السعيد 🎉",
        text: "كل عيد وأنتي منورة دنيتي، كل عيد وأنتي العيد نفسه يا منار. وجودك جنبي هو أحلى وأجمل هدية ربنا كافأني بيها في حياتي كلها. عيد سعيد عليكي يا روحي."
    }
};

// --- EID TYPING GREETING CONTENT ---
const EID_GREETING_TEXT = "كل عام وأنتِ بخير يا أجمل ما في هذا الكون. عيدي معكِ ليس مجرد يوم، بل هو عمر كامل من السعادة والرضا والضحكات الصافية. أدعو الله أن يحفظكِ لي، وأن نبقى معاً في كل عيد، يداً بيد، وقلباً بقلب. كل عام وأنتِ حبيبتي، ونور عيني، وكل دنيتي. عيد اضحي  مبارك وسعيد يا منار الغالية. ♥";

// ==========================================================================
// 2. Global State & Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements Hooking
    const splashScreen = document.getElementById("splash-screen");
    const entranceBtn = document.getElementById("entrance-btn");
    const mainContent = document.getElementById("main-content");
    const audioPlayer = document.getElementById("bg-audio");
    const audioToggle = document.getElementById("audio-toggle");
    const iconMuted = document.getElementById("icon-muted");
    const iconPlaying = document.getElementById("icon-playing");
    
    // Check elements existence before processing
    if (!splashScreen || !entranceBtn || !mainContent || !audioPlayer || !audioToggle) return;

    // Splash Entrance Action Trigger
    entranceBtn.addEventListener("click", () => {
        // 1. Play Background Music (Bypasses autoplay restriction)
        playMusic();

        // 2. Fade Out Splash Screen with transition
        splashScreen.classList.add("fade-out");
        
        // 3. Show Main Website
        mainContent.classList.remove("hidden");
        
        // After fade animation completes, remove splash from DOM layout to save resources
        setTimeout(() => {
            splashScreen.style.display = "none";
        }, 1200);

        // 4. Initialize dynamic elements once website is shown
        initLoveCounter();
        initCursorHeartCanvas();
        initScrollReveals();
        initLettersLogic();
        initEidGreetingTyping();
    });

    // Music Player Controls
    function playMusic() {
        audioPlayer.play().then(() => {
            audioToggle.classList.remove("muted");
            audioToggle.classList.add("playing");
            iconMuted.classList.add("hidden");
            iconPlaying.classList.remove("hidden");
        }).catch(err => {
            console.log("Audio play failed or was blocked by browser configuration:", err);
        });
    }

    function pauseMusic() {
        audioPlayer.pause();
        audioToggle.classList.remove("playing");
        audioToggle.classList.add("muted");
        iconPlaying.classList.add("hidden");
        iconMuted.classList.remove("hidden");
    }

    audioToggle.addEventListener("click", () => {
        if (audioPlayer.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });
});

// ==========================================================================
// 3. Heart Cursor Particle Canvas Effect
// ==========================================================================
function initCursorHeartCanvas() {
    const canvas = document.getElementById("heart-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    
    // Set Canvas size to match screen boundary
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse movement tracker with light throttling
    let lastMoveTime = 0;
    const throttleDelay = 20; // ms

    window.addEventListener("mousemove", (e) => {
        const currentTime = Date.now();
        if (currentTime - lastMoveTime < throttleDelay) return;
        lastMoveTime = currentTime;

        // Generate tiny romantic heart particles at mouse coordinate
        createParticles(e.clientX, e.clientY);
    });

    // Support Touch Screens (Mobile)
    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            createParticles(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    class HeartParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Random small size
            this.size = Math.random() * 12 + 6;
            // Floating velocity vectors
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = -(Math.random() * 1.5 + 1); // float upwards
            // Particle longevity
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            // Warm romantic colors
            const colors = ["#FFC0CB", "#C2185B", "#FF4081", "#E91E63", "#D4AF37"];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            // Call heart drawing helper
            drawHeart(ctx, this.x, this.y, this.size, this.color);
            ctx.restore();
        }
    }

    function createParticles(x, y) {
        // Spawn 2 heart particles per movement coordinate
        for (let i = 0; i < 2; i++) {
            particles.push(new HeartParticle(x, y));
        }
    }

    // Mathematical Bezier drawing of a 2D Heart shape
    function drawHeart(ctx, x, y, size, color) {
        ctx.beginPath();
        // Shift drawing coordinates so x,y represents center of heart
        const hx = x;
        const hy = y - size / 2;

        ctx.moveTo(hx, hy + size / 4);
        ctx.quadraticCurveTo(hx, hy - size / 2, hx + size / 2, hy - size / 2);
        ctx.quadraticCurveTo(hx + size, hy - size / 2, hx + size, hy + size / 4);
        ctx.quadraticCurveTo(hx + size, hy + size * 0.8, hx, hy + size * 1.4);
        ctx.quadraticCurveTo(hx - size, hy + size * 0.8, hx - size, hy + size / 4);
        ctx.quadraticCurveTo(hx - size, hy - size / 2, hx - size / 2, hy - size / 2);
        ctx.quadraticCurveTo(hx, hy - size / 2, hx, hy + size / 4);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Animation Loop
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            
            // Delete dead particles to save RAM
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================================================
// 4. Real-time Love Counter
// ==========================================================================
function initLoveCounter() {
    const yearsVal = document.getElementById("years");
    const daysVal = document.getElementById("days");
    const hoursVal = document.getElementById("hours");
    const minutesVal = document.getElementById("minutes");
    const secondsVal = document.getElementById("seconds");

    if (!yearsVal || !daysVal || !hoursVal || !minutesVal || !secondsVal) return;

    function updateCounter() {
        const start = new Date(ANNIVERSARY_DATE);
        const now = new Date();
        
        // Safety check if date config is in future
        if (now < start) {
            yearsVal.innerText = "00";
            daysVal.innerText = "00";
            hoursVal.innerText = "00";
            minutesVal.innerText = "00";
            secondsVal.innerText = "00";
            return;
        }

        // Calculate Calendar Year Difference accurately
        let years = now.getFullYear() - start.getFullYear();
        let tempAnniversary = new Date(start);
        tempAnniversary.setFullYear(start.getFullYear() + years);
        
        // If anniversary date hasn't occurred yet in this calendar year, subtract 1 year
        if (tempAnniversary > now) {
            years--;
            tempAnniversary = new Date(start);
            tempAnniversary.setFullYear(start.getFullYear() + years);
        }

        // Remaining delta in milliseconds
        let diff = now - tempAnniversary;

        // Breakdown delta to Days, Hours, Minutes, and Seconds
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);

        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);

        const seconds = Math.floor(diff / 1000);

        // Render to DOM (Adding leading zeros for premium styling)
        yearsVal.innerText = String(years).padStart(2, "0");
        daysVal.innerText = String(days).padStart(2, "0");
        hoursVal.innerText = String(hours).padStart(2, "0");
        minutesVal.innerText = String(minutes).padStart(2, "0");
        secondsVal.innerText = String(seconds).padStart(2, "0");
    }

    // Run immediately and update every second
    updateCounter();
    setInterval(updateCounter, 1000);
}

// ==========================================================================
// 5. Timeline Nodes & Content Reveal Observer (حكايتنا)
// ==========================================================================
function initScrollReveals() {
    const reveals = document.querySelectorAll(".scroll-reveal, .timeline-item");
    
    // Intersection Observer configs
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's a timeline item, trigger fade-in-up class
                if (entry.target.classList.contains("timeline-item")) {
                    entry.target.classList.add("fade-in-up");
                } else {
                    entry.target.classList.add("reveal-active");
                }
                // Stop observing element once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(element => {
        observer.observe(element);
    });
}

// ==========================================================================
// 6. Envelope click / Letter Modals Logic
// ==========================================================================
function initLettersLogic() {
    const envelopeCards = document.querySelectorAll(".envelope-card");
    const letterModal = document.getElementById("letter-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalTitle = document.getElementById("modal-letter-title");
    const modalText = document.getElementById("modal-letter-text");

    if (!letterModal || !closeModalBtn || !modalTitle || !modalText) return;

    envelopeCards.forEach(card => {
        card.addEventListener("click", () => {
            const letterId = card.getAttribute("data-letter");
            const data = LETTERS_DATA[letterId];

            if (data) {
                // Add class 'open' to animate opening transition
                card.classList.add("open");

                // Wait for the transition to finish before launching modal
                setTimeout(() => {
                    modalTitle.innerText = data.title;
                    modalText.innerText = data.text;
                    
                    letterModal.classList.add("active");
                    // Stop scrolling of body behind modal
                    document.body.style.overflow = "hidden";
                }, 500);
            }
        });
    });

    // Close Modal Event Handler
    function closeModal() {
        letterModal.classList.remove("active");
        document.body.style.overflow = "auto";
        // Reset all envelope open states
        envelopeCards.forEach(card => {
            card.classList.remove("open");
        });
    }

    closeModalBtn.addEventListener("click", closeModal);
    
    // Close modal if user clicks outside paper area
    letterModal.addEventListener("click", (e) => {
        if (e.target === letterModal) {
            closeModal();
        }
    });

    // Escape Key close handler
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && letterModal.classList.contains("active")) {
            closeModal();
        }
    });
}

// ==========================================================================
// 7. Eid Greeting Typing Effect
// ==========================================================================
function initEidGreetingTyping() {
    const typingTextEl = document.getElementById("typing-text");
    const eidSection = document.getElementById("eid-greeting-section");
    if (!typingTextEl || !eidSection) return;

    let hasStartedTyping = false;
    let index = 0;
    const speed = 70; // typing speed in milliseconds per letter

    function typeCharacter() {
        if (index < EID_GREETING_TEXT.length) {
            typingTextEl.innerHTML += EID_GREETING_TEXT.charAt(index);
            index++;
            setTimeout(typeCharacter, speed);
        } else {
            // Hide the cursor indicator after printing ends
            const cursor = document.querySelector(".typing-cursor");
            if (cursor) cursor.style.display = "none";
        }
    }

    // Start typing only when the Eid Greeting section comes into view (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStartedTyping) {
                hasStartedTyping = true;
                setTimeout(typeCharacter, 800); // slight delay before starting to write
                observer.unobserve(eidSection);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(eidSection);
}
