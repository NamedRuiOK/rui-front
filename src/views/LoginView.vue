<template>
  <main class="login-page">
    <section class="login-shell" aria-labelledby="login-title">
      <div class="brand-mark" aria-hidden="true">R</div>

      <div class="login-heading">
        <p class="eyebrow">RUI PLATFORM</p>
        <h1 id="login-title">欢迎回来</h1>
        <p>登录你的账户，继续探索工作台</p>
      </div>

      <LoginForm
        :registered-username="registeredUsername"
        @login-success="$emit('login-success', $event)"
      />
      <p v-if="registrationMessage" class="register-success" role="status">
        {{ registrationMessage }}
      </p>

      <button class="register-button" type="button" @click="openRegister">
        <span>还没有账户？</span>
        注册账号
      </button>

      <p class="login-footer">© 2026 RUI PLATFORM</p>
    </section>

    <div
      v-if="isRegisterOpen"
      class="register-backdrop"
      @click.self="closeRegister"
      @keydown.esc="closeRegister"
    >
      <section class="register-dialog" role="dialog" aria-modal="true" aria-labelledby="register-title">
        <header class="register-dialog-header">
          <div>
            <p class="eyebrow">RUI PLATFORM</p>
            <h2 id="register-title">创建账户</h2>
          </div>
          <button
            class="dialog-close"
            type="button"
            aria-label="关闭注册窗口"
            title="关闭"
            :disabled="isRegistering"
            @click="closeRegister"
          >
            &times;
          </button>
        </header>

        <RegisterForm
          @register-start="isRegistering = true"
          @register-end="isRegistering = false"
          @register-success="handleRegisterSuccess"
        />
      </section>
    </div>
  </main>
</template>

<script>
import LoginForm from '@/components/login/LoginForm.vue'
import RegisterForm from '@/components/login/RegisterForm.vue'

export default {
  name: 'LoginView',
  emits: ['login-success'],
  components: {
    LoginForm,
    RegisterForm
  },
  data () {
    return {
      isRegisterOpen: false,
      isRegistering: false,
      registeredUsername: '',
      registrationMessage: ''
    }
  },
  methods: {
    openRegister () {
      this.isRegisterOpen = true
      this.isRegistering = false
      this.registrationMessage = ''
    },
    closeRegister () {
      if (!this.isRegistering) {
        this.isRegisterOpen = false
      }
    },
    handleRegisterSuccess (username) {
      this.isRegistering = false
      this.isRegisterOpen = false
      this.registeredUsername = username
      this.registrationMessage = '注册成功，请使用新账户登录'
    }
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

.register-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 18px;
  padding: 4px;
  background: transparent;
  color: #31556e;
  cursor: pointer;
  font-size: 12px;
}

.register-button span {
  color: #748390;
}

.register-success {
  margin: 14px 0 -4px;
  color: #2f8960;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

.register-button:hover {
  color: #1d3b55;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.register-backdrop {
  position: fixed;
  z-index: 5;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(16, 33, 50, 0.54);
}

.register-dialog {
  width: min(100%, 620px);
  max-height: calc(100vh - 40px);
  overflow: auto;
  padding: 27px 30px 30px;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 24px 80px rgba(16, 33, 50, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.register-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 23px;
}

.register-dialog-header .eyebrow {
  margin: 0 0 7px;
  color: #6f8aa0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

.register-dialog-header h2 {
  margin: 0;
  color: #1e3346;
  font-size: 24px;
  line-height: 1.3;
}

.dialog-close {
  flex: 0 0 auto;
  padding: 2px 5px;
  background: transparent;
  color: #748390;
  cursor: pointer;
  font-size: 26px;
  line-height: 1;
}

.dialog-close:hover {
  color: #1e3346;
}

.dialog-close:disabled {
  cursor: wait;
  opacity: 0.55;
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

  .register-dialog {
    padding: 24px 20px;
  }
}
</style>
