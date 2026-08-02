/* ==========================================================================
   CELEBRATI — HIGH-RES PRINT CARD & DIGITAL GATE PASS RENDERER
   ========================================================================== */

import { renderQRCodeToCanvas } from './qr.js';

export function downloadPrintableCard(event) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1200;
  canvas.height = 1800; // High-res A5 aspect ratio

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 1200, 1800);
  grad.addColorStop(0, '#180307');
  grad.addColorStop(0.5, '#3D0F1A');
  grad.addColorStop(1, '#0F0306');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 1800);

  // Decorative Border
  ctx.strokeStyle = '#E5A965';
  ctx.lineWidth = 12;
  ctx.strokeRect(60, 60, 1080, 1680);
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 80, 1040, 1640);

  // Header Title
  ctx.fillStyle = '#E5A965';
  ctx.font = 'italic 52px "Great Vibes", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('You Are Cordially Invited To', 600, 260);

  // Event Title / Names
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 64px "Cormorant Garamond", serif';
  ctx.fillText(event.title || 'Special Celebration', 600, 420);

  // Tagline
  ctx.fillStyle = '#D4B6A6';
  ctx.font = '32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(event.tagline || '', 600, 520);

  // Horizontal Divider Line
  ctx.strokeStyle = '#E5A965';
  ctx.beginPath();
  ctx.moveTo(350, 600);
  ctx.lineTo(850, 600);
  ctx.stroke();

  // Date & Time
  const eventDate = new Date(event.startDate || Date.now());
  const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  ctx.fillStyle = '#E5A965';
  ctx.font = 'bold 44px "Cormorant Garamond", serif';
  ctx.fillText(dateStr, 600, 720);

  // Venue Info
  if (event.venues && event.venues[0]) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(event.venues[0].name, 600, 840);
    ctx.fillStyle = '#D4B6A6';
    ctx.font = '28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(event.venues[0].address, 600, 910);
  }

  // QR Code embedded
  const qrCanvas = document.createElement('canvas');
  renderQRCodeToCanvas(qrCanvas, window.location.href, 300);
  ctx.drawImage(qrCanvas, 450, 1080, 300, 300);

  ctx.fillStyle = '#E5A965';
  ctx.font = '24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Scan QR Code to RSVP & View Interactive Details', 600, 1450);

  // Download link
  const link = document.createElement('a');
  link.download = `${event.slug || 'event'}-printable-card.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function downloadDigitalGatePass(event, rsvpData) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 1400;

  // Background
  const grad = ctx.createLinearGradient(0, 0, 1000, 1400);
  grad.addColorStop(0, '#0F0918');
  grad.addColorStop(1, '#241638');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1000, 1400);

  // Border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 920, 1320);

  // Header Banner
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(40, 40, 920, 120);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL EVENT GATE PASS', 500, 115);

  // Guest Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 56px "Playfair Display", serif';
  ctx.fillText(rsvpData.guestName || 'Valued Guest', 500, 320);

  ctx.fillStyle = '#D4AF37';
  ctx.font = '28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`ATTENDANCE: JOYFULLY CONFIRMED (${(rsvpData.plusOnes || 0) + 1} GUESTS)`, 500, 390);

  // Event Details
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(event.title, 500, 500);

  // QR Code
  const qrCanvas = document.createElement('canvas');
  renderQRCodeToCanvas(qrCanvas, rsvpData.passCode || 'PASS-9999', 360);
  ctx.drawImage(qrCanvas, 320, 580, 360, 360);

  // Passcode Text
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 44px monospace';
  ctx.fillText(rsvpData.passCode || 'PASS-9999', 500, 1020);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Present this pass at venue entrance for fast-track entry', 500, 1120);

  const link = document.createElement('a');
  link.download = `GatePass-${rsvpData.guestName.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
