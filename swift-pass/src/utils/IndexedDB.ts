/* eslint-disable @typescript-eslint/no-explicit-any */
export const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ticketDB', 1);
  
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('formData')) {
          db.createObjectStore('formData', { keyPath: 'id' });
        }
      };
    });
  };
  
  export const saveFormData = async (data: any) => {
    const db = await initDB() as IDBDatabase;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['formData'], 'readwrite');
      const store = transaction.objectStore('formData');
      const request = store.put({ id: 'currentForm', ...data });
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  export const getFormData = async () => {
    const db = await initDB() as IDBDatabase;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['formData'], 'readonly');
      const store = transaction.objectStore('formData');
      const request = store.get('currentForm');
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };