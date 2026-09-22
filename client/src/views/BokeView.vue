<script setup>
  import { marked } from 'marked'
  import { onMounted, ref } from 'vue'
  import { postApi } from '../services/api'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const menuOpen = ref(false)
  const categories = ['作品', '博客', '说明', '历史', '日志']

  // 存每个分类的文章
  const postsByType = ref({
    作品: [],
    博客: [],
    说明: [],
    历史: [],
    日志: []
  })

  // 存每个分类渲染后的 HTML
  const htmlByType = ref({
    作品: {},
    博客: {},
    说明: {},
    历史: {},
    日志: {}
  })

  // 分类名映射：数据库 type（中文） → i18n key
  const typeKeyMap = {
    '作品': 'works',
    '博客': 'blog',
    '说明': 'info',
    '历史': 'history',
    '日志': 'log'
  }

  // 获取所有文章的元数据和正文
  async function loadAllPosts() {
    try {
      const all = await postApi.list()
      for (const post of all) {
        if (!postsByType.value[post.type]) continue
        postsByType.value[post.type].push(post)
      }

      for (const type of categories) {
        for (const post of postsByType.value[type]) {
          const detail = await postApi.get(post.id)
          htmlByType.value[type][post.id] = marked.parse(detail.content || '')
        }
      }
    } catch (err) {
      console.error('加载文章失败', err)
    }
  }

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  function handleSelect(id) {
    menuOpen.value = false
    scrollTo(id)
  }

  onMounted(() => {
    loadAllPosts()
    setTimeout(() => {
      const blocks = document.querySelectorAll('.zuopingblock, .bokeblock, .stepsblock, .historyblock, .logblock')
      blocks.forEach(block => block.classList.add('block-visible'))
    }, 500)
  })

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 130
    window.scrollTo({ top, behavior: 'smooth' })
  }
</script>

<template>
  <div class="boke-view">
    <div class="bigneirongblock">
      <div class="mulublock">
        <h3>{{ t('boke.catalog') }}</h3>
        <br>
        <ul>
          <li><a href="javascript:void(0)" @click="scrollTo('personal-container')">{{ t('boke.works') }}</a></li>
          <li><a href="javascript:void(0)" @click="scrollTo('boke-container')">{{ t('boke.blog') }}</a></li>
          <li><a href="javascript:void(0)" @click="scrollTo('steps-container')">{{ t('boke.info') }}</a></li>
          <li><a href="javascript:void(0)" @click="scrollTo('history-container')">{{ t('boke.history') }}</a></li>
          <li><a href="javascript:void(0)" @click="scrollTo('log-container')">{{ t('boke.log') }}</a></li>
        </ul>
      </div>

      <div class="neirongblock2">
        <!-- 作品 -->
        <div class="zuopingblock" id="personal-container">
          <div v-for="post in postsByType.作品" :key="post.id" class="personal-item">
            <h1 :id="`section${post.id}`">{{ post.title }}：</h1>
            <h3>{{ post.updated_at }}</h3>
            <div class="md-body" v-html="htmlByType.作品[post.id]"></div>
          </div>
          <p v-if="postsByType.作品.length === 0" class="empty-tip">{{ t('boke.emptyWorks') }}</p>
        </div>

        <!-- 博客 -->
        <div class="bokeblock" id="boke-container">
          <div v-for="post in postsByType.博客" :key="post.id" class="boke-item">
            <h1 :id="`section${post.id}`">{{ post.title }}：</h1>
            <h3>{{ post.updated_at }}</h3>
            <div class="md-body" v-html="htmlByType.博客[post.id]"></div>
          </div>
          <p v-if="postsByType.博客.length === 0" class="empty-tip">{{ t('boke.emptyBlog') }}</p>
        </div>

        <!-- 说明 -->
        <div class="stepsblock" id="steps-container">
          <div v-for="post in postsByType.说明" :key="post.id" class="steps-item">
            <h1 :id="`section${post.id}`">{{ post.title }}：</h1>
            <h3>{{ post.updated_at }}</h3>
            <div class="md-body" v-html="htmlByType.说明[post.id]"></div>
          </div>
          <p v-if="postsByType.说明.length === 0" class="empty-tip">{{ t('boke.emptyInfo') }}</p>
        </div>

        <!-- 历史 -->
        <div class="historyblock" id="history-container">
          <div v-for="post in postsByType.历史" :key="post.id" class="history-item">
            <h1 :id="`section${post.id}`">{{ post.title }}：</h1>
            <h3>{{ post.updated_at }}</h3>
            <div class="md-body" v-html="htmlByType.历史[post.id]"></div>
          </div>
          <p v-if="postsByType.历史.length === 0" class="empty-tip">{{ t('boke.emptyHistory') }}</p>
        </div>

        <!-- 日志 -->
        <div class="logblock" id="log-container">
          <div v-for="post in postsByType.日志" :key="post.id" class="log-item">
            <h1 :id="`section${post.id}`">{{ post.title }}：</h1>
            <h3>{{ post.updated_at }}</h3>
            <div class="md-body" v-html="htmlByType.日志[post.id]"></div>
          </div>
          <p v-if="postsByType.日志.length === 0" class="empty-tip">{{ t('boke.emptyLog') }}</p>
        </div>
      </div>
    </div>

    <!-- 手机端悬浮目录按钮 -->
    <button
      class="mobile-menu-btn"
      :class="{ hidden: menuOpen }"
      @click="toggleMenu"
    >☰</button>

    <!-- 手机端底部弹出菜单 -->
    <div class="mobile-menu-overlay" :class="{ active: menuOpen }" @click.self="toggleMenu">
      <div class="mobile-menu-panel">
        <h3>{{ t('boke.catalog') }}</h3>
        <ul>
          <li @click="handleSelect('personal-container')">{{ t('boke.works') }}</li>
          <li @click="handleSelect('boke-container')">{{ t('boke.blog') }}</li>
          <li @click="handleSelect('steps-container')">{{ t('boke.info') }}</li>
          <li @click="handleSelect('history-container')">{{ t('boke.history') }}</li>
          <li @click="handleSelect('log-container')">{{ t('boke.log') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neirongblock2 {
  flex: 1;
}

.zuopingblock,
.bokeblock,
.stepsblock,
.historyblock,
.logblock {
  padding-top: 20px;
  padding-left: 20px;
  margin-left: 16%;
  margin-top: 40px;
  margin-bottom: 30px;
  width: 65%;
  height: 620px;
  border-radius: 20px;
  overflow: auto;
  opacity: 0;
  transform: translateY(35px) scale(0.98);
  box-shadow: var(--block-shadow);
  background: var(--block-bg);
  color: var(--text-color);
  transition: background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
}

.zuopingblock {
  height: 680px;
  margin-top: 45px;
}

.personal-item,
.boke-item,
.steps-item,
.history-item,
.log-item {
  margin-bottom: 50px;
}

.zuopingblock.block-visible,
.bokeblock.block-visible,
.stepsblock.block-visible,
.historyblock.block-visible,
.logblock.block-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: bounceUp 0.65s cubic-bezier(0.2, 0.85, 0.35, 1.05) forwards;
}

@keyframes bounceUp {
  0% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-8px) scale(1.02); }
  70% { transform: translateY(3px) scale(0.99); }
  100% { transform: translateY(0) scale(1); }
}

