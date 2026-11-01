const EMOJIS = ['🎉', '🎁', '⭐', '❄️', '🎄', '🍬']

export function useConfetti() {
  function confetti(count = 40) {
    if (!process.client) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span')
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      Object.assign(el.style, {
        position: 'fixed',
        top: '-30px',
        left: `${Math.random() * 100}vw`,
        fontSize: `${16 + Math.random() * 20}px`,
        pointerEvents: 'none',
        zIndex: '9999'
      })
      document.body.appendChild(el)

      const drift = (Math.random() - 0.5) * 200
      const animation = el.animate(
        [
          { transform: 'translate(0, 0) rotate(0deg)' },
          { transform: `translate(${drift}px, 105vh) rotate(${Math.random() * 720}deg)` }
        ],
        { duration: 2000 + Math.random() * 1500, delay: Math.random() * 400, easing: 'ease-in' }
      )
      animation.onfinish = () => el.remove()
    }
  }

  return { confetti }
}
