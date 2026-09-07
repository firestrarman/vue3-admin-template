<template lang="pug">
div(class="profile-page")
  section(class="profile-hero")
    div(class="profile-hero__body")
      div(class="profile-avatar")
        el-avatar(:src="displayAvatar" :size="72")
          el-icon
            UserFilled
        el-button(
          type="info"
          class="profile-avatar__action"
          circle
          :icon="Camera"
          size="small"
          title="更換頭像"
          @click="triggerFileUpload"
        )
        input(
          ref="fileInput"
          class="profile-avatar__input"
          type="file"
          accept="image/*"
          @change="handleFileChange"
        )
      div(class="profile-hero__info")
        div(class="profile-hero__title")
          h2(class="profile-hero__name") {{ displayName }}
          el-tag(type="primary" effect="light" round) {{ primaryRole }}
        p(class="profile-hero__desc") {{ userProfile.username || "-" }} / {{ userProfile.deptName || "未分配部門" }}
        div(class="profile-hero__meta")
          span(class="profile-hero__meta-item")
            el-icon
              Calendar
            | 加入
            | {{ formatValue(userProfile.createTime) }}
          span(class="profile-hero__meta-item")
            el-icon
              Location
            | 最近登入
            | {{ recentLoginRecords[0]?.time }}

    div(class="profile-hero__actions")
      el-button(:icon="Edit" @click="handleOpenDialog(DialogType.ACCOUNT)") 編輯資料
      el-button(type="primary" :icon="Lock" @click="handleOpenDialog(DialogType.PASSWORD)") 修改密碼

  div(class="profile-page__layout")
    aside(class="profile-page__side")
      section(class="profile-card")
        header(class="profile-card__header")
          h3(class="profile-card__title") 個人資料
          el-tag(size="small" effect="plain") {{ genderText }}
        dl(class="profile-info")
          div(v-for="item in profileInfoItems" :key="item.label" class="profile-info__item")
            dt(class="profile-info__label")
              el-icon
                component(:is="item.icon")
              | {{ item.label }}
            dd(class="profile-info__value" :class="{ 'is-muted': item.muted }") {{ item.value }}
      section(class="profile-card")
        header(class="profile-card__header")
          h3(class="profile-card__title") 角色權限
          span(class="profile-card__extra") {{ permissionCount }} 個權限
        div(class="profile-tags")
          el-tag(v-for="role in roleList" :key="role" class="m-0" size="small" effect="light") {{ role }}
          span(v-if="!roleList.length" class="profile-empty") 暫無角色

    main(class="profile-page__main")
      section(class="profile-card")
        header(class="profile-card__header")
          div
            h3(class="profile-card__title") 安全設定
            p(class="profile-card__desc") 維護帳號登入憑證與身份驗證方式
        div(class="profile-security")
          div(v-for="item in securityItems" :key="item.key" class="profile-security__item")
            span(:class="['profile-icon', 'profile-icon--large', 'profile-icon--' + item.tone]")
              el-icon
                component(:is="item.icon")
            div(class="profile-security__body")
              div(class="profile-security__title")
                span {{ item.title }}
                el-tag(size="small" :type="item.statusType" effect="plain") {{ item.status }}
              p(class="profile-security__desc") {{ item.description }}
            div(class="profile-security__actions")
              el-button(
                v-for="action in item.actions"
                :key="action.label"
                :type="action.type"
                link
                @click="action.onClick"
              ) {{ action.label }}

  el-dialog(v-model="dialogState.visible" :title="dialogState.title" width="520px")
    el-form(
      v-if="dialogState.type === DialogType.ACCOUNT"
      ref="userProfileFormRef"
      :model="userProfileForm"
      :rules="userProfileRules"
      label-width="88px"
      class="pr-10px"
    )
      el-form-item(label="暱稱" prop="nickname")
        el-input(v-model="userProfileForm.nickname" placeholder="請輸入暱稱")
      el-form-item(label="性別")
        AppDictSelect(v-model="userProfileForm.gender" code="gender")

    el-form(
      v-else-if="dialogState.type === DialogType.PASSWORD"
      ref="passwordChangeFormRef"
      :model="passwordChangeForm"
      :rules="passwordChangeRules"
      label-width="88px"
      class="pr-10px"
    )
      el-form-item(label="原密碼" prop="oldPassword")
        el-input(v-model="passwordChangeForm.oldPassword" type="password" show-password)
      el-form-item(label="新密碼" prop="newPassword")
        el-input(v-model="passwordChangeForm.newPassword" type="password" show-password)
      el-form-item(label="確認密碼" prop="confirmPassword")
        el-input(v-model="passwordChangeForm.confirmPassword" type="password" show-password)

    el-form(
      v-else-if="dialogState.type === DialogType.MOBILE"
      ref="mobileBindingFormRef"
      :model="mobileUpdateForm"
      :rules="mobileBindingRules"
      label-width="88px"
      class="pr-10px"
    )
      el-form-item(label="手機號碼" prop="mobile")
        el-input(v-model="mobileUpdateForm.mobile" maxlength="10")
      el-form-item(label="驗證碼" prop="code")
        el-input(v-model="mobileUpdateForm.code")
          template(v-slot:append)
            el-button(:disabled="mobileCountdown > 0" @click="handleSendMobileCode") {{ mobileCountdown > 0 ? mobileCountdown + "s後重新傳送" : "傳送驗證碼" }}
      el-form-item(label="當前密碼" prop="password")
        el-input(v-model="mobileUpdateForm.password" type="password" show-password)

    el-form(
      v-else-if="dialogState.type === DialogType.EMAIL"
      ref="emailBindingFormRef"
      :model="emailUpdateForm"
      :rules="emailBindingRules"
      label-width="88px"
      class="pr-10px"
    )
      el-form-item(label="郵箱" prop="email")
        el-input(v-model="emailUpdateForm.email")
      el-form-item(label="驗證碼" prop="code")
        el-input(v-model="emailUpdateForm.code")
          template(v-slot:append)
            el-button(:disabled="emailCountdown > 0" @click="handleSendEmailCode") {{ emailCountdown > 0 ? emailCountdown + "s後重新傳送" : "傳送驗證碼" }}
      el-form-item(label="當前密碼" prop="password")
        el-input(v-model="emailUpdateForm.password" type="password" show-password)
    template(v-slot:footer)
      span(class="inline-flex gap-2")
        el-button(@click="handleCancel") 取消
        el-button(type="primary" @click="handleSubmit") 確定
