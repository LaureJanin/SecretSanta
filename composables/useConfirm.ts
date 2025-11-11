import { ref, readonly } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const isOpen = ref(false)
const options = ref<ConfirmOptions>({ message: '' })
const resolveRef = ref<((value: boolean) => void) | null>(null)

export const useConfirm = () => {
  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      options.value = {
        title: opts.title || 'Confirmation',
        message: opts.message,
        confirmText: opts.confirmText || 'Confirmer',
        cancelText: opts.cancelText || 'Annuler',
        type: opts.type || 'info'
      }
      resolveRef.value = resolve
      isOpen.value = true
    })
  }

  const handleConfirm = () => {
    if (resolveRef.value) {
      resolveRef.value(true)
      resolveRef.value = null
    }
    isOpen.value = false
  }

  const handleCancel = () => {
    if (resolveRef.value) {
      resolveRef.value(false)
      resolveRef.value = null
    }
    isOpen.value = false
  }

  return {
    isOpen: readonly(isOpen),
    options: readonly(options),
    confirm,
    handleConfirm,
    handleCancel
  }
}

