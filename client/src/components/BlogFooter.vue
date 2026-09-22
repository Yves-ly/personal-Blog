<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="footerblock">
    <p>欢迎访问！这是V2.2.1版本</p>
  </div>
</template>

<style scoped>
.footerblock {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  background-color: var(--footer-bg);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  border-top: 1px solid var(--footer-border);
  color: var(--text-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

@media (max-width: 768px) {
  .footerblock {
    height: auto;
    padding: 12px;
    font-size: 13px;
  }
}
</style>