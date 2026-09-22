<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t, locale } = useI18n()

// ===== 主题切换 =====
const isDark = ref(localStorage.getItem('theme') === 'dark')

function toggleTheme() {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  if (isDark.value) {
    document.body.classList.add('dark')
  }
})

// ===== 语言切换 =====
function toggleLang() {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
}

// 语言变化时持久化
watch(locale, (newLang) => {
  localStorage.setItem('lang', newLang)
})

// ===== 点头像三次跳转登录 =====
const clickCount = ref(0)
let clickTimer = null

function handleAvatarClick() {
  clickCount.value++

  if (clickTimer) clearTimeout(clickTimer)

  clickTimer = setTimeout(() => {
    clickCount.value = 0
  }, 800)

  if (clickCount.value >= 3) {
    clickCount.value = 0
    clearTimeout(clickTimer)
    router.push('/login')
  }
}
</script>

<template>
  <!-- 右上角按钮组：主题 + 语言 -->
  <div class="top-buttons">
    <button class="theme-button" @click="toggleTheme" title="切换主题">
      {{ isDark ? '☀️' : '🌙' }}
    </button>
    <button class="lang-button" @click="toggleLang" title="切换语言">
      {{ locale === 'zh-CN' ? 'EN' : '中' }}
    </button>
  </div>

  <div class="biaotiblock">
    <img src="/Photo/ProfilePicture/Yves.png" alt="头像" class="touxiang" @click="handleAvatarClick">
    <h1 class="dabiaoti">{{ t('header.title') }}</h1>
    <p class="liuyan">{{ t('header.slogan') }}</p>
    <div class="tiaozhuan">
      <router-link to="/">{{ t('header.nav.home') }}</router-link>
      <router-link to="/boke">{{ t('header.nav.boke') }}</router-link>
      <router-link to="/touch">{{ t('header.nav.touch') }}</router-link>
      <router-link to="/search">{{ t('header.nav.search') }}</router-link>
    </div>
  </div>
</template>

<style scoped>
/* ===== 右上角按钮组：固定定位，垂直排列 ===== */
.top-buttons {
  position: fixed;
  top: 40px;
  right: 100px;
  z-index: 9999;
  display: flex;
  flex-direction: column;   /* 垂直排列 */
  align-items: center;
  gap: 8px;                 /* 两个按钮之间的距离 */
}

.theme-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
}

.lang-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--header-link-color);
  padding: 0;
  transition: color 0.3s ease;
}

.lang-button:hover {
  color: var(--subtitle-color);
}

/* ===== 标题栏 ===== */
.biaotiblock {
  padding-top: 10px;
  height: 120px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--border-color);
  background: var(--header-bg);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dabiaoti {
  color: var(--title-color);
  margin-left: 120px;
  margin-top: -100px;
  width: 650px;
}

.liuyan {
  color: var(--subtitle-color);
  margin-left: 120px;
  width: 650px;
  font-size: 15px;
}

.touxiang {
  width: 91px;
  height: 91px;
  border-radius: 50%;
  margin-top: 10px;
  margin-left: 10px;
  transition: transform 0.4s ease;
  cursor: pointer;
}

.touxiang:hover {
  transform: scale(1.2) rotate(360deg);
}

.tiaozhuan {
  display: flex;
  gap: 25px;
  position: absolute;
  top: 40px;
  right: 150px;
  width: 300px;
  font-weight: 500;
}

.tiaozhuan a,
.tiaozhuan a:visited {
  text-decoration: none;
  color: var(--header-link-color);
  font-size: 18px;
  transition: color 0.3s ease;
}

@media (max-width: 768px) {
  .top-buttons {
    top: 20px;
    right: 20px;
    flex-direction: row;
    gap: 12px;
  }

  .biaotiblock {
    height: auto;
    padding: 20px 10px;
    text-align: center;
  }

  .dabiaoti {
    margin: 10px 0 0 0;
    width: 100%;
    font-size: 22px;
  }

  .liuyan {
    margin: 6px 0 0 0;
    width: 100%;
    font-size: 13px;
  }

  .touxiang {
    margin: 0 auto;
    display: block;
  }

  .tiaozhuan {
    position: static;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 14px;
    gap: 16px;
  }

  .tiaozhuan a {
    font-size: 16px;
  }
}
</style>