<script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { marked } from 'marked'
  import { search } from '../services/SearchService'

  const { t } = useI18n()

  const keyword = ref('')
  const hasSearched = ref(false)
  const hasSearchedCurrent = ref(false)
  const results = ref([])
  const loading = ref(false)
  const expandedId = ref(null)

  const searchContainer = ref(null)

  watch(keyword, () => {
    results.value = []
    expandedId.value = null
    hasSearchedCurrent.value = false
  })

  async function handleSearch() {
    const kw = keyword.value.trim()
    hasSearched.value = true
    expandedId.value = null

    if (!kw) {
      results.value = []
      hasSearchedCurrent.value = false
      return
    }

    loading.value = true
    try {
      results.value = await search(kw)
      hasSearchedCurrent.value = true
    } catch (e) {
      console.error('搜索失败', e)
      results.value = []
      hasSearchedCurrent.value = true
    } finally {
      loading.value = false
    }
  }

  function toggleExpand(id) {
    expandedId.value = expandedId.value === id ? null : id
  }

  function renderMd(md) {
    return marked.parse(md)
  }

  function reset() {
    if (!hasSearched.value) return
    keyword.value = ''
    results.value = []
    expandedId.value = null
    hasSearched.value = false
    hasSearchedCurrent.value = false
  }

  function handleClickOutside(e) {
    if (!searchContainer.value) return
    if (!searchContainer.value.contains(e.target)) {
      reset()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<template>
  <div class="search-view" :class="{ searched: hasSearched }">
    <div class="search-container" ref="searchContainer">
      <div class="searchblock">
        <div class="searchhead">{{ t('search.head') }}</div>
        <div class="search-wrapper">
          <input
            v-model="keyword"
            type="text"
            class="search-input"
            :placeholder="t('search.placeholder')"
            aria-label="Global search"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="search-tip">
          {{ t('search.tip') }}<br />{{ t('search.tipShortcut') }}
        </div>
      </div>

      <div v-if="hasSearched" class="results-area">
        <div v-if="loading" class="loading">{{ t('search.searching') }}</div>

        <template v-else>
          <div v-if="!hasSearchedCurrent" class="no-result">
            {{ keyword.trim() === ''
              ? t('search.emptyPrompt')
              : t('search.enterToSearch', { kw: keyword }) }}
          </div>

          <div v-else-if="results.length === 0" class="no-result">
            {{ t('search.noResult', { kw: keyword }) }}
          </div>

          <div v-else class="results-list">
            <div
              v-for="item in results"
              :key="item.id"
              class="result-card"
              :class="{ expanded: expandedId === item.id }"
            >
              <div class="result-header" @click="toggleExpand(item.id)">
                <span class="result-type">{{ item.type }}</span>
                <span class="result-title">{{ item.title }}</span>
                <span class="result-time" v-if="item.time">{{ item.time }}</span>
                <span class="result-arrow">{{ expandedId === item.id ? '▲' : '▼' }}</span>
              </div>
              <div
                v-if="expandedId === item.id"
                class="result-body"
                v-html="renderMd(item.rawMd)"
              ></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60vh;
  width: 100%;
  transition: all 0.4s ease;
  margin-bottom: 210px;
}

/* 未搜索时：搜索框居中 */
.search-view:not(.searched) {
  justify-content: center;
}

/* 已搜索时：搜索框靠上 */
.search-view.searched {
  justify-content: flex-start;
  padding-top: 40px;
}

.search-container {
  width: 100%;
  max-width: 780px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.searchblock {
  width: 100%;
  text-align: center;
  transition: all 0.4s ease;
}

.searchhead {
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
  font-weight: 450;
  color: var(--search-head);
}

.search-wrapper {
  width: 100%;
  border-radius: 56px;
}

.search-input {
  width: 100%;
  padding: 1.25rem 2rem;
  font-size: 1.2rem;
  background-color: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: 60px;
  outline: none;
  color: var(--search-text);
  transition: all 0.3s ease;
  box-shadow: inset 0 5px 5px rgba(0, 0, 0, 0.03);
}

.search-input:focus {
  border-color: var(--search-border);
  box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.07);
}

.search-tip {
  margin-top: 1.2rem;
  font-size: 0.8rem;
  color: var(--search-tip);
}

/* ===== 搜索结果区 ===== */
.results-area {
  width: 100%;
  margin-top: 40px;
  padding-bottom: 80px;
}

.loading {
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
  padding: 40px 0;
}

.no-result {
  text-align: center;
  padding: 60px 0;
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.75;
  background: var(--block-bg);
  border-radius: 20px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-card {
  background: var(--block-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.result-card:hover {
  box-shadow: var(--block-shadow);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
}

.result-type {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.result-title {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: var(--title-color);
}

.result-time {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.6;
}

.result-arrow {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.6;
}

.result-body {
  padding: 16px 20px 20px;
  color: var(--text-color);
  line-height: 1.8;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .result-header {
    flex-wrap: wrap;
    gap: 6px;
  }
  .result-title {
    width: 100%;
    font-size: 0.95rem;
  }
  .result-time {
    font-size: 0.75rem;
  }
  .search-view {
    margin-bottom: 40px;
  }
  .search-input {
    font-size: 1rem;
    padding: 1rem 1.4rem;
  }
}
</style>