const CACHE_NAME = "rumsan-wallet-cache-v1";

this.addEventListener('install', (event) => {
	const cacheFiles = async () => {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(
			[
			'/static/js/main.chunk.js',
			'/static/js/1.chunk.js',
			'/static/js/bundle.js', 
			'index.html', 
			'/',
			'/assets/css/styles.css',
			'/assets/css/inc/bootstrap/bootstrap.min.css',
			'/assets/css/inc/owl-carousel/owl.carousel.min.css',
			'/favicon.ico',
			'/assets/css/inc/owl-carousel/owl.theme.default.css',
			'/pwa'
		]);
  };
	event.waitUntil(cacheFiles())
});

this.addEventListener('fetch', (event) => {
	if(!navigator.onLine){
		event.respondWith(caches.match(event.request).then((resp) => {
			if(resp) {
				return resp;
			}
			let requestUrl = event.request.clone();
			fetch(requestUrl)
		})
		)
	}
});
