(() => {
  'use strict';

  // DOM elements
  const stage = document.getElementById('gatefold-stage');
  const sealBtn = document.getElementById('center-seal-trigger');
  const floatingBadge = document.getElementById('floating-cta-badge');
  const addCalBtn = document.getElementById('add-cal-btn');
  const rsvpForm = document.getElementById('rsvp-form');
  const canvas = document.getElementById('petals-canvas');

  let petalsRunning = false;

  // 1. OPENING SEQUENCE
  function openGatefold() {
    if (!stage || stage.classList.contains('opening')) return;

    // Start 3D doors opening and ribbon untie
    stage.classList.add('opening');

    // After door animation completes, unlock main view
    setTimeout(() => {
      stage.classList.add('is-opened');
      document.body.classList.remove('invitation-locked');
      if (floatingBadge) floatingBadge.hidden = false;
      startPetals();
    }, 1100);
  }

  if (sealBtn) {
    sealBtn.addEventListener('click', openGatefold);
  }

  // 3. FALLING ROSE PETALS (CANVAS PHYSICS)
  function startPetals() {
    if (petalsRunning || !canvas) return;
    petalsRunning = true;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = window.innerWidth < 600 ? 24 : 45;
    const petals = [];

    // Realistic rose petal colors: ivory, blush pink, soft sage
    const colors = [
      { r: 247, g: 232, b: 235, a: 0.75 }, // soft blush
      { r: 255, g: 245, b: 242, a: 0.8 },  // ivory rose
      { r: 238, g: 216, b: 220, a: 0.65 }, // petal pink
      { r: 220, g: 230, b: 222, a: 0.55 }  // subtle sage leaf
    ];

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = 10 + Math.random() * 14;
        this.speedY = 0.8 + Math.random() * 1.5;
        this.speedX = -0.5 + Math.random() * 1.2;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = -0.02 + Math.random() * 0.04;
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = 0.02 + Math.random() * 0.03;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.sway = Math.random() * 2;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.sway) * 0.8 + this.speedX;
        this.sway += 0.02;
        this.angle += this.angularSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(Math.cos(this.flip), 1);

        ctx.beginPath();
        // Curvature of a natural petal
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
        
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        ctx.fill();

        ctx.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  // 4. LIVE WEDDING COUNTDOWN TIMER
  const weddingTargetDate = new Date('2026-12-14T15:00:00+05:30').getTime();

  function updateCountdown() {
    const now = Date.now();
    const distance = Math.max(0, weddingTargetDate - now);

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-mins');
    const elSecs = document.getElementById('cd-secs');

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 5. CALENDAR (.ICS) DOWNLOAD
  if (addCalBtn) {
    addCalBtn.addEventListener('click', () => {
      const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Kabir and Rhea//Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:kabir-rhea-wedding-20261214@wedding',
        `DTSTAMP:${stamp}`,
        'DTSTART:20261214T093000Z',
        'DTEND:20261215T183000Z',
        'SUMMARY:Kabir & Rhea — The Wedding Celebration',
        'LOCATION:The Glass Pavilion at Heritage West End\\, Bangalore\\, India',
        'DESCRIPTION:Celebration of the wedding of Kabir Singhania and Rhea Kapoor.\\nEvents: Mehendi, Sangeet, Haldi & Grand Reception.',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = 'kabir-rhea-wedding.ics';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (event) => {
      event.preventDefault();
      document.getElementById('demo-rsvp-status').textContent = 'Demo RSVP preview complete.';
    });
  }

})();
