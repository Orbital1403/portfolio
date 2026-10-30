/* grgaGrow push only: no fetch handler and no private-data/offline caching. */
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { /* Use the generic fallback. */ }
  event.waitUntil(self.registration.showNotification('grgaGrow', {
    body: 'Your garden has an update. Open grgaGrow to review it.',
    tag: typeof data.tag === 'string' ? data.tag.slice(0, 80) : 'my-garden-update',
    icon: new URL('icon-192.png', self.registration.scope).href,
    badge: new URL('icon-192.png', self.registration.scope).href,
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const tag = event.notification.tag;
  const valid = typeof tag === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tag);
  const target = new URL(valid ? './?mode=live&view=history&notification=' + encodeURIComponent(tag) : './?view=alerts', self.registration.scope).href;
  event.waitUntil((async () => {
    // Open the destination during the notification interaction. Android Chrome
    // can reuse an installed app; a stale background client must not block it.
    try {
      const opened = await self.clients.openWindow(target);
      // Opening succeeded even if the browser refuses an additional focus call.
      if (opened) { try { await opened.focus(); } catch {} }
      return;
    } catch {
      // Some browsers only let us focus an existing app window. Try each one:
      // an unusable/closed client must not prevent another client from opening.
      const clients = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
      for (const client of clients) {
        if (!client.url.startsWith(self.registration.scope)) continue;
        try {
          await client.focus();
          const navigated = await client.navigate(target);
          if (navigated) return;
        } catch {}
      }
    }
  })());
});
