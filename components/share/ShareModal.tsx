'use client'

import { useState, useCallback } from 'react'
import QRCode from 'react-qr-code'
import { Modal } from '@/components/ui/Modal'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
}

export function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('input')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compartir colección">
      <div className="space-y-5">
        <p className="text-sm text-slate-400">
          Comparte este enlace con otro usuario para comparar colecciones e identificar posibles intercambios.
        </p>

        <div className="bg-white p-4 rounded-xl flex items-center justify-center">
          <QRCode value={shareUrl} size={180} />
        </div>

        <div className="bg-slate-900 rounded-lg p-3 flex items-center gap-2">
          <span className="text-xs text-slate-400 flex-1 break-all font-mono">{shareUrl}</span>
        </div>

        <button
          onClick={handleCopy}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {copied ? '✓ Enlace copiado' : 'Copiar enlace'}
        </button>
      </div>
    </Modal>
  )
}
