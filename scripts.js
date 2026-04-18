document.addEventListener("DOMContentLoaded", () => {
  const envelopeContainer = document.querySelector("#envelope-container");
  const envelope = document.querySelector(".envelope");
  const cakeContainer = document.querySelector("#cake-container");
  const messageContainer = document.querySelector("#message-container");
  const audio = document.getElementById("bg-music");

  let step = 1; // 1: Envelope, 2: Cake, 3: Message

  // 1. Envelope Interaction
  envelope.addEventListener("click", () => {
    if (step !== 1) return;
    step = 2;

    // Animate Envelope Open
    envelope.classList.add("open");

    // Play Music immediately on interaction (browser policy compliant)
    audio.play().catch((e) => console.log("Audio play failed:", e));

    // Start Hearts Animation inside envelope (simple CSS based)
    // (CSS opacity transition handled in styles)

    // Wait for envelope open animation to finish (e.g., 2 seconds)
    setTimeout(() => {
      // Fade out envelope
      envelopeContainer.style.transition = "opacity 1s";
      envelopeContainer.style.opacity = "0";

      setTimeout(() => {
        envelopeContainer.classList.add("hidden");

        // Show Cake Layer
        cakeContainer.classList.remove("hidden");

        // Trigger Cake Animation (function to be built next)
        startCakeAnimation();
      }, 1000); // 1s wait for fade out
    }, 1500); // 1.5s wait for open animation
  });

  // 2. Cake Animation Helper
  function startCakeAnimation() {
    const plate = document.querySelector(".plate");
    const tiers = document.querySelectorAll(".tier");
    const icing = document.querySelector(".icing-drip"); // New Icing
    const candle = document.querySelector(".candle");
    const flame = document.querySelector(".flame");
    const hbdText = document.querySelector("#hbd-text"); // New Text
    const instruction = document.getElementById("candle-instruction");

    // 1. Show Plate
    setTimeout(() => {
      plate.classList.add("visible");
    }, 500);

    // 2. Drop Tiers (Bottom to Top)
    // HTML: top, bottom.
    // We want bottom first.
    const tierOrder = Array.from(tiers).reverse(); // [Bottom, Top]

    tierOrder.forEach((tier, index) => {
      setTimeout(
        () => {
          tier.classList.add("fall");
        },
        1000 + index * 800, // Slower interval (800ms) since fewer items
      );
    });

    // 3. Show Icing (after top tier lands)
    // 2 tiers * 800ms = 1600ms total drop time approx
    setTimeout(
      () => {
        icing.classList.add("visible");
      },
      1000 + tierOrder.length * 800 + 200,
    );

    // 4. Drop Candle (after icing)
    setTimeout(
      () => {
        candle.classList.add("fall");
      },
      1000 + tierOrder.length * 800 + 1000,
    );

    // 5. Light Candle, Show Text & Enable Interaction
    setTimeout(
      () => {
        flame.classList.add("lit");
        hbdText.classList.add("visible"); // Fade in text
        instruction.classList.remove("hidden");

        // Start Decorations (Balloons & Stars)
        createDecorations();

        // Enable Blow Interaction
        enableBlowInteraction(flame, hbdText, instruction);
      },
      1000 + tierOrder.length * 800 + 2000,
    );
  }

  function createDecorations() {
    const container = document.getElementById("decorations-container");
    const colors = [
      "#ef5350",
      "#ec407a",
      "#ab47bc",
      "#7e57c2",
      "#5c6bc0",
      "#42a5f5",
      "#29b6f6",
      "#26c6da",
      "#26a69a",
      "#66bb6a",
      "#9ccc65",
      "#d4e157",
      "#ffee58",
      "#ffca28",
      "#ffa726",
      "#ff7043",
    ];

    // Balloons
    for (let i = 0; i < 15; i++) {
      const balloon = document.createElement("div");
      balloon.classList.add("balloon");
      balloon.style.left = Math.random() * 100 + "%";
      balloon.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      balloon.style.animationDelay = Math.random() * 5 + "s";
      container.appendChild(balloon);
    }

    // Stars
    for (let i = 0; i < 30; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 2 + "s";
      container.appendChild(star);
    }
  }

  function enableBlowInteraction(flame, hbdText, instruction) {
    let blown = false;

    const blowAction = () => {
      if (blown) return;
      blown = true;

      // 1. Extinguish Flame
      flame.classList.remove("lit");
      flame.classList.add("out");
      instruction.style.opacity = "0";

      // 2. Fade out Text
      hbdText.classList.remove("visible");
      hbdText.classList.add("fade-out");

      // 3. Create Smoke
      createSmoke(flame);

      // 4. Confetti Explosion
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });

      // 5. Transition to Message
      setTimeout(() => {
        window.finishCakePhase();
      }, 2000); // 2s wait
    };

    // Click / Touch to blow
    document.addEventListener("click", (e) => {
      // Check if step is 2 (Cake)
      if (step === 2 && e.target.closest("#cake-container")) {
        blowAction();
      }
    });

    // Swipe Detection
    let touchStartY = 0;
    document.addEventListener("touchstart", (e) => {
      touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (e) => {
      if (step !== 2) return;
      const touchEndY = e.changedTouches[0].screenY;
      if (Math.abs(touchEndY - touchStartY) > 50) {
        // Swipe detected
        blowAction();
      }
    });
  }

  function createSmoke(sourceElement) {
    // Append smoke relative to candle
    const candle = document.querySelector(".candle");
    for (let i = 0; i < 5; i++) {
      const smoke = document.createElement("div");
      smoke.classList.add("smoke");
      candle.appendChild(smoke);
      smoke.style.animationDelay = i * 0.2 + "s";
    }
  }

  // Helper to move to final message (will be called after candle blow)
  window.finishCakePhase = function () {
    step = 3;
    cakeContainer.style.opacity = "0";
    setTimeout(() => {
      cakeContainer.classList.add("hidden");
      messageContainer.classList.remove("hidden");

      // Trigger Message Animations
      typeWriterEffect();
      animateParagraphs();
    }, 1000);
  };

  // Typing Effect
  function typeWriterEffect() {
    const title = document.getElementById("msg-title");
    const text = "Happy Birthday, Aprilia Husna! 🎂✨";
    let index = 0;
    title.classList.add("typing");

    function type() {
      if (index < text.length) {
        title.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100); // Typing speed
      } else {
        title.classList.remove("typing"); // Stop blinking cursor
      }
    }
    type();
  }

  // Sequential Paragraph Fade In
  function animateParagraphs() {
    const paragraphs = document.querySelectorAll("#msg-paragraphs p");
    paragraphs.forEach((p, index) => {
      p.style.animationDelay = index * 1.5 + 3 + "s"; // Delay after typing finishes (approx 3s)
      p.classList.add("fade-in-up");
    });
    // Show signature last
    const signature = document.querySelector(".signature");
    if (signature)
      signature.style.animationDelay = paragraphs.length * 1.5 + 3 + "s";

    // Show Close Button after everything
    // Typing (~3s) + Paragraphs (N * 1.5s) + Signature (1.5s) + buffer
    const totalDelay = 3000 + paragraphs.length * 1500 + 1500 + 1000;
    setTimeout(() => {
      document.getElementById("close-btn").classList.add("visible");
    }, totalDelay);
  }

  // Close Button
  document.getElementById("close-btn").addEventListener("click", () => {
    // Attempt to close window
    window.close();
    // Fallback if browser blocks it: Replace content with Goodbye
    document.body.innerHTML =
      '<div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;color:#d81b60;font-family:sans-serif;"><h1>Makasih yaa! Dadah 👋</h1><p>(You can close this tab now)</p></div>';
  });
});
