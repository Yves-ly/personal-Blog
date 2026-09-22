<script setup>
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  onMounted(() => {
    const cards = document.querySelectorAll('.cards-row .card')
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('card-visible')
      }, index * 150)
    })

    const overlay = document.getElementById('popupOverlay')
    const close = document.getElementById('popupClose')
    const popupTitle = document.getElementById('popupTitle')
    const popupInfo = document.getElementById('popupInfo')

      function getInfoMap() {
    return {
      Mail: {
        img: '/Photo/Contact/Mail.png',
        text: `Yves0428@163.com\n${t('touch.mailNote')}`
      },
      QQ: {
        img: '/Photo/Contact/QQ.png',
        text: `3314228099\n${t('touch.qqNote')}`
      },
      WeChat: {
        img: '/Photo/Contact/WeChat.png',
        text: `18025892883\n${t('touch.wechatNote')}`
      }
    }
  }

    document.querySelectorAll('.contact-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const data = getInfoMap()[this.dataset.key]
        popupTitle.textContent = `📬 ${this.dataset.contact}`
        popupInfo.innerHTML = `
        <img src="${data.img}" style="width:100%;max-width:280px;height:auto;display:block;margin:0 auto 8px;border-radius:8px;">
        <p style="text-align:center;color: var(--popup-info-text);font-size:14px;white-space:pre-line;margin:0;">${data.text}</p>
      `
        overlay.classList.add('active')
      })
    })

    close.addEventListener('click', () => overlay.classList.remove('active'))
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active')
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active')
      }
    })
  })
</script>

<template>
  <div class="touch-view">
    <div class="touchme">{{ t('touch.heading') }}</div>

    <div class="contact-cars">
      <div class="cards-row">
        <div class="card">
          <div class="card-inner">
            <div class="contact-info">
              <div class="icon">📧</div>
              <h3 class="contact-type">{{ t('touch.email') }}</h3>
              <p class="contact-value">Yves0428@163.com</p>
            </div>
            <div class="card-footer">
              <button class="contact-btn" :data-contact="t('touch.email')" data-key="Mail">
                {{ t('touch.sendEmail') }}
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-inner">
            <div class="contact-info">
              <div class="icon">🐧</div>
              <h3 class="contact-type">{{ t('touch.qq') }}</h3>
              <p class="contact-value">3314228099</p>
            </div>
            <div class="card-footer">
              <button class="contact-btn" :data-contact="t('touch.qq')" data-key="QQ">
                {{ t('touch.chatQQ') }}
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-inner">
            <div class="contact-info">
              <div class="icon">💬</div>
              <h3 class="contact-type">{{ t('touch.wechat') }}</h3>
              <p class="contact-value">18025892883</p>
            </div>
            <div class="card-footer">
              <button class="contact-btn" :data-contact="t('touch.wechat')" data-key="WeChat">
                {{ t('touch.contactWeChat') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="popup-overlay" id="popupOverlay">
      <div class="popup-box">
        <button class="popup-close" id="popupClose">✕</button>
        <h2 id="popupTitle">{{ t('touch.popupTitle') }}</h2>
        <p>{{ t('touch.popupWelcome') }}</p>
        <div class="popup-info" id="popupInfo">内容</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-cars {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
}

.cards-row {
  margin-top: 15rem;
  margin-bottom: 16rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.card {
  flex: 1;
  min-width: 260px;
  background: var(--card-bg);
  transition: transform 0.25s ease, box-shadow 0.2s, background 0.3s ease;
  backdrop-filter: blur(2px);
  border-radius: 2rem;
  position: relative;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 28px 36px -14px rgba(0, 0, 0, 0.3);
  background: var(--card-bg);
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25%;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  pointer-events: none;
  z-index: 1;
  border-radius: 2rem 2rem 0 0;
}

.card-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: 1.8rem 1.5rem 1.5rem;
  min-height: 320px;
}

.contact-info {
  flex: 1;
  text-align: center;
  margin: 0.8rem 0 1rem;
}

.icon {
  font-size: 3.2rem;
  margin-bottom: 0.5rem;
}

.contact-type {
  font-size: 1.8rem;
  font-weight: 650;
  color: var(--title-color);
  margin-bottom: 0.5rem;
}

.contact-value {
  font-size: 1rem;
  font-weight: 500;
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 48px;
  color: var(--text-color);
  backdrop-filter: blur(2px);
  word-break: break-word;
}

.touchme {
  position: absolute;
  top: 320px;
  left: 220px;
  font-size: 18px;
  color: var(--text-color);
  font-weight: 300;
}

.card-footer {
  margin-top: 1rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  padding-top: 1rem;
}

.contact-btn {
  display: inline-block;
  background: #eef2f9;
  color: #11340a;
  text-decoration: none;
  font-weight: 600;
  padding: 0.7rem 1.4rem;
  border-radius: 2.5rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  border: 1px solid rgba(255, 255, 240, 0.6);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.contact-btn:hover {
  background: #40a647;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -6px rgba(0, 0, 0, 0.15);
}

.popup-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 99999;
  align-items: center;
  justify-content: center;
}

.popup-overlay.active {
  display: flex;
}

.popup-box {
  background: var(--card-bg);
  color: var(--text-color);
  border-radius: 20px;
  padding: 30px 35px;
  max-width: 400px;
  width: 90%;
  position: relative;
  animation: popupIn 0.3s ease;
}

@keyframes popupIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.popup-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.popup-box h2 {
  margin-bottom: 10px;
}

.popup-box p {
  margin-bottom: 16px;
}

.popup-box .popup-info {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  word-break: break-all;
}

@media (max-width: 780px) {
  .cards-row {
    gap: 1.5rem;
  }
  .card-inner {
    padding: 1.5rem;
  }
  .contact-type {
    font-size: 1.6rem;
  }
}

@media (max-width: 650px) {
  .cards-row {
    flex-direction: column;
    align-items: center;
  }
  .card {
    width: 100%;
    max-width: 380px;
  }
}

.cards-row .card {
  opacity: 0;
  transform: translateX(-40px);
  transition: all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.cards-row .card.card-visible {
  opacity: 1;
  transform: translateX(0);
  animation: littleJump 0.5s ease forwards;
}

.cards-row .card:nth-child(1).card-visible {
  transition-delay: 0s;
  animation-delay: 0s;
}

.cards-row .card:nth-child(2).card-visible {
  transition-delay: 0.15s;
  animation-delay: 0.15s;
}

.cards-row .card:nth-child(3).card-visible {
  transition-delay: 0.3s;
  animation-delay: 0.3s;
}

@keyframes littleJump {
  0% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  70% { transform: translateY(3px); }
  100% { transform: translateY(0); }
}

@media (max-width: 768px) {
  .touchme {
    position: static;
    text-align: center;
    margin: 20px 0;
    font-size: 16px;
  }

  .cards-row {
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    margin-bottom: 4rem;
    gap: 1.5rem;
  }

  .card {
    width: 90%;
    max-width: 380px;
    min-width: unset;
  }

  .card-inner {
    min-height: auto;
    padding: 1.5rem;
  }

  .contact-type {
    font-size: 1.4rem;
  }

  .popup-box {
    padding: 20px;
    max-width: 90%;
  }
}
</style>