</template>

<script lang="ts" setup>
import UserAPI from "@/api/system/user";
import type {
  UserProfileDetail,
  PasswordChangeForm,
  MobileUpdateForm,
  EmailUpdateForm,
  UserProfileForm,
} from "@/api/system/user";

import type { Component } from "vue";
import FileAPI from "@/api/file";
import { useUserStoreHook } from "@/stores";
import { redirectToLogin } from "@/utils/auth";
import { isMobile, VALIDATORS } from "@/utils";

import {
  Calendar,
  Camera,
  Edit,
  Female,
  Iphone,
  Location,
  Lock,
  Male,
  Message,
  OfficeBuilding,
  Timer,
  User,
  UserFilled,
} from "@element-plus/icons-vue";

interface ProfileInfoItem {
  label: string;
  value: string;
  icon: Component;
  muted?: boolean;
}

interface SecurityAction {
  label: string;
  type: "primary" | "danger";
  onClick: () => void;
}

interface SecurityItem {
  key: string;
  title: string;
  description: string;
  status: string;
  statusType: "success" | "warning" | "info";
  icon: Component;
  tone: "primary" | "success" | "warning";
  actions: SecurityAction[];
}

const userStore = useUserStoreHook();

const userProfile = ref<UserProfileDetail>({});

const enum DialogType {
  ACCOUNT = "account",
  PASSWORD = "password",
  MOBILE = "mobile",
  EMAIL = "email",
}

const dialogState = reactive({
  visible: false,
  title: "",
  type: "" as DialogType,
});

const userProfileFormRef = ref();
const passwordChangeFormRef = ref();
const mobileBindingFormRef = ref();
const emailBindingFormRef = ref();

const userProfileForm = reactive<UserProfileForm>({});
const passwordChangeForm = reactive<PasswordChangeForm>({});
const mobileUpdateForm = reactive<MobileUpdateForm>({});
const emailUpdateForm = reactive<EmailUpdateForm>({});

