self.addEventListener('push', function(event) {
    const content = JSON.parse(event.data.text());
    const title = 'Fondo Montañez';
    const options = {
        body: content.body,
        icon: 'icons/logo_64.png',
        badge: 'icons/badge.png'
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
});