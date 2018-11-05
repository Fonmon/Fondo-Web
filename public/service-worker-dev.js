// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// In the production build, this file is replaced with an actual service worker
// file that will precache your site's local assets.
// See https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', () => {
    self.clients.matchAll({ type: 'window' }).then(windowClients => {
        for (let windowClient of windowClients) {
        // Force open pages to refresh, so that they have a chance to load the
        // fresh navigation response from the local dev server.
        windowClient.navigate(windowClient.url);
        }
    });
});

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const content = JSON.parse(event.data.text());
    const title = 'Fondo Montañez';
    const options = {
        body: content.body,
        icon: 'icons/logo_64.png',
        badge: 'icons/badge.png'
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
});