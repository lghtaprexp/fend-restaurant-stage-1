// Register service worker
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function(reg) {
	console.log("Service worker registered successfully");
	}).catch(function(e) {
	console.log("Service worker couldn't register", e);
	});
}