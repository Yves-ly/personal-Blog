<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../services/api'

const router = useRouter()
const mode = ref('login') // 'login' 或 'register'
const username = ref('')
const password = ref('')
const inviteCode = ref('')
const message = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (!username.value.trim() || !password.value.trim()) {
    message.value = '用户名和密码不能为空'
    return
  }

  loading.value = true
  message.value = ''

  try {
    if (mode.value === 'register') {
      await authApi.register(username.value, password.value, inviteCode.value)
      message.value = '注册成功，请登录'
      mode.value = 'login'
    } else {
      const res = await authApi.login(username.value, password.value)
      localStorage.setItem('token', res.token)
      localStorage.setItem('username', res.username)
      localStorage.setItem('role', res.role)
      message.value = '登录成功，正在跳转...'
      setTimeout(() => router.push('/editor'), 800)
    }
  } catch (err) {
    message.value = err.message
  } finally {
    loading.value = false
  }
}

function switchMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  message.value = ''
}
</script>

<template>
  <div class="login-view">
    <div class="login-box">
      <h1 class="login-title">个人博客登录</h1>
      <p class="login-subtitle">{{ mode === 'login' ? '请登录你的账号' : '创建一个新账号' }}</p>

      <!-- 账户输入框 -->
      <div class="input-group">
        <label>账户</label>
        <input
          v-model="username"
          type="text"
          class="login-input"
          placeholder="请输入账户"
          @keyup.enter="handleSubmit"
        />
      </div>

      <!-- 密码输入框 -->
      <div class="input-group">
        <label>密码</label>
        <input
          v-model="password"
          type="password"
          class="login-input"
          placeholder="请输入密码"
          @keyup.enter="handleSubmit"
        />
      </div>

      <!-- 邀请码输入框/注册验证 -->
      <div v-if="mode === 'register'" class="input-group">
        <label>邀请码</label>
        <input
          v-model="inviteCode"
          type="text"
          class="login-input"
          placeholder="请输入邀请码"
          @keyup.enter="handleSubmit"
        />
      </div>
      
      <p v-if="message" class="message">{{ message }}</p>

      <button class="login-btn" :disabled="loading" @click="handleSubmit">
        {{ loading ? '处理中...' : (mode === 'login' ? '登录' : '注册') }}
      </button>

      <p class="switch-mode" @click="switchMode">
        {{ mode === 'login' ? '没有账号？点此注册' : '已有账号？点此登录' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: var(--card-bg);
  border-radius: 28px;
  padding: 40px 36px;
  box-shadow: var(--box-shadow);
  transition: background 0.3s ease;
}

.login-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--title-color);
  text-align: center;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--subtitle-color);
  text-align: center;
  margin-bottom: 32px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.login-input {
  width: 100%;
  padding: 12px 18px;
  font-size: 15px;
  background: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: 40px;
  outline: none;
  color: var(--search-text);
  transition: all 0.2s ease;
}

.login-input:focus {
  border-color: var(--subtitle-color);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06);
}

.message {
  text-align: center;
  font-size: 14px;
  color: var(--subtitle-color);
  margin-bottom: 16px;
}

.login-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #40a647, #2d6e2c);
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -6px rgba(64, 166, 71, 0.5);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-mode {
  text-align: center;
  font-size: 13px;
  color: var(--subtitle-color);
  margin-top: 20px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.switch-mode:hover {
  color: var(--title-color);
}

@media (max-width: 768px) {
  .login-box {
    padding: 24px 20px;
  }
  .login-title {
    font-size: 22px;
  }
}
</style>