const CACHE_NAME = 'socialvault-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Background sync for posting
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-post') {
    event.waitUntil(syncPost());
  }
});

async function syncPost() {
  // Get pending posts from IndexedDB
  const posts = await getPendingPosts();
  
  for (const post of posts) {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Remove from pending posts
      await removePendingPost(post.id);
      
      // Show success notification
      self.registration.showNotification('Post Published', {
        body: 'Your post has been successfully published!',
        icon: '/icon-192x192.png',
        badge: '/icon-96x96.png'
      });
      
    } catch (error) {
      console.error('Failed to sync post:', error);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SocialVault', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open app when notification is clicked
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB operations
async function getPendingPosts() {
  return new Promise((resolve) => {
    const request = indexedDB.open('SocialVaultDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingPosts'], 'readonly');
      const store = transaction.objectStore('pendingPosts');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };
    };
    
    request.onerror = () => {
      resolve([]);
    };
  });
}

async function removePendingPost(postId) {
  return new Promise((resolve) => {
    const request = indexedDB.open('SocialVaultDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingPosts'], 'readwrite');
      const store = transaction.objectStore('pendingPosts');
      
      store.delete(postId);
      transaction.oncomplete = () => resolve();
    };
    
    request.onerror = () => resolve();
  });
}