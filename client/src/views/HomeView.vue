<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 卡片动画触发
onMounted(() => {
  setTimeout(() => {
    document.querySelectorAll('.card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('card-visible')
      }, index * 200)
    })
  }, 300)
})
</script>

<template>
  <div class="home-view">
    <div class="card card-animate">
      <div class="profile-area">
        <img src="/Photo/ProfilePicture/Back view.png" alt="Work" class="profile-photo1">
      </div>
      <div class="info-area">
        <div class="title-block">
          <p class="aboutme">{{ t('home.skills') }}</p>
          <h1 id="shi">{{ t('home.skillTitle1') }}</h1>
          <h1 id="xu">{{ t('home.skillTitle2') }}</h1>
          <p class="subtitle">{{ t('home.skillSubtitle') }}</p>
        </div>
        <div class="write-block">
          <div class="dandian">
            <p id="yan" v-html="t('home.skillIntro')"></p>
            <p v-html="t('home.skillPoint1')"></p>
            <p v-html="t('home.skillPoint2')"></p>
            <p v-html="t('home.skillPoint3')"></p>
            <p v-html="t('home.skillPoint4')"></p>
            <p v-html="t('home.skillPoint5')"></p>
          </div>
        </div>
        <div class="school-bar">
          <img src="/Photo/school.png" alt="School" class="school-photo">
        </div>
      </div>
    </div>

    <div class="card card-animate">
      <div class="profile-area">
        <img src="/Photo/ProfilePicture/Work ID.png" alt="Profile" class="profile-photo2">
      </div>
      <div class="info-area">
        <div class="title-block">
          <p class="aboutme">{{ t('home.about') }}</p>
          <h1 id="shi">{{ t('home.aboutTitle1') }}</h1>
          <h1 id="xu">{{ t('home.aboutTitle2') }}</h1>
          <p class="subtitle">{{ t('home.aboutSubtitle') }}</p>
        </div>
        <div class="write-block">
          <p id="yan" v-html="t('home.aboutIntro')"></p>
          <div class="dandian">
            <p v-html="t('home.aboutPoint1')"></p>
            <p v-html="t('home.aboutPoint2')"></p>
            <p v-html="t('home.aboutPoint3')"></p>
            <p v-html="t('home.aboutPoint4')"></p>
            <p v-html="t('home.aboutPoint5')"></p>
          </div>
        </div>
        <div class="school-bar">
          <img src="/Photo/school.png" alt="School" class="school-photo">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin: 120px auto;
  width: 75%;
  background: var(--card-bg);
  border-radius: 28px;
  display: flex;
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.profile-area {
  background: var(--block-bg);
  min-height: 400px;
}

.profile-photo1 {
  margin: 100px 100px 0 100px;
  width: 264px;
  height: 264px;
  border-radius: 20px;
  opacity: 0.9;
  box-shadow: 0 10px 10px #959595de;
}

.profile-photo2 {
  margin: 100px 100px 0 100px;
  width: 280px;
  height: 400px;
  border-radius: 20px;
  opacity: 0.9;
  box-shadow: 0 10px 10px #959595de;
}

.info-area {
  flex: 1.8;
  height: 700px;
  background: var(--block-bg);
  padding-right: 24px;
}

.aboutme {
  color: var(--subtitle-color);
  font-size: 14px;
  margin-top: 50px;
  margin-bottom: 20px;
}

#shi {
  font-size: 31px;
  font-weight: bold;
  color: var(--title-color);
}

#xu {
  font-size: 28px;
  font-weight: 500;
}

#yan {
  margin-top: 40px;
  margin-bottom: 40px;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-green);
}

.highlights {
  color: var(--text-highlight);
  font-size: 15px;
  font-weight: bold;
}

.title-block h1 {
  color: var(--title-color);
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 6px;
}

.subtitle {
  color: var(--subtitle-color);
  font-size: 14px;
}

.write-block {
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 0.1px solid #8a8a8a;
}

.write-block p {
  width: 36rem;
  color: var(--text-green);
  font-size: 15px;
  line-height: 2;
}

.dandian {
  margin-bottom: 50px;
}

.school-photo {
  display: flex;
  margin-left: 20px;
  width: 18rem;
  height: 2.2rem;
}

@media (max-width: 650px) {
  .card {
    flex-direction: column;
  }
  .avatar-area {
    min-height: 200px;
  }
  .info-area {
    padding: 24px;
  }
}

/* ========== 卡片动画 ========== */
.card-animate {
  opacity: 0;
  transform: translateY(35px) scale(0.98);
  transition: opacity 0.55s cubic-bezier(0.25, 0.9, 0.4, 1.1),
              transform 0.55s cubic-bezier(0.25, 0.9, 0.4, 1.1);
}

.card-animate.card-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: bounceUp 0.65s cubic-bezier(0.2, 0.85, 0.35, 1.05) forwards;
}

@keyframes bounceUp {
  0% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-8px) scale(1.02);
  }
  70% {
    transform: translateY(3px) scale(0.99);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .card {
    flex-direction: column;
    width: 95%;
    margin: 40px auto;
  }

  .profile-area {
    min-height: auto;
  }

  .profile-photo1,
  .profile-photo2 {
    width: 60%;
    height: auto;
    margin: 30px auto 0;
    display: block;
  }

  .info-area {
    height: auto;
    padding: 20px;
  }

  .aboutme {
    margin-top: 20px;
  }

  #shi,
  #xu {
    font-size: 22px;
  }

  .write-block p {
    width: 100%;
    font-size: 14px;
    line-height: 1.8;
  }

  .school-photo {
    width: 80%;
    height: auto;
    margin: 20px auto;
  }

  .dandian {
    margin-bottom: 20px;
  }
}
</style>