const mobileCountdown = ref(0);
const mobileTimer = ref();

const emailCountdown = ref(0);
const emailTimer = ref();

const recentLoginRecords = [
  {
    device: "Chrome / Windows",
    location: "上海",
    ip: "192.168.1.26",
    time: "2026-06-20 09:32",
  },
  {
    device: "Edge / Windows",
    location: "杭州",
    ip: "192.168.1.18",
    time: "2026-06-19 18:46",
  },
  {
    device: "Safari / iOS",
    location: "深圳",
    ip: "192.168.1.12",
    time: "2026-06-18 14:08",
  },
];

const userProfileRules = {
  nickname: [{ required: true, message: "請輸入暱稱", trigger: "blur" }],
};

const passwordChangeRules = {
  oldPassword: [{ required: true, message: "請輸入原密碼", trigger: "blur" }],
  newPassword: [{ required: true, message: "請輸入新密碼", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "請再次輸入新密碼", trigger: "blur" },
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== passwordChangeForm.newPassword) {
          callback(new Error("兩次輸入的密碼不一致"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
};

// 手機號校驗規則
const mobileBindingRules = {
  mobile: [{ required: true, message: "請輸入手機號碼", trigger: "blur" }, VALIDATORS.mobile],
  code: [{ required: true, message: "請輸入驗證碼", trigger: "blur" }],
  password: [{ required: true, message: "請輸入當前密碼", trigger: "blur" }],
};

// 郵箱校驗規則
const emailBindingRules = {
  email: [
    { required: true, message: "請輸入郵箱", trigger: "blur" },
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "請輸入正確的郵箱地址",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "請輸入驗證碼", trigger: "blur" }],
  password: [{ required: true, message: "請輸入當前密碼", trigger: "blur" }],
};

const displayAvatar = computed(() => userProfile.value.avatar || userStore.userInfo.avatar || "");

const displayName = computed(() => {
  return (
    userProfile.value.nickname ||
    userStore.userInfo.nickname ||
    userProfile.value.username ||
    userStore.userInfo.username ||
    "未命名使用者"
  );
});

const roleList = computed(() => {
  return (userProfile.value.roleNames || "")
    .split(/[,，]/)
    .map((role) => role.trim())
    .filter(Boolean);
});

const primaryRole = computed(() => roleList.value[0] || "普通使用者");

const permissionCount = computed(() => userStore.userInfo.perms?.length || 0);

const genderText = computed(() => {
  if (userProfile.value.gender === 1) return "男";
  if (userProfile.value.gender === 2) return "女";
  return "未設定";
});

const profileInfoItems = computed<ProfileInfoItem[]>(() => [
  {
    label: "使用者名稱",
    value: userProfile.value.username || "-",
    icon: userProfile.value.gender === 2 ? Female : userProfile.value.gender === 1 ? Male : User,
  },
  {
    label: "手機號碼",
    value: userProfile.value.mobile || "未繫結",
    icon: Iphone,
    muted: !userProfile.value.mobile,
  },
  {
    label: "郵箱",
    value: userProfile.value.email || "未繫結",
    icon: Message,
    muted: !userProfile.value.email,
  },
  {
    label: "部門",
    value: userProfile.value.deptName || "-",
    icon: OfficeBuilding,
    muted: !userProfile.value.deptName,
  },
  {
    label: "建立時間",
    value: formatValue(userProfile.value.createTime),
    icon: Timer,
    muted: !userProfile.value.createTime,
  },
]);

const securityItems = computed<SecurityItem[]>(() => [
  {
    key: "password",
    title: "帳戶密碼",
    description: "定期修改密碼有助於保護帳戶安全",
    status: "已設定",
    statusType: "success",
    icon: Lock,
    tone: "primary",
    actions: [
      {
        label: "修改",
        type: "primary",
        onClick: () => handleOpenDialog(DialogType.PASSWORD),
      },
    ],
  },
  {
    key: "mobile",
    title: "手機號",
    description: mobileSecurityDesc.value,
    status: userProfile.value.mobile ? "已繫結" : "未繫結",
    statusType: userProfile.value.mobile ? "success" : "warning",
    icon: Iphone,
    tone: "success",
    actions: userProfile.value.mobile
      ? [
          {
            label: "更換",
            type: "primary",
            onClick: () => handleOpenDialog(DialogType.MOBILE),
          },
          {
            label: "解綁",
            type: "danger",
            onClick: handleUnbindMobile,
          },
        ]
      : [
          {
            label: "繫結",
            type: "primary",
            onClick: () => handleOpenDialog(DialogType.MOBILE),
          },
        ],
  },
  {
    key: "email",
    title: "郵箱",
    description: emailSecurityDesc.value,
    status: userProfile.value.email ? "已繫結" : "未繫結",
    statusType: userProfile.value.email ? "success" : "warning",
    icon: Message,
    tone: "warning",
    actions: userProfile.value.email
      ? [
          {
            label: "更換",
            type: "primary",
            onClick: () => handleOpenDialog(DialogType.EMAIL),
          },
          {
            label: "解綁",
            type: "danger",
            onClick: handleUnbindEmail,
          },
        ]
      : [
          {
            label: "繫結",
            type: "primary",
            onClick: () => handleOpenDialog(DialogType.EMAIL),
          },
        ],
  },
]);

function formatValue(value?: Date | string) {
  return value ? String(value) : "-";
}

function getPromptValue(result: unknown) {
  if (result && typeof result === "object" && "value" in result) {
    return String(result.value || "");
  }
  return "";
}

function maskMobile(mobile?: string) {
  if (!mobile) return "";
  return mobile.replace(/^(\d{4})\d{3}(\d{3})$/, "$1***$2");
}

function maskEmail(email?: string) {
  if (!email) return "";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  if (name.length <= 2) return `${name[0] || ""}***@${domain}`;
  return `${name.slice(0, 2)}***@${domain}`;
}

const mobileSecurityDesc = computed(() => {
  return userProfile.value.mobile
    ? `已繫結：${maskMobile(userProfile.value.mobile)}`
    : "未繫結手機，建議立即繫結";
});

const emailSecurityDesc = computed(() => {
  return userProfile.value.email
    ? `已繫結：${maskEmail(userProfile.value.email)}`
    : "未繫結郵箱，建議立即繫結";
});

const handleOpenDialog = (type: DialogType) => {
  dialogState.type = type;
  dialogState.visible = true;
  switch (type) {
    case DialogType.ACCOUNT:
      dialogState.title = "編輯資料";
      userProfileForm.nickname = userProfile.value.nickname;
      userProfileForm.avatar = userProfile.value.avatar;
      userProfileForm.gender = userProfile.value.gender;
      break;
    case DialogType.PASSWORD:
      dialogState.title = "修改密碼";
      break;
    case DialogType.MOBILE:
      dialogState.title = userProfile.value.mobile ? "更換手機號" : "繫結手機號";
      mobileUpdateForm.mobile = "";
      mobileUpdateForm.code = "";
      mobileUpdateForm.password = "";
      break;
    case DialogType.EMAIL:
      dialogState.title = userProfile.value.email ? "更換郵箱" : "繫結郵箱";
      emailUpdateForm.email = "";
      emailUpdateForm.code = "";
      emailUpdateForm.password = "";
      break;
  }
};

async function handleUnbindMobile() {
  if (!userProfile.value.mobile) return;
  try {
    const result = await ElMessageBox.prompt("請輸入當前密碼以解綁手機號", "解綁手機號", {
      type: "warning",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      inputType: "password",
      inputPlaceholder: "當前密碼",
      inputValidator: (val) => !!val || "請輸入當前密碼",
    });
    const value = getPromptValue(result);
    await UserAPI.unbindMobile({ password: value });
    ElMessage.success("手機號解綁成功");
    await loadUserProfile();
  } catch {
    // ignore
  }
}

async function handleUnbindEmail() {
  if (!userProfile.value.email) return;
  try {
    const result = await ElMessageBox.prompt("請輸入當前密碼以解綁郵箱", "解綁郵箱", {
      type: "warning",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      inputType: "password",
      inputPlaceholder: "當前密碼",
      inputValidator: (val) => !!val || "請輸入當前密碼",
    });
    const value = getPromptValue(result);
    await UserAPI.unbindEmail({ password: value });
    ElMessage.success("郵箱解綁成功");
    await loadUserProfile();
  } catch {
    // ignore
  }
}

function handleSendMobileCode() {
  if (!mobileUpdateForm.mobile) {
    ElMessage.error("請輸入手機號碼");
    return;
  }
  if (!isMobile(mobileUpdateForm.mobile)) {
    ElMessage.error("手機號碼格式不正確");
    return;
  }
  UserAPI.sendMobileCode(mobileUpdateForm.mobile).then(() => {
    ElMessage.success("驗證碼傳送成功");
    mobileCountdown.value = 60;
    mobileTimer.value = setInterval(() => {
      if (mobileCountdown.value > 0) {
        mobileCountdown.value -= 1;
      } else {
        clearInterval(mobileTimer.value!);
      }
    }, 1000);
  });
}

function handleSendEmailCode() {
  if (!emailUpdateForm.email) {
    ElMessage.error("請輸入郵箱");
    return;
  }
  const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  if (!reg.test(emailUpdateForm.email)) {
    ElMessage.error("郵箱格式不正確");
    return;
  }

  UserAPI.sendEmailCode(emailUpdateForm.email).then(() => {
    ElMessage.success("驗證碼傳送成功");
    emailCountdown.value = 60;
    emailTimer.value = setInterval(() => {
      if (emailCountdown.value > 0) {
        emailCountdown.value -= 1;
      } else {
        clearInterval(emailTimer.value!);
      }
    }, 1000);
  });
}

const handleSubmit = async () => {
  try {
    if (dialogState.type === DialogType.ACCOUNT) {
      const valid = await userProfileFormRef.value?.validate();
      if (!valid) return;

      await UserAPI.updateProfile(userProfileForm);
      ElMessage.success("帳號資料修改成功");
      dialogState.visible = false;
      if (userProfileForm.nickname) {
        userStore.userInfo.nickname = userProfileForm.nickname;
      }
      await loadUserProfile();
    } else if (dialogState.type === DialogType.PASSWORD) {
      const valid = await passwordChangeFormRef.value?.validate();
      if (!valid) return;

      await UserAPI.changePassword(passwordChangeForm);
      dialogState.visible = false;
      await redirectToLogin("密碼已修改，請重新登入");
    } else if (dialogState.type === DialogType.MOBILE) {
      const valid = await mobileBindingFormRef.value?.validate();
      if (!valid) return;

      await UserAPI.bindOrChangeMobile(mobileUpdateForm);
      ElMessage.success(userProfile.value.mobile ? "手機號更換成功" : "手機號繫結成功");
      dialogState.visible = false;
      await loadUserProfile();
    } else if (dialogState.type === DialogType.EMAIL) {
      const valid = await emailBindingFormRef.value?.validate();
      if (!valid) return;

      await UserAPI.bindOrChangeEmail(emailUpdateForm);
      ElMessage.success(userProfile.value.email ? "郵箱更換成功" : "郵箱繫結成功");
      dialogState.visible = false;
      await loadUserProfile();
    }
  } catch {
    // ignore
  }
};

const handleCancel = () => {
  dialogState.visible = false;
  if (dialogState.type === DialogType.ACCOUNT) {
    userProfileFormRef.value?.resetFields();
  } else if (dialogState.type === DialogType.PASSWORD) {
    passwordChangeFormRef.value?.resetFields();
  } else if (dialogState.type === DialogType.MOBILE) {
    mobileBindingFormRef.value?.resetFields();
  } else if (dialogState.type === DialogType.EMAIL) {
    emailBindingFormRef.value?.resetFields();
  }
};

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    const data = await FileAPI.uploadFile(file);
    await UserAPI.updateProfile({
      avatar: data.url,
    });
    userProfile.value.avatar = data.url;
    userStore.userInfo.avatar = data.url;
    ElMessage.success("頭像更新成功");
  }
  target.value = "";
};

