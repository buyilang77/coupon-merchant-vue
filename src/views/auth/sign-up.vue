<template>
  <div class="login-container">
    <el-form ref="signUpForm" :model="signUpForm" :rules="signUpRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">礼品卡/券营销系统</h3>
        <h5 class="small-title">商户注册</h5>
      </div>

      <el-form-item label="用户名" prop="username">
        <el-input
          ref="username"
          v-model.trim="signUpForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item label="密码" prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model.trim="signUpForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item label="商户名称" prop="merchant_name">
        <el-input ref="merchant_name" v-model="signUpForm.merchant_name" placeholder="请输入商户名称" name="merchant_name" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-form-item label="姓名" prop="surname">
        <el-input ref="surname" v-model="signUpForm.surname" placeholder="请输入姓名" name="surname" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-form-item label="手机" prop="phone">
        <el-input ref="phone" v-model="signUpForm.phone" placeholder="请输入手机号" name="phone" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-form-item label="地区" prop="region">
        <el-cascader
          v-model="signUpForm.region"
          size="large"
          :options="regionOptions"
          @change="handleChange"
        />
      </el-form-item>

      <el-form-item label="地址" prop="address">
        <el-input ref="address" v-model="signUpForm.address" placeholder="请输入地址" name="address" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleSignUp">注册</el-button>

      <div>
        <el-link type="primary" href="/#/sign-in">已有账号? 立即登录</el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
import { signUp } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      signUpForm: {
        username: null,
        password: null,
        merchant_name: null,
        surname: null,
        phone: null,
        region: null,
        address: null
      },
      signUpRules: {
        username: [{ required: true, message: '用户名不能为空!', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空!', trigger: 'blur' }],
        phone: [{ required: true, message: '手机不能为空!', trigger: 'blur' }],
        region: [{ required: true, message: '地区不能为空!', trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      regionOptions: regionData
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.signUpForm.username === '') {
      this.$refs.username.focus()
    } else if (this.signUpForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleSignUp() {
      this.loading = true
      signUp(this.signUpForm).then(response => {
        console.log('response', response)
        this.$store.dispatch('user/signUp', this.signUpForm)
          .then(() => {
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.loading = false
          })
      }).catch(() => {
        setTimeout(() => {
          this.loading = false
        }, 3000)
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 70%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;

    label {
      margin-left: 10px;
      height: 47px;
      width: 70px;
      line-height: 47px;
    }

    .el-cascader {
      width: 70%;
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .small-title {
      color: #CCCCCC;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
