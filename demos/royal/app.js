(() => {
  'use strict';

  // DOM elements
  const gateStage = document.getElementById('palace-gate-stage');
  const gateTrigger = document.getElementById('gate-trigger');
  const floatingBadge = document.getElementById('royal-floating-badge');
  const addCalBtn = document.getElementById('royal-add-cal');
  const rsvpForm = document.getElementById('royal-rsvp-form');
  const canvas = document.getElementById('stardust-canvas');

  let stardustRunning = false;

  // 1. PALACE GATE OPENING SEQUENCE
  function openPalaceGates() {
    if (!gateStage || gateStage.classList.contains('opening')) return;

    // Trigger 3D carved door opening
    gateStage.classList.add('opening');

    // After swing duration, unlock main view
    setTimeout(() => {
      gateStage.classList.add('is-opened');
      document.body.classList.remove('invitation-locked');
      if (floatingBadge) floatingBadge.hidden = false;
      startStardust();
    }, 1200);
  }

  if (gateTrigger) {
    gateTrigger.addEventListener('click', openPalaceGates);
  }

  // 3. FLOATING ROYAL GOLDEN STARDUST / FIREFLIES
  function startStardust() {
    if (stardustRunning || !canvas) return;
    stardustRunning = true;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particleCount = window.innerWidth < 600 ? 30 : 60;
    const particles = [];

    class StarParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 15;
        this.radius = 0.8 + Math.random() * 2.2;
        this.speedY = 0.4 + Math.random() * 0.9;
        this.speedX = -0.3 + Math.random() * 0.6;
        this.alpha = 0.1 + Math.random() * 0.7;
        this.alphaSpeed = 0.008 + Math.random() * 0.015;
        this.sway = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.sway) * 0.5 + this.speedX;
        this.sway += 0.025;

        // Twinkle glow
        this.alpha += this.alphaSpeed;
        if (this.alpha > 0.85 || this.alpha < 0.15) {
          this.alphaSpeed = -this.alphaSpeed;
        }

        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Golden firefly glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FCE6A4';
        ctx.fillStyle = `rgba(223, 194, 125, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new StarParticle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  // 4. ROYAL COUNTDOWN TIMER
  const royalWeddingDate = new Date('2027-01-22T15:30:00+05:30').getTime();

  function updateRoyalCountdown() {
    const now = Date.now();
    const distance = Math.max(0, royalWeddingDate - now);

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elDays = document.getElementById('rc-days');
    const elHours = document.getElementById('rc-hours');
    const elMins = document.getElementById('rc-mins');
    const elSecs = document.getElementById('rc-secs');

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateRoyalCountdown, 1000);
  updateRoyalCountdown();

  // 5. ROYAL CALENDAR (.ICS) DOWNLOAD
  if (addCalBtn) {
    addCalBtn.addEventListener('click', () => {
      const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Aarav and Meera//Royal Wedding Celebration//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:aarav-meera-royal-wedding-20270122@wedding',
        `DTSTAMP:${stamp}`,
        'DTSTART:20270122T100000Z',
        'DTEND:20270123T183000Z',
        'SUMMARY:Kunwar Aarav & Baisa Meera — Royal Wedding Celebration',
        'LOCATION:The Jagmandir Island Palace\\, Lake Pichola\\, Udaipur\\, Rajasthan',
        'DESCRIPTION:The Royal Wedding Celebrations of Kunwar Aarav Singh Rathore and Baisa Meera Kumari Shekhawat.\\nFunctions: Mehendi, Sangeet & Sufi Mehfil, Baraat & Royal Banquet.',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const tempA = document.createElement('a');
      tempA.href = url;
      tempA.download = 'aarav-meera-royal-wedding.ics';
      document.body.appendChild(tempA);
      tempA.click();
      document.body.removeChild(tempA);
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
