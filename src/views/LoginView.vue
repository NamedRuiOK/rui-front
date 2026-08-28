<template>
  <main class="login-page">
    <section class="login-shell" aria-labelledby="login-title">
      <div class="brand-mark" aria-hidden="true">R</div>

      <div class="login-heading">
        <p class="eyebrow">RUI PLATFORM</p>
        <h1 id="login-title">欢迎回来</h1>
        <p>登录你的账户，继续探索工作台</p>
      </div>

      <LoginForm @login-success="$emit('login-success', $event)" />

      <p class="login-footer">© 2026 RUI PLATFORM</p>
    </section>
  </main>
</template>

<script>
import LoginForm from '@/components/login/LoginForm.vue'

export default {
  name: 'LoginView',
  emits: ['login-success'],
  components: {
    LoginForm
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px 20px;
  overflow: hidden;
  isolation: isolate;
  background: #182635;
}

.login-page::before {
  position: absolute;
  z-index: -2;
  inset: -12px;
  background-image: url("../../img/all/全局背景图片.jpg");
  background-position: center;
  background-size: cover;
  content: "";
  filter: blur(20px);
  opacity: 0.8;
  transform: scale(1.03);
}

.login-page::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: rgba(20, 38, 56, 0.16);
  content: "";
}

.login-shell {
  width: min(100%, 432px);
  padding: 42px 44px 28px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 24px 80px rgba(16, 33, 50, 0.25);
  text-align: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.brand-mark {
  display: grid;
  width: 52px;
  height: 52px;
  margin: 0 auto 22px;
  place-items: center;
  border-radius: 16px;
  background: #254764;
  box-shadow: 0 10px 24px rgba(37, 71, 100, 0.24);
  color: #ffffff;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: 0;
}

.login-heading .eyebrow {
  margin: 0 0 11px;
  color: #6f8aa0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.4px;
}

.login-heading h1 {
  margin: 0;
  color: #1e3346;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.25;
}

.login-heading > p:last-child {
  margin: 10px 0 32px;
  color: #748390;
  font-size: 14px;
  line-height: 1.6;
}

.login-footer {
  margin: 34px 0 0;
  color: #9aa7b0;
  font-size: 11px;
  letter-spacing: 1.1px;
}

@media (max-width: 480px) {
  .login-page {
    padding: 20px 14px;
  }

  .login-shell {
    padding: 34px 24px 24px;
    border-radius: 15px;
  }

  .login-heading h1 {
    font-size: 27px;
  }
}
</style>
