<template>
  <form class="register-form" @submit.prevent="submitRegister">
    <div class="register-form-grid">
      <label class="field-group">
        <span>用户名 <em>*</em></span>
        <input
          v-model.trim="form.username"
          type="text"
          name="username"
          autocomplete="username"
          placeholder="请输入用户名"
          maxlength="50"
          :disabled="isSubmitting"
          required
        >
      </label>

      <label class="field-group">
        <span>密码 <em>*</em></span>
        <input
          v-model="form.password"
          type="password"
          name="password"
          autocomplete="new-password"
          placeholder="8-72个字符"
          minlength="8"
          maxlength="72"
          :disabled="isSubmitting"
          required
        >
      </label>

      <label class="field-group">
        <span>确认密码 <em>*</em></span>
        <input
          v-model="form.confirmPassword"
          type="password"
          name="confirmPassword"
          autocomplete="new-password"
          placeholder="请再次输入密码"
          :disabled="isSubmitting"
          required
        >
      </label>

      <label class="field-group">
        <span>手机号</span>
        <input
          v-model.trim="form.phoneNumber"
          type="tel"
          name="phoneNumber"
          autocomplete="tel"
          placeholder="选填"
          pattern="^1[0-9]{10}$"
          :disabled="isSubmitting"
        >
      </label>

      <label class="field-group">
        <span>邮箱</span>
        <input
          v-model.trim="form.email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="选填"
          maxlength="100"
          :disabled="isSubmitting"
        >
      </label>

      <label class="field-group">
        <span>头像地址</span>
        <input
          v-model.trim="form.avatarUrl"
          type="text"
          name="avatarUrl"
          placeholder="选填"
          maxlength="500"
          :disabled="isSubmitting"
        >
      </label>

      <label class="field-group field-group-full">
        <span>住址</span>
        <input
          v-model.trim="form.address"
          type="text"
          name="address"
          autocomplete="street-address"
          placeholder="选填"
          maxlength="255"
          :disabled="isSubmitting"
        >
      </label>
    </div>

    <p v-if="errorMessage" class="feedback feedback-error" role="alert">
      {{ errorMessage }}
    </p>

    <button class="register-submit-button" type="submit" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="button-loader" aria-hidden="true"></span>
      {{ isSubmitting ? '注册中...' : '注册' }}
    </button>
  </form>
</template>

<script>
import { register } from '@/api/auth'

export default {
  name: 'RegisterForm',
  emits: ['register-start', 'register-success', 'register-end'],
  data () {
    return {
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        email: '',
        avatarUrl: '',
        address: ''
      },
      isSubmitting: false,
      errorMessage: ''
    }
  },
  methods: {
    async submitRegister () {
      this.errorMessage = ''

      if (this.form.password !== this.form.confirmPassword) {
        this.errorMessage = '两次输入的密码不一致'
        return
      }

      if (this.form.phoneNumber && !/^1\d{10}$/.test(this.form.phoneNumber)) {
        this.errorMessage = '手机号码格式不正确'
        return
      }

      this.isSubmitting = true
      this.$emit('register-start')

      try {
        await register({
          username: this.form.username,
          password: this.form.password,
          phoneNumber: this.getOptionalValue(this.form.phoneNumber),
          email: this.getOptionalValue(this.form.email),
          avatarUrl: this.getOptionalValue(this.form.avatarUrl),
          address: this.getOptionalValue(this.form.address)
        })
        this.$emit('register-success', this.form.username)
      } catch (error) {
        this.errorMessage = error.message || '网络异常，请稍后重试'
      } finally {
        this.isSubmitting = false
        this.$emit('register-end')
      }
    },
    getOptionalValue (value) {
      const normalizedValue = value.trim()
      return normalizedValue || null
    }
  }
}
</script>

<style scoped>
.register-form {
  text-align: left;
}

.register-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 14px;
}

.field-group {
  display: grid;
  gap: 7px;
}

.field-group-full {
  grid-column: 1 / -1;
}

.field-group span {
  color: #344c60;
  font-size: 12px;
  font-weight: 600;
}

.field-group em {
  color: #b44f4f;
  font-style: normal;
}

.field-group input {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #d8e0e6;
  border-radius: 8px;
  outline: none;
  background: rgba(255, 255, 255, 0.78);
  color: #203547;
  font-size: 13px;
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

.feedback {
  margin: 14px 0 -2px;
  font-size: 12px;
  line-height: 1.5;
}

.feedback-error {
  color: #b44f4f;
}

.register-submit-button {
  display: flex;
  width: 100%;
  min-height: 45px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 22px;
  border-radius: 9px;
  background: #254764;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.register-submit-button:hover:not(:disabled) {
  background: #1d3b55;
  box-shadow: 0 10px 22px rgba(37, 71, 100, 0.24);
  transform: translateY(-1px);
}

.register-submit-button:disabled {
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 520px) {
  .register-form-grid {
    grid-template-columns: 1fr;
  }

  .field-group-full {
    grid-column: auto;
  }
}
</style>
