<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
      @click="removeToast(toast.id)"
    >
      <span class="toast-icon">
        <span v-if="toast.type === 'success'">✅</span>
        <span v-else-if="toast.type === 'error'">❌</span>
        <span v-else>ℹ️</span>
      </span>
      <span class="toast-message">{{ toast.message }}</span>
      <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { Toast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: var(--z-index-toast);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) calc(var(--spacing-md) + 0.25rem);
  background: var(--color-bg-card);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  cursor: pointer;
  transition: all var(--transition-slow);
}

.toast:hover {
  transform: translateX(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toast-success {
  border-left: 4px solid var(--color-success);
}

.toast-error {
  border-left: 4px solid var(--color-error);
}

.toast-info {
  border-left: 4px solid var(--color-info);
}

.toast-icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--color-text-lighter);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color var(--transition-base);
}

.toast-close:hover {
  color: var(--color-text);
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-slow);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform var(--transition-slow);
}

@media (max-width: 768px) {
  .toast-container {
    top: var(--spacing-md);
    right: var(--spacing-md);
    left: var(--spacing-md);
  }

  .toast {
    min-width: auto;
    max-width: 100%;
  }
}
</style>

