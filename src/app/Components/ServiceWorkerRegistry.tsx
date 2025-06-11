'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistry() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registrado com sucesso:', registration);
          })
          .catch(error => {
            console.error('Erro ao registrar Service Worker:', error);
          });
      });
    }
  }, []);

  return null;
}