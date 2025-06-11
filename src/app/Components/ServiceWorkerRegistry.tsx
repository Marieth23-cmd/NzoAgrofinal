'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistry() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('Service Worker registrado com sucesso:', registration)
        } catch (error) {
          console.error('Erro ao registrar Service Worker:', error)
        }
      })
    }
  }, [])

  return null
}