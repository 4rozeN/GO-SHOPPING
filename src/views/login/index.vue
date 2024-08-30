<template>
  <div class="login">
    <!-- 头部 NavBar -->
    <van-nav-bar
      title="尊敬的用户，请登录"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <!-- 主体部分 自定义 -->
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="phoneNum" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input class="inp" v-model="smsCode" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">{{ totalTime === timeNow ? '获取验证码' : `${timeNow}秒后重试` }}</button>
        </div>
      </div>

      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import { codeLogin, getMsgCode, getPicCode } from '@/api/login'
import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  data () {
    return {
      // 手机号正则 1开头 3-9为第二位 接着9位数字
      reg_phone: /^1[3-9]\d{9}$/,
      reg_picCode: /^\w{4}$/, // 图形正则
      phoneNum: '', // 用户输入的手机号码
      picCode: '', // 用户输入的图形验证码
      smsCode: '', // 用户输入的短信验证码
      picKey: '', // 图形验证码的key
      picUrl: '', // 存放要渲染的图形验证码的url
      timerId: null, // 计时器的id
      totalTime: 60, // 计时器的总时间
      timeNow: 60 // 计时器当前的时间
    }
  },
  async created () {
    this.getPicCode()
  },
  methods: {
    // 获取图形验证码
    async getPicCode () {
      const { data: { base64, key } } = await getPicCode()
      this.picUrl = base64
      this.picKey = key
    },

    // 校验手机号和图形验证码
    validFn () {
      if (!this.reg_phone.test(this.phoneNum)) {
        Toast('请输入正确的手机号！')
        return false
      }
      if (!this.reg_picCode.test(this.picCode)) {
        Toast('图形验证码错误！')
        return false
      }
      return true
    },

    // 短信验证码获取
    async getCode () {
      // 校验手机号和图形验证码格式
      if (!this.validFn()) { return }

      // 发送获取短信验证码的请求
      await getMsgCode(this.picCode, this.picKey, this.phoneNum)
      Toast('短信发送成功，请注意查收')

      // 发送短信验证码
      // 只有当计时器处于未开启状态并且当前时间和总时间一致时说明可以开启倒计时
      if (!this.timerId && this.timeNow === this.totalTime) {
        // 开启计时器
        this.timerId = setInterval(() => {
          this.timeNow--

          if (this.timeNow <= 0) {
            // 停止计时器
            clearInterval(this.timerId)
            this.timerId = null
            this.timeNow = this.totalTime
          }
        }, 1000)
        // 获取成功给予提示
        Toast('获取短信验证码成功')
      }
    },

    // 登录功能
    async login () {
      // 校验手机号和图形验证码格式
      if (!this.validFn()) { return }
      // 校验输入的短信验证码格式
      if (!/^\d{6}$/.test(this.smsCode)) {
        Toast('请输入正确的短信验证码！')
        return
      }

      const res = await codeLogin(this.phoneNum, this.smsCode)
      if (res.status === 200) {
        Toast('登录成功')
        this.$store.commit('User/setUserInfo', res.data)

        // 判断是否是被拦截跳转到登录(是否有携带backUrl参数)
        const url = this.$route.query.backUrl || '/'
        this.$router.replace(url)
      } else {
        Toast('登录失败，请检查手机号和验证码是否正确')
      }
    }
  },

  // 页面销毁时清除定时器
  destroyed () {
    // 当用户退出登录页面清除定时器
    clearInterval(this.timerId)
  }
}

</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
