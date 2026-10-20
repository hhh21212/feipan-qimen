import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export interface PWAInstallState {
  canInstall: boolean
  isIOS: boolean
  isStandalone: boolean
  install: () => Promise<void>
}

export function usePWAInstall(): PWAInstallState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  const [isIOS] = useState(() => {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent
    return (
      /iPhone|iPad|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )
  })

  const [isStandalone] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true
    )
  })

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }

  return { canInstall: !!deferred, isIOS, isStandalone, install }
}
