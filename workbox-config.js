module.exports = {
    globDirectory: 'build/',
    globPatterns: [
        '**/*.{css,js}',
        'static/media/*',
        'index.html',
        'icons/*'
    ],
    globIgnores: ['*/service-worker-dev.js'],
    swDest: "build/service-worker.js",
    importScripts: (['./service-worker-prod.js']),

    runtimeCaching: [{
        urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
        handler: 'CacheFirst',
        options: {
            cacheName: 'images',
            expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60
            }
        }
    }, {
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'static-resources'
        }
    }]
}