.zuopingblock:hover,
.bokeblock:hover,
.stepsblock:hover,
.historyblock:hover,
.logblock:hover {
  box-shadow: 0 15px 15px 5px rgba(0, 0, 0, 0.3);
}

.mulublock {
  position: sticky;
  margin-top: -20px;
  top: 0;
  align-self: flex-start;
  width: 120px;
  height: 100vh;
  padding-top: 15px;
  background: var(--mulublock-bg);
  border: 1px solid var(--mulublock-border);
  text-align: center;
  overflow: auto;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.mulublock a,
.mulublock a:visited {
  text-decoration: none;
  color: var(--mulublock-link-color);
  font-size: 18px;
  transition: color 0.3s ease;
}

.mulublock li {
  display: flex;
  align-items: flex-start;
  line-height: 2;
  margin-left: 6px;
}

.mulublock li::before {
  content: "•";
  width: 20px;
}

.bigneirongblock {
  display: flex;
  align-items: flex-start;
}

/* ===== 手机端悬浮目录按钮 ===== */
.mobile-menu-btn {
  display: none;
}

.mobile-menu-overlay {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 20px;
    bottom: 80px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    background: #40a647;
    color: #fff;
    font-size: 22px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    z-index: 9999;
    cursor: pointer;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .mobile-menu-btn.hidden {
    transform: scale(0) translateY(20px);
    opacity: 0;
    pointer-events: none;
  }

  .mobile-menu-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
    z-index: 9998;
  }

  .mobile-menu-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-menu-panel {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--card-bg);
    color: var(--text-color);
    border-radius: 20px 20px 0 0;
    padding: 20px 24px 30px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .mobile-menu-overlay.active .mobile-menu-panel {
    transform: translateY(0);
  }

  .mobile-menu-panel h3 {
    margin-bottom: 14px;
    font-size: 16px;
    color: var(--title-color);
  }

  .mobile-menu-panel ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-menu-panel li {
    padding: 14px 0;
    font-size: 16px;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    color: var(--text-color);
  }

  .mobile-menu-panel li:last-child {
    border-bottom: none;
  }
}

.empty-tip {
  text-align: center;
  color: var(--text-color);
  opacity: 0.5;
  padding: 40px 0;
  font-size: 14px;
}

/* ===== Markdown 内容容器 ===== */
.md-body {
  padding: 16px 20px 16px 20px;
  border-radius: 12px;
  line-height: 1.5;
  word-break: break-word;
  margin-top: 8px;
}

.md-body :deep(p) {
  margin-bottom: 12px;
}

.md-body :deep(h1),
.md-body :deep(h2),
.md-body :deep(h3),
.md-body :deep(h4) {
  margin: 16px 0 8px;
  color: var(--title-color);
}

.md-body :deep(ul),
.md-body :deep(ol) {
  padding-left: 24px;
  margin-bottom: 12px;
}

.md-body :deep(pre) {
  background: var(--block-bg);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
}

.md-body :deep(code) {
  background: var(--block-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.md-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 12px 0;
}

.md-body :deep(blockquote) {
  border-left: 4px solid var(--subtitle-color);
  padding-left: 12px;
  margin: 12px 0;
  color: var(--text-color);
  opacity: 0.85;
}

@media (max-width: 768px) {
  .bigneirongblock {
    flex-direction: column;
  }

  .mulublock {
    display: none;
  }

  .zuopingblock,
  .bokeblock,
  .stepsblock,
  .historyblock,
  .logblock {
    width: 92%;
    margin: 20px auto;
    height: auto;
    max-height: 70vh;
    padding: 16px;
  }
}
</style>