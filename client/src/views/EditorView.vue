<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { marked } from 'marked'
  import { postApi } from '../services/api'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const router = useRouter()
  const posts = ref([])
  const currentId = ref(null)
  const title = ref('')
  const type = ref('博客')
  const content = ref('')
  const message = ref('')
  const loading = ref(false)
  const previewHtml = computed(() => marked.parse(content.value || ''))
  const isAdmin = computed(() => localStorage.getItem('role') === 'admin')
  const newCode = ref('')

  async function loadPosts() {
    try {
      posts.value = await postApi.list()
    } catch (err) {
      message.value = err.message
    }
  }

  function newPost() {
    currentId.value = null
    title.value = ''
    type.value = '博客'
    content.value = ''
    message.value = ''
  }

  async function selectPost(id) {
    try {
      const post = await postApi.get(id)
      currentId.value = post.id
      title.value = post.title
      type.value = post.type
      content.value = post.content
      message.value = ''
    } catch (err) {
      message.value = err.message
    }
  }

  async function savePost() {
    if (!title.value.trim() || !content.value.trim()) {
      message.value = t('editor.emptyError')
      return
    }

    loading.value = true
    message.value = ''

    try {
      if (currentId.value) {
        await postApi.update(currentId.value, {
          title: title.value,
          type: type.value,
          content: content.value
        })
        message.value =  t('editor.updateSuccess')
      } else {
        const res = await postApi.create({
          title: title.value,
          type: type.value,
          content: content.value
        })
        currentId.value = res.id
        message.value = t('editor.createSuccess')
      }
      await loadPosts()
    } catch (err) {
      message.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function deletePost() {
    if (!currentId.value) return
    if (!confirm(t('editor.confirmDelete'))) return

    try {
      await postApi.remove(currentId.value)
      message.value = t('editor.deleteSuccess')
      newPost()
      await loadPosts()
    } catch (err) {
      message.value = err.message
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/')
  }

  async function generateCode() {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/auth/invite-code', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (data.code) {
    newCode.value = data.code
  } else {
    newCode.value = data.message || '生成失败'
  }
}

  onMounted(loadPosts)
</script>

<template>
  <div class="editor-view">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>{{ t('editor.myBlog') }}</h3>
        <button class="new-btn" @click="newPost">{{ t('editor.newPost') }}</button>
      </div>

      <ul class="post-list">
        <li
          v-for="post in posts"
          :key="post.id"
          :class="{ active: post.id === currentId }"
          @click="selectPost(post.id)"
        >
          <span class="post-title">{{ post.title }}</span>
          <span class="post-type">{{ post.type }}</span>
        </li>
      </ul>

      <!-- 生成邀请码 -->
      <button v-if="isAdmin" class="new-btn" @click="generateCode" style="margin-top: 12px; width: 100%;">
        生成邀请码
      </button>
      <p v-if="newCode" style="margin-top: 8px; font-size: 13px; word-break: break-all;">
        {{ newCode }}
      </p>
      <button class="logout-btn" @click="logout">{{ t('editor.logout') }}</button>
    </aside>

    <section class="editor-area">
      <div class="editor-header">
        <input
          v-model="title"
          type="text"
          class="title-input"
          :placeholder="t('editor.titlePlaceholder')"
        />
        <select v-model="type" class="type-select">
          <option :value="'作品'">{{ t('editor.categoryWorks') }}</option>
          <option :value="'博客'">{{ t('editor.categoryBlog') }}</option>
          <option :value="'说明'">{{ t('editor.categoryInfo') }}</option>
          <option :value="'历史'">{{ t('editor.categoryHistory') }}</option>
          <option :value="'日志'">{{ t('editor.categoryLog') }}</option>
        </select>
      </div>

      <textarea
        v-model="content"
        class="content-input"
        :placeholder="t('editor.contentPlaceholder')"
      ></textarea>

      <div class="editor-footer">
        <span v-if="message" class="message">{{ message }}</span>
        <div class="btn-group">
          <button v-if="currentId" class="btn btn-danger" @click="deletePost">
            {{ t('editor.delete') }}
          </button>
          <button class="btn btn-primary" :disabled="loading" @click="savePost">
            {{ loading ? t('editor.saving') : t('editor.save') }}
          </button>
        </div>
      </div>
    </section>

    <section class="preview-area">
      <h3 class="preview-title">{{ t('editor.preview') }}</h3>
      <div class="preview-content" v-html="previewHtml"></div>
    </section>
  </div>
</template>

<style scoped>
.editor-view {
  display: grid;
  grid-template-columns: 220px 1fr 1fr;
  gap: 16px;
  height: calc(100vh - 180px);
  padding: 20px;
}

/* 左侧列表 */
.sidebar {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sidebar-header h3 {
  font-size: 16px;
  color: var(--title-color);
}

.new-btn {
  background: #40a647;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 13px;
  cursor: pointer;
}

.post-list {
  flex: 1;
  list-style: none;
  overflow-y: auto;
}

.post-list li {
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 6px;
  transition: background 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.post-list li:hover {
  background: var(--block-bg);
}

.post-list li.active {
  background: var(--block-bg);
  border-left: 3px solid #40a647;
}

.post-title {
  font-size: 14px;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-type {
  font-size: 11px;
  color: var(--subtitle-color);
  flex-shrink: 0;
}

.logout-btn {
  margin-top: 12px;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-color);
  cursor: pointer;
  font-size: 13px;
}

/* 编辑器 */
.editor-area {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.title-input {
  flex: 1;
  padding: 10px 14px;
  font-size: 16px;
  font-weight: 600;
  background: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: 12px;
  outline: none;
  color: var(--search-text);
}

.type-select {
  padding: 10px 14px;
  background: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: 12px;
  color: var(--search-text);
  outline: none;
  cursor: pointer;
}

.content-input {
  flex: 1;
  padding: 14px;
  font-size: 14px;
  line-height: 1.7;
  background: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: 12px;
  outline: none;
  color: var(--search-text);
  resize: none;
  font-family: 'Consolas', 'Monaco', monospace;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.message {
  font-size: 13px;
  color: var(--subtitle-color);
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #40a647, #2d6e2c);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -4px rgba(64, 166, 71, 0.5);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #e57373;
  color: #fff;
}

.btn-danger:hover {
  background: #d32f2f;
}

/* 预览 */
.preview-area {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 16px;
  overflow-y: auto;
}

.preview-title {
  font-size: 14px;
  color: var(--subtitle-color);
  margin-bottom: 12px;
}

.preview-content {
  color: var(--text-color);
  line-height: 1.8;
  word-break: break-word;
}

.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3) {
  color: var(--title-color);
  margin: 16px 0 8px;
}

.preview-content :deep(p) {
  margin-bottom: 12px;
}

.preview-content :deep(code) {
  background: var(--block-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.preview-content :deep(pre) {
  background: var(--block-bg);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .editor-view {
    grid-template-columns: 1fr;
    height: auto;
    padding: 10px;
    gap: 12px;
  }

  .sidebar {
    max-height: 220px;
  }

  .editor-area,
  .preview-area {
    min-height: 400px;
  }

  .editor-header {
    flex-direction: column;
    gap: 8px;
  }

  .title-input,
  .type-select {
    width: 100%;
  }

  .btn-group {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
  }
}
</style>