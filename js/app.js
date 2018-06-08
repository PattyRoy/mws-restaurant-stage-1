if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(function(reg) {
    console.log('Yay, service worker registered');
  }).catch(function(err) {
    console.log('Boo, service worker registration failed', err);
  });
