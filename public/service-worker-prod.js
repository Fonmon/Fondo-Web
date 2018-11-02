self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = 'Fondo Montañez';
    const options = {
        body: 'Yay it works.',
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
});