const loadUserProfile = async () => {
  const data = await UserAPI.getProfile();
  userProfile.value = data;
};

onMounted(async () => {
  if (mobileTimer.value) {
    clearInterval(mobileTimer.value);
  }
  if (emailTimer.value) {
    clearInterval(emailTimer.value);
  }
  await loadUserProfile();
});

onBeforeUnmount(() => {
  if (mobileTimer.value) {
    clearInterval(mobileTimer.value);
  }
  if (emailTimer.value) {
    clearInterval(emailTimer.value);
  }
});
</script>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
  padding: 16px;
}

.profile-hero,
.profile-card {
  background: var(--content-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.profile-hero {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.profile-hero__body,
.profile-hero__title,
.profile-hero__meta,
.profile-hero__actions,
.profile-hero__meta-item {
  display: flex;
  align-items: center;
}

.profile-hero__body {
  gap: 16px;
  min-width: 0;
}

.profile-hero__info {
  min-width: 0;
}

.profile-hero__title {
  flex-wrap: wrap;
  gap: 10px;
}

.profile-hero__name {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
  color: var(--el-text-color-primary);
}

.profile-hero__desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.profile-hero__meta {
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.profile-hero__meta-item {
  gap: 4px;
}

.profile-hero__actions {
  flex-shrink: 0;
  gap: 8px;
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar__action {
  position: absolute;
  right: -2px;
  bottom: -2px;
  border: 2px solid var(--content-bg);
}

.profile-avatar__input {
  display: none;
}

.profile-page__layout {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.profile-page__side,
.profile-page__main {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.profile-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
  gap: 16px;
}

.profile-card {
  padding: 18px 20px;
}

.profile-card__header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.profile-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
  color: var(--el-text-color-primary);
}

.profile-card__desc {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.profile-card__extra,
.profile-empty {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.profile-info {
  display: grid;
  gap: 10px;
  margin: 0;
}

.profile-info__item {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 34px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.profile-info__item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.profile-info__label {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.profile-info__value {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.profile-stats__item {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 12px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px;
}

.profile-stats__body {
  min-width: 0;
}

.profile-stats__label,
.profile-stats__value {
  display: block;
}

.profile-stats__label {
  margin-bottom: 2px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.profile-stats__value {
  font-size: 20px;
  line-height: 24px;
  color: var(--el-text-color-primary);
}

.profile-stats__value em {
  display: inline;
  margin-left: 2px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  color: var(--el-text-color-secondary);
}

.profile-icon {
  display: flex;
  flex: 0 0 36px;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-radius: 8px;
}

.profile-icon--large {
  flex-basis: 40px;
  width: 40px;
  height: 40px;
  font-size: 20px;
}

.profile-icon--success {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.profile-icon--warning {
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
}

.profile-icon--info {
  color: var(--el-color-info);
  background: var(--el-fill-color-light);
}

.profile-security,
.profile-login,
.profile-status {
  display: grid;
  gap: 12px;
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.profile-security__item {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px;
}

.profile-security__body,
.profile-login__body,
.profile-status__body {
  min-width: 0;
}

.profile-security__title {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.profile-security__desc {
  margin: 4px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.profile-security__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.profile-security__actions .el-button + .el-button {
  margin-left: 0;
}

.profile-login__item {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  min-height: 44px;
}

.profile-login__device,
.profile-login__meta,
.profile-login__time,
.profile-status__title,
.profile-status__desc {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-login__device,
.profile-status__title {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.profile-login__meta,
.profile-login__time,
.profile-status__desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.profile-status__item {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 38px;
  color: var(--el-color-success);
}

.profile-status__item.is-warning {
  color: var(--el-color-warning);
}

.profile-status__title {
  margin-bottom: 2px;
}

.is-muted {
  color: var(--el-text-color-placeholder);
}

@media (width <= 1200px) {
  .profile-page__layout,
  .profile-page__grid {
    grid-template-columns: 1fr;
  }
}

@media (width <= 768px) {
  .profile-page {
    padding: 12px;
  }

  .profile-hero {
    align-items: flex-start;
  }

  .profile-hero,
  .profile-hero__body,
  .profile-hero__actions {
    flex-direction: column;
  }

  .profile-hero__actions {
    align-items: stretch;
    width: 100%;
  }

  .profile-hero__actions .el-button {
    width: 100%;
    margin-left: 0;
  }

  .profile-security__item,
  .profile-login__item {
    grid-template-columns: 40px minmax(0, 1fr);
  }

  .profile-security__actions,
  .profile-login__time {
    grid-column: 2;
    justify-self: start;
  }
}

@media (width <= 520px) {
  .profile-stats,
  .profile-info__item {
    grid-template-columns: 1fr;
  }

  .profile-info__item {
    gap: 4px;
  }
}
</style>
