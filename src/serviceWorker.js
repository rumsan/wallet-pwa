export default function registerServiceWorker() {
	const swUrl = `${process.env.PUBLIC_URL}/sw.js`;
	navigator.serviceWorker.register(swUrl).then(res => {
		console.log('Service worker registered');
	});
}
