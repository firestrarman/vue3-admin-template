<template lang="pug">
div(class="login-page")
  div(class="login-toolbar")
    AppLangSelect(size="text-18px")

  div(class="login-panel")
    div(class="login-panel__brand") {{ defaults.title }}
    h1(class="login-panel__title") {{ t("login.welcome") }}
    p(class="login-panel__desc") {{ t("login.subtitle") }}
    el-form(
      ref="loginFormRef"
      class="login-form"
      :model="loginFormData"
      :rules="loginRules"
      size="large"
      :validate-on-rule-change="false"
    )
      el-form-item(prop="username")
        el-input(
          v-model.trim="loginFormData.username"
          :placeholder="t('login.username')"
          :prefix-icon="UserIcon"
        )

      el-tooltip(:visible="isCapsLock" :content="t('login.capsLock')" placement="right")
        el-form-item(prop="password")
          el-input(
            v-model.trim="loginFormData.password"
            :placeholder="t('login.password')"
            type="password"
            show-password
            :prefix-icon="LockIcon"
            @keyup="checkCapsLock"
            @keyup.enter="handleLoginSubmit"
          )

      el-form-item(prop="captchaCode")
        div(class="captcha-row")
          el-input(
            v-model.trim="loginFormData.captchaCode"
            :placeholder="t('login.captchaCode')"
            class="captcha-row__input"
            :prefix-icon="KeyIcon"
            @keyup.enter="handleLoginSubmit"
          )
          div(class="captcha-img" @click="getCaptcha")
            el-icon(v-if="codeLoading" class="is-loading" :size="16")
              Loading
            img(v-else-if="captchaBase64" :src="captchaBase64" alt="")
            el-icon(v-else :size="16")
              Refresh

      div(class="login-options")
        el-checkbox(v-model="loginFormData.rememberMe") {{ t("login.rememberMe") }}

      el-button(
        :loading="loading"
        type="primary"
        size="large"
        class="login-btn"
        @click="handleLoginSubmit"
      ) {{ t("login.login") }}
</template>

<script setup lang="ts">
defineOptions({ name: "LoginPage", inheritAttrs: false });

import { Key, Lock, Loading, Refresh, User } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import AuthAPI from "@/api/auth";
import type { LoginRequest } from "@/api/auth";
import router from "@/router";
import { useUserStore } from "@/stores";
import { AuthStorage } from "@/utils/auth";
import { defaults } from "@/settings";

const { t } = useI18n();
const userStore = useUserStore();
const route = useRoute();

const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const isCapsLock = ref(false);
const captchaBase64 = ref<string>();
const codeLoading = ref(false);

const UserIcon = markRaw(User);
const LockIcon = markRaw(Lock);
const KeyIcon = markRaw(Key);

const loginFormData = ref<LoginRequest>({
  username: "admin",
  password: "123456",
  captchaId: "",
  captchaCode: "",
  rememberMe: AuthStorage.getRememberMe(),
});

const loginRules = computed(() => ({
  username: [{ required: true, trigger: "blur", message: t("login.message.username.required") }],
  password: [
    { required: true, trigger: "blur", message: t("login.message.password.required") },
    { min: 6, message: t("login.message.password.min"), trigger: "blur" },
  ],
  captchaCode: [
    { required: true, trigger: "blur", message: t("login.message.captchaCode.required") },
  ],
}));

function getCaptcha() {
  codeLoading.value = true;
  AuthAPI.getCaptcha()
    .then((d) => {
      loginFormData.value.captchaId = d.captchaId;
      captchaBase64.value = d.captchaBase64;
    })
    .finally(() => (codeLoading.value = false));
}

async function handleLoginSubmit() {
  const valid = await loginFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  loading.value = true;
  try {
    await userStore.login(loginFormData.value).then(
      async () => {
        const redirectPath = (route.query.redirect as string) || "/";
        await router.push(decodeURIComponent(redirectPath));
      },
      () => getCaptcha()
    );
  } finally {
    loading.value = false;
  }
}

function checkCapsLock(event: KeyboardEvent) {
  isCapsLock.value = event.getModifierState("CapsLock");
}

onMounted(() => getCaptcha());
</script>

<style lang="scss" scoped>
$panel: #152033;
$input-h: 46px;

.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  min-height: 100vh;
  padding: 32px 20px;
  overflow: auto;
  background:
    radial-gradient(900px 480px at 8% 0%, rgb(56 189 248 / 16%), transparent 55%),
    radial-gradient(760px 420px at 100% 100%, rgb(99 102 241 / 22%), transparent 50%), #0b1220;
}

.login-toolbar {
  position: fixed;
  top: 24px;
  right: 28px;
  z-index: 10;
  color: rgb(226 232 240 / 82%);

  :deep(*) {
    cursor: pointer;
  }
}

.login-panel {
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  padding: 40px 36px 36px;
  background: rgb(21 32 51 / 88%);
  border: 1px solid rgb(148 163 184 / 16%);
  border-radius: 20px;
  box-shadow: 0 28px 80px rgb(0 0 0 / 38%);
  backdrop-filter: blur(18px);
}

.login-panel__brand {
  margin-bottom: 18px;
  font-size: 13px;
  font-weight: 600;
  color: #7dd3fc;
  letter-spacing: 0.08em;
}

.login-panel__title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: #f1f5f9;
}

.login-panel__desc {
  margin: 0 0 28px;
  font-size: 14px;
  line-height: 1.6;
  color: #94a3b8;
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-input__wrapper) {
    height: $input-h;
    background: rgb(11 18 32 / 72%);
    box-shadow: 0 0 0 1px rgb(148 163 184 / 18%) inset;
  }

  :deep(.el-input__inner) {
    color: #e2e8f0;
  }

  :deep(.el-input__prefix-inner),
  :deep(.el-input__suffix-inner) {
    color: #64748b;
  }
}

.captcha-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.captcha-row__input {
  flex: 1;
  min-width: 0;
}

.captcha-img {
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: $input-h;
  overflow: hidden;
  cursor: pointer;
  background: rgb(11 18 32 / 72%);
  border: 1px solid rgb(148 163 184 / 18%);
  border-radius: var(--el-border-radius-base);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.login-options {
  display: flex;
  align-items: center;
  margin: 2px 0 20px;
  font-size: 14px;

  :deep(.el-checkbox__label) {
    color: #94a3b8;
  }
}

.login-btn {
  width: 100%;
  height: 46px;
  font-size: 15px;
  font-weight: 600;
  background: #38bdf8;
  border-color: #38bdf8;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgb(56 189 248 / 22%);

  &:hover,
  &:focus {
    background: #7dd3fc;
    border-color: #7dd3fc;
  }
}

@media (max-width: 640px) {
  .login-toolbar {
    top: 16px;
    right: 16px;
  }

  .login-panel {
    padding: 32px 22px;
  }
}
</style>
