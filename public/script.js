// Ship Responsibly · v2
// The page is static. The only JS we need is outbound-click tracking for the
// manual + sample CTAs, since /manual and /sample are server redirects
// (defined in vercel.json) — the browser leaves the page before any default
// page-view event would fire on the destination.

function attachManualTracking(scope) {
  const root = scope || document;
  root.querySelectorAll('a[href="/manual"], a[href="/sample"]').forEach((link) => {
    if (link.dataset.trackAttached) return;
    link.dataset.trackAttached = '1';
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'manual_click', {
          event_category: 'outbound',
          event_label: link.textContent.trim(),
          transport_type: 'beacon',
        });
      }
    });
  });
}
attachManualTracking();
