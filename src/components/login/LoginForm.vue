<template>
  <form class="login-form" @submit.prevent="submitLogin">
    <div class="field-group">
      <label for="username">用户名</label>
      <input
        ref="usernameInput"
        id="username"
        v-model.trim="form.username"
        type="text"
        name="username"
        autocomplete="username"
        placeholder="请输入用户名"
        :disabled="isSubmitting"
        required
      >
    </div>

    <div class="field-group">
      <label for="password">密码</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        name="password"
        autocomplete="current-password"
        placeholder="请输入密码"
        :disabled="isSubmitting"
        required
      >
    </div>

    <p v-if="errorMessage" class="feedback feedback-error" role="alert">
      {{ errorMessage }}
    </p>

    <button class="login-button" type="submit" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="button-loader" aria-hidden="true"></span>
      {{ isSubmitting ? '登录中...' : '登录' }}
    </button>
  </form>

</template>

<script>
import { login } from '@/api/auth'
import { saveAccessToken } from '@/utils/auth-storage'

export default {
  name: 'LoginForm',
  emits: ['login-success'],
  props: {
    registeredUsername: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      isSubmitting: false,
      errorMessage: '',
    }
  },
  watch: {
    registeredUsername (username) {
      if (username) {
        this.form.username = username
        this.form.password = ''
        this.errorMessage = ''
        this.$nextTick(() => this.$refs.usernameInput && this.$refs.usernameInput.focus())
      }
    }
  },
  methods: {
    async submitLogin () {
      this.errorMessage = ''
      this.isSubmitting = true

      try {
        const user = await login({
          username: this.form.username,
          password: this.form.password
        })

        saveAccessToken(user.accessToken)
        this.$emit('login-success', user)
      } catch (error) {
        this.errorMessage = error.message || '网络异常，请稍后重试'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  text-align: left;
}

.field-group {
  margin-bottom: 19px;
}

.field-group label {
  display: block;
  margin-bottom: 8px;
  color: #344c60;
  font-size: 13px;
  font-weight: 600;
}

.field-group input {
  width: 100%;
  height: 48px;
  padding: 0 15px;
  border: 1px solid #d8e0e6;
  border-radius: 9px;
  outline: none;
  background: rgba(255, 255, 255, 0.78);
  color: #203547;
  font-size: 14px;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.field-group input::placeholder {
  color: #a4afb8;
}

.field-group input:focus {
  border-color: #4d7896;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(77, 120, 150, 0.14);
}

.field-group input:disabled {
  cursor: wait;
  opacity: 0.65;
}

.login-button,
.secondary-button {
  width: 100%;
  min-height: 48px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 27px;
  background: #254764;
  color: #ffffff;
}

.login-button:hover:not(:disabled) {
  background: #1d3b55;
  box-shadow: 0 10px 22px rgba(37, 71, 100, 0.24);
  transform: translateY(-1px);
}

.login-button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.button-loader {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.feedback {
  margin: 4px 0 -6px;
  font-size: 13px;
  line-height: 1.5;
}

.feedback-error {
  color: #b44f4f;
}

.success-state {
  padding: 8px 0 7px;
}

.success-icon {
  display: grid;
  width: 50px;
  height: 50px;
  margin: 0 auto 17px;
  place-items: center;
  border-radius: 50%;
  background: #e5f3ec;
  color: #2f8960;
  font-size: 25px;
  font-weight: 700;
}

.success-state h2 {
  margin: 0;
  color: #1e3346;
  font-size: 23px;
  line-height: 1.3;
}

.success-state p {
  margin: 9px 0 25px;
  color: #748390;
  font-size: 13px;
}

.secondary-button {
  border: 1px solid #cad7df;
  background: transparent;
  color: #31556e;
}

.secondary-button:hover {
  border-color: #31556e;
  background: rgba(49, 85, 110, 0.06);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
