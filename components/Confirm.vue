<template>
  <div v-if="isOpen" class="confirm-overlay" @click.self="handleCancel">
    <div class="confirm-modal">
      <h3 class="confirm-title">{{ options.title }}</h3>
      <p class="confirm-message">{{ options.message }}</p>
      <div class="confirm-actions">
        <button @click="handleCancel" class="btn-cancel">{{ options.cancelText }}</button>
        <button @click="handleConfirm" :class="['btn-confirm', `btn-confirm-${options.type}`]">
          {{ options.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from '~/composables/useConfirm'

const { isOpen, options, handleConfirm, handleCancel } = useConfirm()
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-toast);
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.confirm-modal {
  background: var(--color-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
  max-width: 500px;
  width: 90%;
  box-sizing: border-box;
  animation: slideUp var(--transition-base);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.confirm-title {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.confirm-message {
  margin: 0 0 var(--spacing-xl) 0;
  color: var(--color-text);
  font-size: var(--font-size-base);
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-cancel {
  background: var(--color-bg-light);
  color: var(--color-text);
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm {
  color: var(--color-text-inverse);
}

.btn-confirm-danger {
  background: var(--color-error);
}

.btn-confirm-danger:hover {
  background: #b01e1e;
}

.btn-confirm-warning {
  background: var(--color-warning);
}

.btn-confirm-warning:hover {
  background: #e0a800;
}

.btn-confirm-info {
  background: var(--color-primary);
}

.btn-confirm-info:hover {
  background: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .confirm-modal {
    width: 95%;
    padding: var(--spacing-lg);
  }

  .confirm-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>

