/* grgaGrow push only: no fetch handler and no private-data/offline caching. */
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
  const target = new URL('./?view=alerts', self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(async clients => {
    const client = clients.find(client => client.url.startsWith(self.registration.scope));
    if (client) { await client.navigate(target); return client.focus(); }
    return self.clients.openWindow(target);
  }));
});
