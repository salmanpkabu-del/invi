/* ==========================================================================
   CELEBRATI — ICS CALENDAR EVENT GENERATOR
   ========================================================================== */

export function downloadICSFile(event) {
  const startDate = new Date(event.startDate || Date.now());
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // Default 4 hours duration

  function formatDate(d) {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Celebrati//NONSGML Invitation Platform//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@celebrati.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.tagline || 'Special event invitation'}`,
    `LOCATION:${event.venues && event.venues[0] ? event.venues[0].name + ', ' + event.venues[0].address : 'Venue TBD'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${event.slug || 'event'}-calendar.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
