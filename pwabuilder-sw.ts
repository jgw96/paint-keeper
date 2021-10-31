import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {StaleWhileRevalidate } from 'workbox-strategies';

// Add custom service worker logic, such as a push notification serivce, or json request cache.
self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

registerRoute(
  ({url}) => url.origin === 'https://unpkg.com/',
  new StaleWhileRevalidate(),
);

try {
  //@ts-ignore
  precacheAndRoute(self.__WB_MANIFEST);
} catch (err) {
  console.info('if you are in development mode this error is expected: ', err);
}
