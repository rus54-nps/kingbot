// service-worker.js
import { precacheAndRoute } from 'workbox-precaching';

// Автоматическое кэширование всех изображений
precacheAndRoute(self.__WB_MANIFEST);
