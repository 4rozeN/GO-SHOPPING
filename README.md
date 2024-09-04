> 本项目是基于uni-app技术栈开发的，能够运行在多端(微信小程序、h5、ios/Android)的移动端商城项目。

- 重点: 接口需要token的地方，header中， Access-Token:${token}
- 重点: 接口需要platform的地方，header中，platform: h5或mp-weixin
- 接口调用基础地址：http://smart-shop.itheima.net/index.php?s=/api
- 关于接口的说明：分为了http状态码和接口中code对应码

| 码值           | 说明                         |
| :------------- | :--------------------------- |
| http状态码 500 | 服务器端异常，请联系后端老师 |
| http状态码 404 | 服务器端异常，请联系后端老师 |
| http状态码 401 | 授权信息不正确，重新登录即可 |

> 测试环境，登录短信验证码统一为：246810 （不再提供真实的短信验证服务）
>
> [接口文档地址](https://apifox.com/apidoc/shared-12ab6b18-adc2-444c-ad11-0e60f5693f66/doc-2221080)
>
> [Vant2官网地址](https://youzan.github.io/vant/v2/#/zh-CN/)
>
> 本项目使用`ESLint+Standard config`的代码规范标准
>
> 运行命令：yarn serve
>
> 编译命令：yarn build

# 基础路由配置

## 一级路由配置

将每个基础的一级页面以文件夹形式存放于views包中。包括：

![image-20240828171025686](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281710771.png)具体项目结构如下：
<img src="https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281709022.png" alt="image-20240828170920935" style="zoom:80%;" />

路由页如下：
<img src="https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281711591.png" alt="image-20240828171139419" style="zoom: 50%;" />

## 二级路由配置

### 实现底部导航栏Tabbar

配置二级路由之前需要完成底部Tabbar栏的设计，可以结合vant官网文档进行设计。[vant2官网](https://youzan.github.io/vant/v2/)![image-20240828171252550](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281712602.png)

### 实现二级路由配置

![image-20240828174123840](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281741912.png)

在组件中的vant2的Tabbar要实现路由模式如下：

![image-20240828174450143](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281744188.png)

于是有：

```vue
  <div>
    <router-view></router-view>
    <van-tabbar route v-model="active" active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item to= "/home" icon="gem-o">首页</van-tabbar-item>
      <van-tabbar-item to= "/category" icon="apps-o">分类页</van-tabbar-item>
      <van-tabbar-item to= "/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item to= "/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
```

最后优化路由逻辑，将默认匹配的页面重定向到home

![image-20240828174814027](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281748077.png)

## 登录静态页

新建`styles/common.less`重置默认样式（可以对一些想要多组件生效的样式进行重新调整）

```less
// 重置默认样式
* {
  margin: 0;
  padding: 0;
  box-sizing: borde-box;
}

// 文字溢出省略号
.text-ellipsis-2 {
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
   -webkit-box-orient:vertical;
}
```

导入于main.js中：`import '@/styles/common.less'`

接着准备一些素材图片于assets
![image-20240828175944181](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281759229.png)

### 配置头部NavBar

```vue
<!-- 头部 NavBar -->
    <van-nav-bar
      title="尊敬的用户，请登录"
      left-arrow
      @click-left="$router.go(-1)"
    />
```

`$router.go(-1)`的作用是返回上一页。

接着将左边的返回符号left-arrow颜色样式改为灰色#333，于是找到common.less进行编写（两个类名增加权重）

```less
// 添加导航的通用样式
.van-nav-bar {
  .van-nav-bar__arrow {
    color: #333;
  }
}
```

这样的好处是，一旦配置好了将来其他页面使用到导航栏此处的返回颜色都是我们此时配好的颜色。这就是通用样式的覆盖。

### 完善主体

接着编写主体的静态结构：

```vue
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
          <input class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img src="@/assets/code.png" alt="">
        </div>
        <div class="form-item">
          <input class="inp" placeholder="请输入短信验证码" type="text">
          <button>获取验证码</button>
        </div>
      </div>

      <div class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginIndex'
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
```

页面效果如下：

<img src="https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281818338.png" alt="image-20240828181803280" style="zoom: 80%;" />

图形验证码暂时写死，短信验证码暂时不作处理

### 完善登录逻辑

登录页面一共有三个请求需要发送，图形验证码、短信验证码和登录请求。我们使用axios来请求后端接口，一般都会对axios进行一些配置（配置基础地址，请求响应拦截器等），于是封装axios为一个request模块，便于维护。以后使用axios都是创建实例去请求，这样多个实例相互独立，互不干扰。

- [axios中文文档](https://www.axios-http.cn/docs/instance)

新建request.js于utils包下，创建一个axios实例（cv中文文档中的实例和拦截器进行改造）：

```js
import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  // 查看接口文档改造
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: { platform: 'h5' }
})

// 自定义配置 - 请求/响应 拦截器 （如果希望不污染原本的axios需要将axios改为instance实例）
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么 (默认axios会对响应多包装一层data，所以这里需要取出data)
  return response.data
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 导出配置好的示例
export default instance

```

响应器中，response.data原本为response，这里改为上文是因为axios默认会对响应多包装一层data，所以这里需要取出data

接着回到登录页面index.vue上，导入request模块，异步检查一下：

```vue
<script>
import request from '@/utils/request'

export default {
  name: 'LoginIndex',
  async created () {
    const res = await request.get('/captcha/image')
    console.log(res)
  }
}
</script>
```

调试返回如下

![image-20240828185016590](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408281850640.png)

#### 解析base64并完善点击刷新图片验证码

由于提交的图形验证码必须带key才能让后端进行唯一校验，所以在data中提供：

```js
  data () {
    return {
      picCode: '', // 用户输入的图形验证码
      picKey: '', // 图形验证码的key
      picUrl: '' // 存放要渲染的图形验证码的url
    }
  },
```

接着进行响应结果的解构，存储好数据以便后续提交后端进行校验

```js
  async created () {
    this.getPicCode()
  },  
	methods: {
    async getPicCode () {
      const { data: { base64, Key } } = await request.get('/captcha/image')
      this.picUrl = base64
      this.picKey = Key
    }
  }
```

完善template相关代码：

```vue
<div class="form-item">
   <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
   <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
</div>
```

封装登录请求到api包下，新建login.js

```js
// 登录相关接口请求
import request from '@/utils/request'

export const getPicCode = () => {
  return request.get('/captcha/image')
}

```

使用时按需导入。于是到登录页index.js中改`import request from '@/utils/request'`为`import { getPicCode } from '@/api/login'`并修改调用语句：

```js
  methods: {
    async getPicCode () {
      const { data: { base64, Key } } = await getPicCode()
      this.picUrl = base64
      this.picKey = Key
    }
  }
```

上述语句不会因为重名冲突，我们需要知道的是，如果是引入的getPicCode前面是不带this的，而自身的getPicCode是需要在前面加上this.的



### Toast轻提示

校验手机号是否输入、是否输入格式正确等并给予提示。

使用vant库中的Toast轻提示，完成提示显示。需要注意的是他的两种调用方式：

1. Toast('提示内容');
2. this.$toast('提示文案');  引入 Toast 组件后，会自动在 Vue 的 prototype 上挂载 `$toast` 方法，便于在组件内调用。

这两种调用，第一种是任意地方都可以调用显示出提示内容，第二种是只有组件内才可以显示提示内容。Toast 默认采用单例模式，即同一时间只会存在一个 Toast，如果需要在同一时间弹出多个 Toast，可以参考下面的示例：

```js
Toast.allowMultiple();

const toast1 = Toast('第一个 Toast');
const toast2 = Toast.success('第二个 Toast');

toast1.clear();
toast2.clear();
```

### 短信验证倒计时

点击获取验证码之后要开始倒计时，一分钟只能发送一次。给获取短信验证码的按钮注册点击事件并改写显示文字

```vue
<div class="form-item">
   <input class="inp" placeholder="请输入短信验证码" type="text">
   <button @click="getCode">{{ totalTime === timeNow ? '获取验证码' : `${timeNow}秒后重试` }}</button>
</div>
```

提供短信验证码获取函数getCode

```js
		// 短信验证码获取
    async getCode () {
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
    }
```

并考虑到性能问题，于是增加在用户离开登录页面之后清除定时器的功能，实现在destroy生命函数

```js
destroyed () {
    // 当用户退出登录页面清除定时器
    clearInterval(this.timerId)
  }
```

### 手机号和图形验证码类型校验

由于前端无法校验具体，只能校验数据类型和长度。所以新增两个正则数据和绑定用户输入的手机号：

```js
// 手机号正则 1开头 3-9为第二位 接着9位数字
      reg_phone: /^1[3-9]\d{9}$/,
      reg_picCode: /^\w{4}$/, // 图形正则
      phoneNum: '', // 用户输入的手机号码
```

增加校验的函数validFn

```js
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
```

并在短信验证码获取函数getCode中加入一行判断

```js
// 短信验证码获取
    getCode () {
      // 校验手机号和图形验证码格式
      if (!this.validFn()) { return }
      ...
    }
```

### 封装发送短信验证码请求

转到login.js中进行封装（结合接口文档）

```js
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}
```

然后在短信验证码获取函数getCode中加入调用代码

```js
// 短信验证码获取
    async getCode () {
      // 发送获取短信验证码的请求
      await getMsgCode(this.picCode, this.picKey, this.phoneNum)
      // console.log(res)
      Toast('短信发送成功，请注意查收')
      ...
    }
```

### 实现登录功能-封装登录接口

封装登录请求

```js
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false,
      mobile,
      partyData: {},
      smsCode
    }
  })
}

```

绑定登录按钮事件为login，绑定用户输入的短信验证码为smsCode（默认短信为246810）

```js
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
        this.$router.push('/home')
      } else {
        Toast('登录失败，请检查手机号和验证码是否正确')
      }
    }
```

后面失败的多种情况可以通过响应拦截器进行处理，在这里暂时只考虑成功的情况



## 响应处理器统一处理错误提示

对utils包下的request拦截器进行修改

```js
// 响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么 (默认axios会对响应多包装一层data，所以这里需要取出data)
  const res = response.data
  if (res.status !== 200) {
    Toast(res.message)
    return Promise.reject(res.message)
  }
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response) {
    // 服务器返回了错误响应
    Toast(`服务器错误: ${error.response.data.status}`)
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    Toast('请求超时或网络错误')
  } else {
    // 其他错误
    Toast('请求配置错误')
  }
  return Promise.reject(error)
})
```

## 登录权证信息存储

![image-20240829134402875](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408291344002.png)

使用vuex构建user模块存储登录权证（token和userID）。好处是易获取、响应式，分模块便于管理维护。

在store包下新建modules包，然后在modules包下新建user.js

```js
export default {
  namespaced: true,
  state () {
    return {
      // 个人权证
      userInfo: {
        token: '',
        userId: ''
      }
    }
  },
  mutations: {
    setUserInfo (state, obj) {
      state.userInfo = obj
    }
  },
  actions: {},
  getters: {}
}

```

然后在vuex中进行挂载

```js
import User from '@/store/modules/user'

  modules: {
    User
  }
```

并在登录页面将要实现跳转到首页的前一刻完成用户权证信息的存储

```js
this.$store.commit('User/setUserInfo', res.data)
```

![image-20240829141130620](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408291411700.png)

## vuex持久化处理

vuex刷新就会丢失信息，于是引入持久化存储。我们将获取、设置和移除信息的操作封装为storage模块。

在utils包下新建一个storage.js

```js
// 约定一个通用键名
const INFO_KEY = 'go_shopping_info'

export const getInfo = () => {
  const defaultInfo = {
    token: '',
    userId: ''
  }
  const info = localStorage.getItem(INFO_KEY)
  // 判断info是否有值
  return info ? JSON.parse(info) : defaultInfo
}

export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

```

然后到vuex的user子模块中进行导入使用即可

```js
import { getInfo, setInfo } from '@/utils/storage'
```

![image-20240829143212223](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408291432317.png)

## 添加请求Loading效果

需求分析：有时候因为网络原因，一次请求的结果可能需要一段时间后才能回来。此时，需要给用户添加loading提示。

添加loading提示的好处：

1. **节流处理**：防止用户在一次请求还没回来之前，多次进行点击，发送无效请求
2. **友好提示**：告知用户，目前是在加载中，请耐心等待，用户体验会更好

加在哪呢？可以统一加在拦截器中，这样一来后面也可以复用：

1. **请求拦截器**中，每次请求，打开loading
2. **响应拦截器**中，每次响应，关闭loading

转到utils包下的request拦截器，在请求的时候显示Toast提示，并设置背景不可点击且使其不会定时消失，只能由我们清除。

```js
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 发送请求时显示Toast提示，背景不可点击
  Toast.loading({
    message: '加载中...',
    forbidClick: true, // 禁止背景点击
    duration: 0 // 值为0时，toast不会自动关闭
  })
  return config
}, function (error) {...})
```

在响应拦截器添加清除提示的代码

```js
// 对响应数据做点什么 (默认axios会对响应多包装一层data，所以这里需要取出data)
  const res = response.data
  if (res.status !== 200) {
    Toast(res.message)
    return Promise.reject(res.message)
  } else {
    // 关闭Toast提示
    Toast.clear()
  }
  return res
```

## 全局路由前置守卫

[Vue-router官网地址](https://router.vuejs.org/zh/guide/)

![image-20240829181413117](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408291814256.png)
在router中编写：

```js
import store from '@/store'

...

// 定义数组存储需要登录才能访问的路由
const authNeedRouters = ['/myorder', '/pay', '/productdetail/:id']

// 创建全局路由前置守卫
router.beforeEach((to, from, next) => {
  // 判断to的path是否存在登录的路由数组中
  if (!authNeedRouters.includes(to.path)) {
    // 不需要登录，直接进入
    next()
  } else {
    // 判断是否有token（实际上需要调用后端接口校验token）
    const token = store.state.User.userInfo.token
    if (token) {
      // 有token，可以进入
      next()
    } else {
      // 没有token，跳转到登录页
      next('/login')
    }
  }
})
```

## 首页

### 完成首页静态结构

要用到的vant组件有

- search（搜索框）
- swipe & swipe-item （轮播图）
- grid & grid-item （宫格）

grid宫格主要是使用自定义列数的：
<img src="https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408291915006.png" alt="image-20240829191508887" style="zoom:50%;" />

所以在utils包下的vant2-ui.js中进行添加：

```js
// vant2-ui.js按需导入组件
import Vue from 'vue'
import { Button, Tabbar, TabbarItem, NavBar, Toast, Search, Swipe, SwipeItem, Grid, GridItem } from 'vant'

Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(NavBar)
Vue.use(Toast)
Vue.use(Search)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Grid)
Vue.use(GridItem)

```

静态结构和样式 `layout/home.vue`

```vue
<template>
  <div class="home">
    <!-- 导航条 -->
    <van-nav-bar title="智慧商城" fixed />

    <!-- 搜索框 -->
    <van-search
      readonly
      shape="round"
      background="#f1f1f2"
      placeholder="请在此输入搜索关键词"
      @click="$router.push('/search')"
    />

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <img src="@/assets/banner1.jpg" alt="">
      </van-swipe-item>
      <van-swipe-item>
        <img src="@/assets/banner2.jpg" alt="">
      </van-swipe-item>
      <van-swipe-item>
        <img src="@/assets/banner3.jpg" alt="">
      </van-swipe-item>
    </van-swipe>

    <!-- 导航 -->
    <van-grid column-num="5" icon-size="40">
      <van-grid-item
        v-for="item in 10" :key="item"
        icon="http://cba.itlike.com/public/uploads/10001/20230320/58a7c1f62df4cb1eb47fe83ff0e566e6.png"
        text="新品首发"
        @click="$router.push('/category')"
      />
    </van-grid>

    <!-- 主会场 -->
    <div class="main">
      <img src="@/assets/main.png" alt="">
    </div>

    <!-- 猜你喜欢 -->
    <div class="guess">
      <p class="guess-title">—— 猜你喜欢 ——</p>

      <div class="goods-list">
        <GoodsItem v-for="item in 10" :key="item"></GoodsItem>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
export default {
  name: 'HomePage',
  components: {
    GoodsItem
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.home {
  padding-top: 100px;
  padding-bottom: 50px;
}

// 导航条样式定制
.van-nav-bar {
  z-index: 999;
  background-color: #c21401;
  ::v-deep .van-nav-bar__title {
    color: #fff;
  }
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}

// 分类导航部分
.my-swipe .van-swipe-item {
  height: 185px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  background-color: #39a9ed;
}
.my-swipe .van-swipe-item img {
  width: 100%;
  height: 185px;
}

// 主会场
.main img {
  display: block;
  width: 100%;
}

// 猜你喜欢
.guess .guess-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
```

其中将商品项封装成组件GoodsItem.vue在components包下：

```vue
<template>
  <div class="goods-item" @click="$router.push('/prodetail')">
    <div class="left">
      <img src="@/assets/product.jpg" alt="" />
    </div>
    <div class="right">
      <p class="tit text-ellipsis-2">
        三星手机 SAMSUNG Galaxy S23 8GB+256GB 超视觉夜拍系统 超清夜景 悠雾紫
        5G手机 游戏拍照旗舰机s23
      </p>
      <p class="count">已售104件</p>
      <p class="price">
        <span class="new">¥3999.00</span>
        <span class="old">¥6699.00</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.goods-item {
  height: 148px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 127px;
    img {
      display: block;
      width: 100%;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .count {
      color: #999;
      font-size: 12px;
    }
    .price {
      color: #999;
      font-size: 16px;
      .new {
        color: #f03c3c;
        margin-right: 10px;
      }
      .old {
        text-decoration: line-through;
        font-size: 12px;
      }
    }
  }
}
</style>

```

### 首页-动态渲染

根据接口文档封装请求首页数据模块于api包下，新建home.js：

```js
import request from '@/utils/request'

// 获取首页数据
export const getHomeData = () => {
  return request('/page/detail', {
    params: {
      pageId: 0
    }
  })
}

```

接着转到layout的home.vue处理动态渲染：

```js
import GoodsItem from '@/components/GoodsItem.vue'
import { getHomeData } from '@/api/home'
export default {
  name: 'HomePage',
  components: {
    GoodsItem
  },
  data () {
    return {
      bannerList: [],
      navList: [],
      prodsList: []
    }
  },
  async created () {
    const { data: { pageData } } = await getHomeData()
    console.log(pageData)
    this.bannerList = pageData.items[1].data // 获取轮播图数据
    this.navList = pageData.items[3].data // 获取导航组数据
    this.prodsList = pageData.items[6].data // 获取商品组数据
  }
}
```

改造template中轮播图和导航部分：

```vue
		<!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in bannerList" :key="item.imgUrl">
        <img :src="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>

    <!-- 导航 -->
    <van-grid column-num="5" icon-size="40">
      <van-grid-item
        v-for="item in navList" :key="item.imgUrl"
        :icon="item.imgUrl"
        :text="item.text"
        @click="$router.push('/category')"
      />
    </van-grid>
```

接着改造商品组：

```vue
<!-- 猜你喜欢 -->
    <div class="guess">
      <p class="guess-title">—— 猜你喜欢 ——</p>
      <div class="goods-list">
        <GoodsItem v-for="item in prodsList" :key="item.goods_id" :goods="item"></GoodsItem>
      </div>
    </div>
  </div>
```

父传子将item整个对象传给GoodsItem进行接收：

```js
export default {
  name: 'GoodsItem',
  props: {
    goods: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  }
```

然后改造template

```vue
<div class="goods-item" v-if="goods.goods_id" @click="$router.push(`/prodetail/${goods.goods_id}`)">
    <div class="left">
      <img :src="goods.goods_image" alt="" />
    </div>
    <div class="right">
      <p class="tit text-ellipsis-2">
        {{ goods.goods_name }}
      </p>
      <p class="count">{{goods.goods_sales}}</p>
      <p class="price">
        <span class="new">{{goods.goods_price_min}}</span>
        <span class="old">{{goods.goods_price_max}}</span>
      </p>
    </div>
```

注意将商品id携带进行跳转时要动态取值使用反引号。



## 搜索

页面设计：

![image-20230621144449700](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408292021783.png)

### 搜索页静态结构

`view/search/index.vue`（需要导入vant组件Icon）

```vue
<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <van-search show-action placeholder="请输入搜索关键词" clearable>
      <template #action>
        <div>搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div class="search-history" v-if=" historyList.length > 0" >
      <div class="title">
        <span>最近搜索</span>
        <van-icon name="delete-o" size="16" />
      </div>
      <div class="list">
        <div class="list-item" v-for="item in historyList" :key="item" @click="$router.push('/searchlist')">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchIndex',
  data () {
    return {
      historyList: ['炒锅', '电视', '冰箱', '手机', '自行车']
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    background-color: #fa2209;
    color: #fff;
  }
  ::v-deep .van-search__action {
    background-color: #c21401;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 5px 5px 0;
    margin-right: 10px;
  }
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
  }
  .list-item {
    width: 25%;
    text-align: center;
    padding: 7px;
    line-height: 15px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    border: 1px solid #efefef;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
}
</style>

```

### 历史记录管理

目标：构建搜索页的静态布局，完成历史记录的管理
需求分析：

1. 搜索历史基本渲染
2. 点击搜索 (添加历史)

添加历史说明：

点击搜索按钮或底下历史记录，都能进行搜索

1. 若之前没有相同搜索关键字，则直接追加到最前面
2. 若之前已有相同搜索关键字，将该原有关键字移除，再追加（相当于置顶）

```vue
<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <van-search v-model="search" @search="goSearch(search)" show-action placeholder="请输入搜索关键词" clearable>
      <template #action>
        <div @click="goSearch(search)">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div class="search-history" v-if=" historyList.length > 0" >
      <div class="title">
        <span>最近搜索</span>
        <van-icon name="delete-o" @click="clearHistory" size="16" />
      </div>
      <div class="list">
        <div class="list-item" v-for="item in historyList" :key="item" @click="goSearch(item)">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistory, setHistory } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  data () {
    return {
      search: '',
      historyList: getHistory()
    }
  },
  methods: {
    goSearch (searchContent) {
      // 判断输入的搜索词是否已经在historyList中
      const index = this.historyList.indexOf(searchContent)
      if (index !== -1) {
        // 说明存在，则将其进行删除
        this.historyList.splice(index, 1) // splice语法：splice(index, howMany, item1, ....., itemX)
      }
      // 将搜索词添加到historyList的最前面
      this.historyList.unshift(searchContent)
      setHistory(this.historyList)
      // 跳转到搜索列表页面
      this.$router.push(`/searchlist?search=${searchContent}`)
    },
    clearHistory () {
      this.historyList = []
      setHistory([])
    }
  }
}
</script>
...
```

持久化存储代码：

```js
const HISTORY_KEY = 'shopping_history_info'

// 获取搜索历史
export const getHistory = () => {
  const history = localStorage.getItem(HISTORY_KEY)
  return history ? JSON.parse(history) : []
}
// 设置搜索历史
export const setHistory = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}
```

### 搜索列表页

#### 静态布局

```vue
<template>
  <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <van-search
      readonly
      shape="round"
      background="#ffffff"
      value="手机"
      show-action
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
    <div class="sort-btns">
      <div class="sort-item">综合</div>
      <div class="sort-item">销量</div>
      <div class="sort-item">价格 </div>
    </div>

    <div class="goods-list">
      <GoodsItem v-for="item in 10" :key="item"></GoodsItem>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
export default {
  name: 'SearchIndex',
  components: {
    GoodsItem
  }
}
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .tool {
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;
    .sort-item {
      text-align: center;
      flex: 1;
      font-size: 16px;
    }
  }
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
```

#### 渲染

封装请求获取商品列表`api/product.js`

```js
import request from '../utils/request'

export const getProducts = (obj) => {
  const { sortType, sortPrice, categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      // all-按综合搜索(默认)，sales-按销量，price-按价格
      sortType,
      // 0-价格从低到高，1-价格从高到低
      sortPrice,
      // 分类id，示例值：0
      categoryId,
      // 商品名称，示例值：酒
      goodsName,
      // 页码，示例值：1
      page
    }
  })
}

```

基于搜索词进行渲染

```vue
<template>
  <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <van-search
      readonly
      shape="round"
      background="#ffffff"
      :value="queryParam"
      show-action
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
  <div class="sort-btns">
    <div
      class="sort-item"
      :class="{ active: currentSortType === 'all' }"
      @click="sortGoods('all')">综合</div>
    <div
      class="sort-item"
      :class="{ active: currentSortType === 'sales' }"
      @click="sortGoods('sales')">销量</div>
    <div
      class="sort-item"
      :class="{ active: currentSortType === 'price' }"
      @click="sortGoods('price')">价格</div>
  </div>

    <div class="goods-list">
      <GoodsItem v-for="item in productList" :key="item.goods_id" :goods="item"></GoodsItem>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getProducts } from '@/api/product'
export default {
  name: 'SearchIndex',
  components: {
    GoodsItem
  },
  computed: {
    // 从router的query中拿到查询参数
    queryParam () {
      // console.log(this.$route.query.search)
      // 如果查询参数不存在就返回一个空字符串
      return this.$route.query.search || ''
    }
  },
  async created () {
    // 获取商品列表数据
    const res = await getProducts({
      goodsName: this.queryParam
      // page: this.page
    })
    this.productList = res.data.list.data
    console.log(res.data.list)
  },
  data () {
    return {
      currentSortType: 'all',
      productList: [],
      page: 1
    }
  },
  methods: {
    // 排序商品
    async sortGoods (sortType) {
      // console.log(sortType)
      this.currentSortType = sortType // 更新当前选中的排序类型
      const res = await getProducts({
        goodsName: this.queryParam,
        sortType: sortType
      })
      this.productList = res.data.list.data
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .tool {
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;
    .sort-item {
      text-align: center;
      flex: 1;
      font-size: 16px;
    }
    .active { color: #ee0a24 }
  }
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>

```

#### 基于分类页面的分类id进行渲染

封装请求分类页数据`api/category.js`

```js
import request from '@/utils/request'

// 获取分类页数据
export const getCategoryData = () => {
  return request.get('/category/list')
}

```

完成分类页静态结构

```vue
<template>
  <div class="category">
    <!-- 分类 -->
    <van-nav-bar title="全部分类" fixed />

    <!-- 搜索框 -->
    <van-search
      readonly
      shape="round"
      background="#f1f1f2"
      placeholder="请输入搜索关键词"
      @click="$router.push('/search')"
    />

    <!-- 分类列表 -->
    <div class="list-box">
      <div class="left">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item v-for="(item, index) in list" :key="item.category_id" :title=item.name :class="{ active: index === activeKey }" @click="activeKey = index" href="javascript:;"/>
        </van-sidebar>
      </div>
      <div class="right">
        <div @click="$router.push(`/searchlist?categoryId=${item.category_id}`)" v-for="item in list[activeKey]?.children" :key="item.category_id" class="cate-goods">
          <img :src="item.image?.external_url" alt="">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategoryData } from '@/api/category'
export default {
  name: 'CategoryPage',
  created () {
    this.getCategoryList()
  },
  data () {
    return {
      activeKey: 0,
      list: [],
      activeIndex: 0
    }
  },
  methods: {
    async getCategoryList () {
      const { data: { list } } = await getCategoryData()
      this.list = list
      // console.log(this.list)
    }
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.category {
  padding-top: 100px;
  padding-bottom: 50px;
  height: 100vh;
  .list-box {
    height: 100%;
    display: flex;
    .left {
      width: 85px;
      height: 100%;
      background-color: #f3f3f3;
      overflow: auto;
      van-sidebar-item {
        display: block;
        height: 45px;
        line-height: 45px;
        text-align: center;
        color: #444444;
        font-size: 12px;
        &.active {
          color: #fb442f;
          background-color: #fff;
        }
      }
    }
    .right {
      flex: 1;
      height: 100%;
      background-color: #ffffff;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      padding: 10px 0;
      overflow: auto;

      .cate-goods {
        width: 33.3%;
        margin-bottom: 10px;
        img {
          width: 70px;
          height: 70px;
          display: block;
          margin: 5px auto;
        }
        p {
          text-align: center;
          font-size: 12px;
        }
      }
    }
  }
}

// 导航条样式定制
.van-nav-bar {
  z-index: 999;
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}
</style>

```

修改搜索页列表的查询参数

```js
<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getProducts } from '@/api/product'
export default {
  name: 'SearchIndex',
  components: {
    GoodsItem
  },
  computed: {
    // 从router的query中拿到查询参数
    querySearch () {
      // console.log(this.$route.query.search)
      // 如果查询参数不存在就返回一个空字符串
      return this.$route.query.search || ''
    },
    queryCategory () {
      return this.$route.query.categoryId || ''
    }
  },
  async created () {
    // 获取商品列表数据
    const res = await getProducts({
      categoryId: this.queryCategory,
      goodsName: this.querySearch
      // page: this.page
    })
    this.productList = res.data.list.data
    // console.log(res.data.list)
    // console.log(this.querySearch)
  },
  data () {
    return {
      currentSortType: 'all',
      productList: [],
      page: 1
    }
  },
  methods: {
    // 排序商品
    async sortGoods (sortType) {
      // console.log(sortType)
      this.currentSortType = sortType // 更新当前选中的排序类型
      const res = await getProducts({
        categoryId: this.queryCategory,
        goodsName: this.querySearch,
        sortType: sortType
      })
      this.productList = res.data.list.data
    }
  }
}
</script>
```



## 商品详情页

### 静态结构

```vue
<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥0.01</span>
          <span class="oldprice">￥6699.00</span>
        </div>
        <div class="sellcount">已售1001件</div>
      </div>
      <div class="msg text-ellipsis-2">
        三星手机 SAMSUNG Galaxy S23 8GB+256GB 超视觉夜拍系统 超清夜景 悠雾紫 5G手机 游戏拍照旗舰机s23
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 (5条)</div>
        <div class="right">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in 3" :key="item">
          <div class="top">
            <img src="http://cba.itlike.com/public/uploads/10001/20230321/a0db9adb2e666a65bc8dd133fbed7834.png" alt="">
            <div class="name">神雕大侠</div>
            <van-rate :size="16" :value="5" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content">
            质量很不错 挺喜欢的
          </div>
          <div class="time">
            2023-03-21 15:01:35
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc">
      <img src="https://uimgproxy.suning.cn/uimg1/sop/commodity/kHgx21fZMWwqirkMhawkAw.jpg" alt="">
      <img src="https://uimgproxy.suning.cn/uimg1/sop/commodity/0rRMmncfF0kGjuK5cvLolg.jpg" alt="">
      <img src="https://uimgproxy.suning.cn/uimg1/sop/commodity/2P04A4Jn0HKxbKYSHc17kw.jpg" alt="">
      <img src="https://uimgproxy.suning.cn/uimg1/sop/commodity/MT4k-mPd0veQXWPPO5yTIw.jpg" alt="">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div class="icon-cart">
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <div class="btn-add">加入购物车</div>
      <div class="btn-buy">立刻购买</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProDetail',
  data () {
    return {
      images: [
        'https://img01.yzcdn.cn/vant/apple-1.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg'
      ],
      current: 0
    }
  },
  methods: {
    onChange (index) {
      this.current = index
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100%!important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}
    
.tips {
  padding: 10px;
}
</style>

```

封装获取商品详情的请求模块`api/goodsDetail.js`

```js
import request from '@/utils/request'

// 获取商品详情
export const getGoodsDetail = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

```

获取的一个示例：

![image-20240830153951035](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408301539204.png)

于是进行动态渲染

### 商品说明动态渲染

改造template中对图片的渲染：

```vue
			<van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>
```

script部分如下：

```js
<script>
import { getGoodsDetail } from '@/api/goodsDetail'

export default {
  name: 'ProDetail',
  computed: {
    detailId () {
      return this.$route.params.id
    }
  },
  async created () {
    const goodsId = this.detailId
    const res = await getGoodsDetail(goodsId)
    // console.log(res)
    this.goodsObj = res.data.detail
    // console.log(this.goodsObj)
    this.images = this.goodsObj.goods_images
  },
  data () {
    return {
      goodsObj: {},
      images: [],
      current: 0
    }
  },
  methods: {
    onChange (index) {
      this.current = index
    }
  }
}
</script>
```

修改商品说明进行动态渲染：

```vue
<!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ goodsObj.goods_price_min }}</span>
          <span class="oldprice">￥{{ goodsObj.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ goodsObj.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ goodsObj.goods_name }}
      </div>
```

到这里还没有完成评论区的动态渲染

### 商品评论区渲染

封装请求获取商品评价详情的模块`api/goodsDetail.js`

```js
// 获取商品评价详情
export const getGoodsCommentDetail = (obj) => {
  const { scoreType, goodsId, page } = obj
  return request.get('/comment/list', {
    params: {
      scoreType,
      goodsId,
      page
    }
  })
}

```

请求解构：
![image-20240830161142137](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408301611303.png)

完成商品评价渲染（默认只展示三条评价）

```vue
<!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ goodsCommentArray.length }}条)</div>
        <div class="right" @click="$router.push(`/productComment?id=${detailId}`)">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="(item, index) in goodsCommentArray" :key="item.comment_id">
          <div class="top" v-if="index < 3">
            <img :src="item.user.avatar_url ? item.user.avatar_url : defaultAvatar" alt="">
            <div class="name">{{item.user.nick_name}}</div>
            <van-rate :size="16" :value="item.score" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content" v-if="index < 3">
            {{item.content}}
          </div>
          <div class="time" v-if="index < 3">
            {{item.create_time}}
          </div>
        </div>
      </div>
    </div>
```

在生命周期钩子created中：

```js
async created () {
    // 获取商品详情-说明部分
    const goodsId = this.detailId
    const res = await getGoodsDetail(goodsId)
    // console.log(res)
    this.goodsDetailObj = res.data.detail
    this.images = this.goodsDetailObj.goods_images

    // 获取商品详情-评价部分
    const commentRes = await getGoodsCommentDetail({
      scoreType: 10, // 默认抓取好评
      goodsId: goodsId,
      page: 1
    })
    this.goodsCommentArray = commentRes.data.list.data
  },
```

data提供：

```js
data () {
    return {
      defaultAvatar: 'https://.../coding/202408301648039.png',
      goodsDetailObj: {}, // 商品说明
      goodsCommentArray: {}, // 商品评价
      images: [],
      current: 0
    }
  },
```

现在剩下商品说明的图片未渲染、商品评论区未渲染

### 商品说明的图片渲染

![image-20240830174412273](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408310104868.png)
接口返回的数据中content就是商品详细说明的图：

![image-20240830174505655](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408310105026.png)

于是再于data中提供两个数据用于处理：

```js
imgSrcRegex: /<img[^>]+src="([^">]+)"/g, // 匹配接口数据html中的src图
imgSrcArray: [], // 商品详细介绍长图
```

再到created中编写：

```js
async created () {
    // 获取商品详情-说明部分
    ...

    // 获取商品详情-评价部分
   ...

    // 正则匹配得到商品详细介绍长图
    const htmlString = this.goodsDetailObj.content
    const srcArray = []
    const regex = /<img\s+[^>]*src="([^"]*)"/g

    let match
    while ((match = regex.exec(htmlString)) !== null) {
      srcArray.push(match[1]) // 将匹配到的 src URL 添加到数组中
    }
    this.imgSrcArray = srcArray
    // console.log(this.imgSrcArray) // 输出结果数组
  },
```

接下来就剩下完全的评价区渲染了。

## 商品评价区

这是一个新的页面所以直接新建了。`views/productdetail/evaluation.vue`

```vue
<template>
  <div class="goodsEvaluation">
    <van-nav-bar fixed title="商品评价页" left-arrow @click-left="$router.go(-1)" />

    <div class="comment-list">
      <div class="comment-item" v-for="item in goodsCommentArray" :key="item.comment_id">
        <div class="top">
          <img :src="item.user.avatar_url || defaultAvatar" alt="">
          <div class="name">{{item.user.nick_name}}</div>
          <van-rate :size="16" :value="item.score" color="#ffd21e" void-icon="star" void-color="#eee"/>
        </div>
        <div class="content">
          {{item.content}}
        </div>
        <div class="time">
          {{item.create_time}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGoodsCommentDetail } from '@/api/goodsDetail'
export default {
  name: 'GoodsEvaluation',
  computed: {
    detailId () {
      return this.$route.params.id
    }
  },
  async created () {
    try {
      const goodsId = this.detailId
      const commentRes = await getGoodsCommentDetail({
        scoreType: -1, // 全部评价
        goodsId
      })
      this.goodsCommentArray = commentRes.data.list.data
      console.log(this.goodsCommentArray)
    } catch (error) {
      console.error('Failed to fetch goods comments:', error)
      // 可以在这里添加更多的错误处理逻辑，比如显示错误提示
    }
  },
  data () {
    return {
      defaultAvatar: 'https://.../coding/202408301648039.png',
      goodsCommentArray: [] // 商品评价
    }
  }
}
</script>

<style lang="less" scoped>
.goodsEvaluation {
  padding-top: 46px;
  background-color: #f7f7f7;
  min-height: 100vh;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .comment-list {
    padding: 10px 15px;
  }
  .comment-item {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    font-size: 14px;
    line-height: 22px;
    .top {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
        border: 1px solid #eaeaea;
      }
      .name {
        font-weight: 600;
        color: #333;
        flex-grow: 1;
      }
      .van-rate {
        margin-left: auto;
      }
    }
    .content {
      color: #555;
      margin-bottom: 10px;
      white-space: normal;
      word-wrap: break-word;
    }
    .time {
      font-size: 12px;
      color: #999;
      text-align: right;
    }
  }
}
</style>

```

并转到router包下修改路由：

```js
  // 配置动态商品id，用于确认将来是哪个商品详情页
  { path: '/productdetail/:id', component: ProductDetail },
  { path: '/evaluation/:id', component: GoodsEvaluation },

  // 404页面，用于调试
  { path: '*', component: NotFound }
```



## 加入购物车/购买

该功能使用到弹层组件，可以在vant组件库中找到ActionSheet

页面代码如下：

```vue
<!-- 弹层 -->
    <van-action-sheet v-model="showPannel" :title="mode === 'cart' ? '加入购物车' : '立刻购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="goodsDetailObj.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice">{{ goodsDetailObj.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ goodsDetailObj.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          数字框占位
        </div>
        <!-- 有库存才显示可购买 -->
        <div class="showbtn" v-if="goodsDetailObj.stock_total > 0">
          <div class="btn" v-if="true">加入购物车</div>
          <div class="btn now" v-else>立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>
```

样式如下：

```less
// 弹层样式
.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn, .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}
```

data中提供两个数据：

```js
showPannel: false,
mode: 'cart', // 购物车或立即购买
```

methods中提供两个方法：

```js
addToCart () {
      this.showPannel = true
      this.mode = 'cart'
    },
    buyNow () {
      this.showPannel = true
      this.mode = 'buy'
    }
```

接下来还需要将弹层中的数量展示封装成数字框组件。

## 数字框组件封装

![image-20240831010611047](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408310106195.png)
分析：组件名CountBox

1. 静态结构，左中右三部分
2. 数字框的数字，应该是外部传递进来的(父传子)
3. 点击`+－`号，可以修改数字（子传父)
4. 使用`v-model`实现封装（`:value`和`@input`的简写）
5. 数字不能减到小于1

封装组件`components/CountBox.vue`

```vue
<template>
  <div class="count-box">
    <button @click="handleSub" class="minus">-</button>
    <input :value="value" @change="handleChange" class="inp" type="text">
    <button @click="handleAdd" class="add">+</button>
  </div>
</template>

    
<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleSub () {
      if (this.value <= 1) {
        return
      }
      this.$emit('input', this.value - 1)
    },
    handleAdd () {
      this.$emit('input', this.value + 1)
    },
    handleChange (e) {
      // console.log(e.target.value)
      const num = +e.target.value // 转数字处理 (1) 数字 (2) NaN

      // 输入了不合法的文本 或 输入了负值，回退成原来的 value 值
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }

      this.$emit('input', num)
    }
  }
}
</script>
    

<style lang="less" scoped>
.count-box {
  width: 110px;
  display: flex;
  .add, .minus {
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    background-color: #efefef;
  }
  .inp {
    width: 40px;
    height: 30px;
    outline: none;
    border: none;
    margin: 0 5px;
    background-color: #efefef;
    text-align: center;
  }
}
</style>

```

使用组件

```js
import CountBox from '@/components/CountBox.vue'

export default {
  name: 'ProDetail',
  components: {
    CountBox
  },
  data () {
    return {
      addCount: 1
      ...
    }
  },
}

<div class="num-box">
  <span>数量</span>
  <CountBox v-model="addCount"></CountBox>
</div>
```



## 加入购物车-判断登录状态

需要使用到vant的Dialog组件

```js
import { Dialog } from 'vant';

Dialog({ message: '提示' });
```

给弹层的加入购物车按钮绑定点击事件

```js
<div class="btn" v-if="this.mode === 'cart'" @click="addCart">加入购物车</div>
```

添加token鉴权判断，跳转携带回跳地址

```js
// 加入购物车判断登录状态
    addCart () {
      // console.log(this.$store.getters.token)
      if (!this.$store.getters.token) {
        // 说明没有token，没有token就需要提示登录
        this.$dialog.confirm({
          message: '当前操作需要登录后才能进行哦',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        }).then(() => {
          // 说明点击了去登录，需要带上backUrl
          this.$router.replace({
            path: '/login',
            query: {
              backUrl: this.$route.fullPath // 带上当前页面的全路径（包括查询参数）
            }
          })
        })
          .catch(() => {
            // 说明点击了再逛逛，不做任何操作
          })
      }
    }
```

登录后如果有回跳地址则replace地回跳回去：

```js
// 判断有无回跳地址
const url = this.$route.query.backUrl || '/'
this.$router.replace(url)
```

## `this.$router.replace`和`this.$router.push`的区别

假设有A、B、C三个页面。

我从A点击进入B页面，然后在B页面需要进行跳转到C页面，此时我触发的是`this.$router.replace`进行跳转，那么跳转到C之后C就会将B的访问记录完全覆盖。如果我在C页面的操作结束之后，进行返回上一页的操作，就会直接返回到A页面而不是B页面。

相对的，`this.$router.push`则会将记录保持，你的每次访问都是一个累加的过程，不会清除。

如果把页面比作真实的纸张，跳转的过程就像把我们手里的一张纸覆盖到桌子上的另一张纸上面一样，桌子上纸张堆的是已经访问过的页面，桌子上的纸张堆中最上面那一张就是我们现在正在访问的页面，而手里的是将要访问的页面。但覆盖的方式上述两种各有不同：`replace`会在覆盖桌子上的纸张之前将桌子上最上面的那一张丢到垃圾桶，然后再将手中的纸张覆盖上去；`push`则是简单的将纸张放在桌子上的纸张上面，不进行其他任何操作，最终你的访问记录都在桌子上。

## 加入购物车-封装接口进行请求

接口如下：

![image-20240830232641136](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408310106434.png)

封装加入购物车的请求接口模块`api/cart.js`

```js
// 加入购物车的请求
import request from '@/utils/request'

export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  // goodsId: 商品id, goodsNum: 商品数量, goodsSkuId: 商品规格id 如红色手机
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

```

由于需要携带请求头且携带的是鉴权信息，每次请求手动去写比较麻烦，所以直接在请求拦截器中携带`utils/request.js`

```js
import store from '@/store'

// 只要有token就在请求中携带，便于请求需要权限的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'h5'
  }
  return config
```

修改购物车渲染代码进行购物车内数量角标展示`views/productdetail/index.vue`

```vue
			<div class="icon-cart">
        <van-icon :badge="cartTotal || ''" name="shopping-cart-o" />
        <span>购物车</span>
      </div>
```

导入并将商品规格赋值给data数据

```js
import { addCart } from '@/api/cart'
...

async created () {
    // 获取商品详情-说明部分
    const goodsId = this.detailId
    const res = await getGoodsDetail(goodsId)
    // console.log(res)
    this.goodsDetailObj = res.data.detail
    // console.log(this.goodsDetailObj)
  
    this.goodsSkuId = this.goodsDetailObj.skuList[0].goods_sku_id // 得到商品规格id
  
    this.images = this.goodsDetailObj.goods_images // 得到商品轮播图
		...
}
```

提供data数据来接收必要信息

```js
addCount: 1, // 加入购物车的商品数量
goodsSkuId: 0, // 商品规格id
cartTotal: 0, // 购物车内商品总数
```

编写请求代码

```js
// 加入购物车判断登录状态
    async addCart () {
      ...
      
      // 说明有token，可以直接加入购物车
      const { data } = await addCart(this.detailId, this.addCount, this.goodsSkuId)
      this.cartTotal = data.cartTotal
      this.$toast('加入购物车成功！')
      this.showPannel = false // 关闭弹层
    }
  }
```



## 购物车页面

需求分析：

1. 基本静态结构 (快速实现）
2. 构建vuexcart模块，获取数据存储
3. 基于数据居动态渲染购物车列表
4. 封装getters实现动态统计
5. 全选反选功能
6. 数字框修改数量功能
7. 编辑切换状态，删除功能
8. 空购物车处理

### 静态页面

修改`layout/cart.vue`

使用到了vant的Checkbox, CheckboxGroup组件

```js
import { Checkbox, CheckboxGroup } from 'vant';

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
```

静态页面如下：

```vue
<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed />
    <!-- 购物车开头 -->
    <div class="cart-title">
      <span class="all">共<i>4</i>件商品</span>
      <span class="edit">
        <van-icon name="edit" />
        编辑
      </span>
    </div>

    <!-- 购物车列表 -->
    <div class="cart-list">
      <div class="cart-item" v-for="item in 10" :key="item">
        <van-checkbox></van-checkbox>
        <div class="show">
          <img src="http://cba.itlike.com/public/uploads/10001/20230321/a072ef0eef1648a5c4eae81fad1b7583.jpg" alt="">
        </div>
        <div class="info">
          <span class="tit text-ellipsis-2">新Pad 14英寸 12+128 远峰蓝 M6平板电脑 智能安卓娱乐十核游戏学习二合一 低蓝光护眼超清4K全面三星屏5GWIFI全网通 蓝魔快本平板</span>
          <span class="bottom">
            <div class="price">¥ <span>1247.04</span></div>
            <div class="count-box">
              <button class="minus">-</button>
              <input class="inp" :value="4" type="text" readonly>
              <button class="add">+</button>
            </div>
          </span>
        </div>
      </div>
    </div>

    <div class="footer-fixed">
      <div  class="all-check">
        <van-checkbox  icon-size="18"></van-checkbox>
        全选
      </div>

      <div class="all-total">
        <div class="price">
          <span>合计：</span>
          <span>¥ <i class="totalPrice">99.99</i></span>
        </div>
        <div v-if="true" class="goPay">结算(5)</div>
        <div v-else class="delete">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartPage'
}
</script>

<style lang="less" scoped>
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .show img {
      width: 100px;
      height: 100px;
    }
    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          span {
            font-size: 16px;
          }
        }
        .count-box {
          display: flex;
          width: 110px;
          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }
          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    .price {
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay, .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }

}
</style>
```

### 构建vuex cart模块

新建子模块cart：`@/store/modules/cart`

```js
import { getCartList } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      // 提供一个数组用于存储购物车列表
      cartList: []
    }
  },
  mutations: {
    // 提供方法可以设置购物车列表
    setCartList (state, newCartList) {
      state.cartList = newCartList
    }
  },
  actions: {
    // 异步获取购物车列表
    async getCartAction (context) {
      const { data } = await getCartList()

      // 由于后台返回数据中不包括是否选中的状态，所以本地自己维护，给每一项添加上被选中的状态
      data.list.forEach(element => {
        element.isChecked = true
      })
      context.commit('setCartList', data.list)
    }
  },
  getters: {}
}

```

到vuex中挂载：

```js
import Cart from '@/store/modules/cart'

	...
  modules: {
    User,
    Cart
  }
```

购物车页面中使用created调用actions异步

```js
  created () {
    // 判断是否登录
    if (this.$store.getters.token) {
      // 获取购物车数据
      this.$store.dispatch('Cart/getCartAction')
    }
```

### 动态渲染

接口地址：/cart/list

![image-20240831120141410](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202408311201545.png)

使用辅助函数映射数组：

```js
import { mapState } from 'vuex'

...

  computed: {
    ...mapState('Cart', ['cartList'])
  },
```

将template中对应的地方进行改造：

```vue
<div class="cart-list">
      <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
        <van-checkbox :value="item.isChecked"></van-checkbox>
        <div class="show">
          <img :src="item.goods.goods_image" alt="">
        </div>
        <div class="info">
          <span class="tit text-ellipsis-2">{{ item.goods.goods_name }}</span>
          <span class="bottom">
            <div class="price">¥ <span>{{ item.goods.goods_price_min }}</span></div>
            <CountBox :value="item.goods_num"></CountBox>
          </span>
        </div>
      </div>
    </div>
```

但未完成其他功能按钮等事件。

### 封装getters实现动态统计

- 合计商品数量

合计商品数量使用到getters

```js
  getters: {
    // 求所有的商品累加总数
    countCartTotal (state) {
      return state.cartList.reduce((sum, item, index) => sum + item.goods_num, 0)
    }
  }
```

[reduce函数的20个高级用法](https://segmentfault.com/a/1190000044748736)

- 合计价格
- 结算

最终完整结果：

```js
getters: {
    // 求所有的商品累加总数
    countCartTotal (state) {
      return state.cartList.reduce((sum, item, index) => sum + item.goods_num, 0)
    },
    // 选中的商品项目
    selectedCartList (state) {
      // filter只会接收回调结果为true的元素，所以可以不用做其他判断
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的商品项目数量
    selectedCartCount (state, getters) { // 这里的getters可以获取到上面定义的getters
      return Array.isArray(getters.selectedCartList) ? getters.selectedCartList.reduce((sum, item, index) => sum + item.goods_num, 0) : 0
    },
    // 选中的商品总价
    selectedPrice (state, getters) {
      // toFixed(2) 保留两位小数
      return Array.isArray(getters.selectedCartList) ? getters.selectedCartList.reduce((sum, item, index) => sum + item.goods_num * item.goods.goods_price_min, 0).toFixed(2) : 0
    }
  }
```

修改购物车页面的相关template

```vue
<span class="all">共<i>{{ countCartTotal }}</i>件商品</span>

...

<div class="all-total">
        <div class="price">
          <span>合计：</span>
          <span>¥ <i class="totalPrice">{{selectedPrice}}</i></span>
        </div>
        <div v-if="true" class="goPay" :class="{disabled: selectedCartCount === 0}">结算({{selectedCartCount}})</div>
        <div v-else class="delete" :class="{disabled: selectedCartCount === 0}">删除</div>
      </div>
```

### 全选反选

提供mutations便于修改state

```js
		...
    
    toggleChecked (state, id) {
      // 遍历购物车列表，找到对应id的商品，修改其选中状态
      state.cartList.forEach(item => {
        if (item.goods_id === id) {
          item.isChecked = !item.isChecked
        }
      })
    },
    allToggle (state, flag) {
      // 遍历购物车列表，修改所有商品的选中状态
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    }
```

给全选和商品选择框注册点击事件：

```vue
<van-checkbox @click="toggleChecked(item.goods_id)" :value="item.isChecked"></van-checkbox>

...

<div  class="all-check">
        <van-checkbox @click="allToggle" :value="isAllChecked" icon-size="18"></van-checkbox>
        全选
      </div>

...

methods: {
    toggleChecked (goodsId) {
      this.$store.commit('Cart/toggleChecked', goodsId)
    },
    allToggle () {
      this.$store.commit('Cart/allToggle', !this.isAllChecked)
    }
  },
```

辅助函数导入isAllChecked

```js
...mapGetters('Cart', ['countCartTotal', 'selectedCartList', 'selectedCartCount', 'selectedPrice', 'isAllChecked'])
```

### 数字框修改数量功能

提供更新购物车的接口模块：`api/cart.js`

```js
// 更新购物车商品
export const updateCart = (obj) => {
  const { goodsId, goodsNum, goodsSkuId } = obj
  return request.post('/cart/update', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

```

在vuex的cart子模块导入使用

```js
import { getCartList, updateCart } from '@/api/cart'

```

cart子模块增加修改商品数量的mutations方法

```js
changeCount (state, obj) {
      // 遍历购物车列表，找到对应id的商品，修改其数量
      const { goodsId, goodsNum, goodsSkuId } = obj
      state.cartList.forEach(item => {
        if (item.goods_id === goodsId && item.goods_sku_id === goodsSkuId) {
          item.goods_num = goodsNum
        }
      })
    }
```

cart子模块增加同步购物车到后台的actions方法

```js
// 将本地购物车列表同步到服务器（结算时优先调用）
    async syncCartAction (context) {
      // 接口只接受三个参数：goodsId、goodsNum、goodsSkuId，所以需要遍历本地购物车列表，将选中的商品拆分为三个参数
      const paramsObj = {}
      context.state.cartList.forEach(item => {
        if (item.isChecked) {
          paramsObj.goodsId = item.goods_id
          paramsObj.goodsNum = item.goods_num
          paramsObj.goodsSkuId = item.goods_sku_id
          updateCart(paramsObj)
        }
      })
      // 打印console提示，显示本地提交同步的参数对象
      console.log(paramsObj)
    }
```

给数量框组件添加绑定事件

```vue
<CountBox @input="changeCount(item.goods_id, $event, item.goods_sku_id)" :value="item.goods_num"></CountBox>
```

给结算按钮添加绑定事件

```vue
<div v-if="true" class="goPay" @click="goPay" :class="{disabled: selectedCartCount === 0}">结算({{selectedCartCount}})</div>
```

methods中提供相对应的方法

```js
changeCount (goodsId, e, goodsSkuId) {
      const obj = {
        goodsId: goodsId,
        goodsNum: e,
        goodsSkuId: goodsSkuId
      }
      this.$store.commit('Cart/changeCount', obj)
    },
    goPay () {
      // 先触发购物车与后台数据的同步
      this.$store.dispatch('Cart/syncCartAction')

      // 触发真正的结算
    }
```

真正的结算待做。

### 编辑切换状态，删除功能

点击编辑按钮，结算按钮变为删除按钮。

给购物车页面提供一个数据用于标识是否处于编辑状态

```js
  data () {
    return {
      isEdit: false
    }
  },
```

并监视其状态

```js
  watch: {
    isEdit (val) {
      if (val) {
        // 说明进入编辑状态
        this.$store.commit('Cart/allToggle', false)
      } else {
        // 说明退出编辑状态
        this.$store.commit('Cart/allToggle', true)
      }
    }
  }
```

相对应的对template中结算按钮和编辑按钮进行修改

```vue
<span class="edit" @click="isEdit = !isEdit">
  <van-icon name="edit" />
  编辑
</span>

...

</div>
	<div v-if="!isEdit" class="goPay" @click="goPay" :class="{disabled: selectedCartCount === 0}">结算({{selectedCartCount}})
</div>
```

删除功能待做。

### 删除商品

封装接口模块`api/cart.js`

```js
// 删除购物车商品
export const deleteSelected = (cartIds) => { // cartIds: 要删除的商品id数组
  return request.post('/cart/clear', {
    cartIds
  })
}
```

vuex子模块Cart提供异步方法

```js
// 删除选中的商品
    async delSelCartA (context) {
      // 获取选中的商品id然后进行删除
      const ids = context.getters.selectedCartList.map(item => item.id)
      // console.log(ids)
      deleteSelected(ids)
      Toast('删除成功')

      // 删除后重新拉取购物车数据
      context.dispatch('getCartAction')
    }
```

接着修复了一些小bug：商品详情页初始不显示购物车数量、添加到购物车之后数量不会自动更新、购物车页面编辑状态退出后按钮未恢复到结算按钮。下面是修复后的`store/modules/cart.js`和`views/productdetail.vue`

```js
import { getCartList, updateCart, deleteSelected, addCart } from '@/api/cart'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      // 提供一个数组用于存储购物车列表
      cartList: []
    }
  },
  mutations: {
    // 提供方法可以设置购物车列表
    setCartList (state, newCartList) {
      state.cartList = newCartList
    },
    // 修改商品选中状态
    toggleChecked (state, id) {
      // 遍历购物车列表，找到对应id的商品，修改其选中状态
      state.cartList.forEach(item => {
        if (item.goods_id === id) {
          item.isChecked = !item.isChecked
        }
      })
    },
    // 全选和反选
    allToggle (state, flag) {
      // 遍历购物车列表，修改所有商品的选中状态
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    // 改变商品数量
    changeCount (state, obj) {
      // 遍历购物车列表，找到对应id的商品，修改其数量
      const { goodsId, goodsNum, goodsSkuId } = obj
      state.cartList.forEach(item => {
        if (item.goods_id === goodsId && item.goods_sku_id === goodsSkuId) {
          item.goods_num = goodsNum
        }
      })
    }
  },
  actions: {
    // 添加商品到购物车
    async addCartAction (context, obj) {
      // 先判断是否已经存在该商品，如果存在，则只修改商品数量
      const { goodsId, goodsNum, goodsSkuId } = obj
      context.state.cartList.forEach(item => {
        if (item.goods_id === goodsId && item.goods_sku_id === goodsSkuId) {
          item.goods_num += goodsNum
        }
      })
      // 如果不存在，则添加到购物车列表
      await addCart(goodsId, goodsNum, goodsSkuId)
      await context.dispatch('getCartAction') // 重新拉取购物车信息
      Toast('添加成功')
    },

    // 异步获取购物车列表
    async getCartAction (context) {
      const { data } = await getCartList()

      // 由于后台返回数据中不包括是否选中的状态，所以本地自己维护，给每一项添加上被选中的状态
      data.list.forEach(element => {
        element.isChecked = true
      })
      context.commit('setCartList', data.list)
    },

    // 将本地购物车列表同步到服务器（结算或者离开购物车页面立刻同步）
    async syncCartAction (context) {
      // 接口只接受三个参数：goodsId、goodsNum、goodsSkuId，所以需要遍历本地购物车列表，将选中的商品拆分为三个参数
      const paramsObj = {}
      context.state.cartList.forEach(item => {
        if (item.isChecked) {
          paramsObj.goodsId = item.goods_id
          paramsObj.goodsNum = item.goods_num
          paramsObj.goodsSkuId = item.goods_sku_id
          updateCart(paramsObj)
        }
      })
      // console.log(paramsObj)
    },

    // 删除选中的商品
    async delSelCartA (context) {
      // 获取选中的商品id然后进行删除
      const ids = context.getters.selectedCartList.map(item => item.id)
      // console.log(ids)
      deleteSelected(ids)
      Toast('删除成功')

      // 删除后重新拉取购物车数据
      context.dispatch('getCartAction')
    }
  },
  getters: {
    // 求所有的商品累加总数
    countCartTotal (state) {
      return state.cartList.reduce((sum, item, index) => sum + item.goods_num, 0)
    },
    // 选中的商品项目
    selectedCartList (state) {
      // filter只会接收回调结果为true的元素，所以可以不用做其他判断
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的商品项目数量
    selectedCartCount (state, getters) { // 这里的getters可以获取到上面定义的getters
      return Array.isArray(getters.selectedCartList) ? getters.selectedCartList.reduce((sum, item, index) => sum + item.goods_num, 0) : 0
    },
    // 选中的商品总价
    selectedPrice (state, getters) {
      // toFixed(2) 保留两位小数
      return Array.isArray(getters.selectedCartList) ? getters.selectedCartList.reduce((sum, item, index) => sum + item.goods_num * item.goods.goods_price_min, 0).toFixed(2) : 0
    },
    // 是否全选
    isAllChecked (state) {
      // every返回true，说明数组中每一项都为true，否则为false
      return state.cartList.every(item => item.isChecked)
    }
  }
}

```

商品详情页增加：

```js
import { mapGetters, mapActions } from 'vuex'  

...
computed: {
    ...mapGetters('Cart', ['countCartTotal']),
    ...mapActions('Cart', ['getCartAction']),
    detailId () {
      return this.$route.params.id
    }
  },
    
...

let match  // 此为created内
    while ((match = regex.exec(htmlString)) !== null) {
      srcArray.push(match[1]) // 将匹配到的 src URL 添加到数组中
    }
    this.imgSrcArray = srcArray
    // console.log(this.imgSrcArray) // 输出结果数组

    // 异步获取购物车列表
    await this.getCartAction
    // 获取购物车商品总数
    this.cartTotal = this.countCartTotal
    // console.log(this.cartTotal)


...

// 说明有token，可以直接加入购物车
      const obj = { // 此为添加到购物车的点击事件
        goodsId: this.detailId,
        goodsNum: this.addCount,
        goodsSkuId: this.goodsSkuId
      }
      this.$store.dispatch('Cart/addCartAction', obj)
      // 获取购物车商品总数
      this.cartTotal = this.countCartTotal
      this.$toast('加入购物车成功！')
      this.showPannel = false // 关闭弹层

...


  watch: {
    // 监听 countCartTotal 的变化，自动更新 cartTotal
    countCartTotal (newVal) {
      this.cartTotal = newVal
    }
  }
```

### 空购物车处理

将除标题以外的盒子用大盒子包裹起来：

```vue
<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed />
    <!-- 判断登录，且购物车列表不为空才渲染 -->
    <div v-if="isLogin && cartList.length > 0">
    ...  
  </div>
    <!-- 未登录或购物车列表为空时渲染提示页面 -->
    <van-empty v-else description="空空如也，快去逛逛吧~">
      <van-button round type="danger" class="bottom-button" @click="$router.push('/home')">去逛逛</van-button>
    </van-empty>
```

并提供计算属性

```js
    isLogin () {
      return this.$store.getters.token
    }
```

并引入对应Empty组件的css样式

```css
.bottom-button {
    width: 160px;
    height: 40px;
}
```

## 地址管理

> 地址选择里面涉及到一个地区选择器，可以自行定义数据也可以使用官方的数据。可以参考：Vant使用[Vant Area Data](https://blog.csdn.net/qq_51055690/article/details/126281265)

### 配置

封装api接口：`api/address.js`

```js
import request from '@/utils/request'

// 获取地址列表
export const getAddressList = () => {
  return request.get('/address/list')
}

// 获取某个地址的详情
export const getAddressDetail = (addressId) => {
  return request.get('/address/detail', {
    params: {
      addressId: addressId
    }
  })
}

// 添加收货地址
export const addAddress = (dataObj) => {
  // console.log('api_dataObj', dataObj)
  // 直接使用dataObj中的数据
  return request.post('/address/add', {
    form: {
      name: dataObj.name,
      phone: dataObj.phone,
      region: dataObj.region,
      detail: dataObj.detail
    }
  })
}

// 更新收货地址
export const updateAddress = (dataObj) => {
  // 直接使用dataObj中的数据
  return request.post('/address/edit', {
    addressId: dataObj.address_id,
    form: dataObj.form
  })
}

// 设置默认地址
export const setDefaultAddress = (addressId) => {
  return request.post('/address/setDefault', { addressId })
}

// 删除收货地址
export const deleteAddress = (addressId) => {
  return request.post('/address/remove', { addressId })
}

```

Vuex子模块：`store/modules/address.js`

```js
import { getAddressList, updateAddress, deleteAddress, getAddressDetail, addAddress, setDefaultAddress } from '@/api/address'
// import {Toast} from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      AddressList: [],
      // 初始化时从 localStorage 中获取默认地址 ID
      defaultAddressId: localStorage.getItem('defaultAddressId') || ''
    }
  },
  mutations: {
    // 编辑地址
    editAddress (state, newAddress) {
      this.AddressList = newAddress
    },
    // 更新默认地址的 ID 并保存到 localStorage
    setDefaultAddressId (state, addressId) {
      state.defaultAddressId = addressId
      localStorage.setItem('defaultAddressId', addressId) // 保存到 localStorage
    }
  },
  actions: {
    // 获取地址列表
    async getAddressList () {
      const { data } = await getAddressList()
      return data
    },

    // 获取某个地址的详情
    async getAddressDetail (context, addressId) {
      if (!addressId) {
        throw new Error('Address ID is required')
      }
      // console.log('getAddressDetail被调用，addressId：', addressId)
      const data = await getAddressDetail(addressId)
      // console.log('getAddressDetail返回的数据：', data)
      return data
    },

    // 添加地址
    async addAddress (context, dataObj) {
      console.log('vuex_dataObj:', dataObj)
      const res = await addAddress(dataObj)
      if (res.status === 200) {
        // 成功后，重新通过上面的actions方法拉取地址列表
        context.dispatch('getAddressList')
      }
    },

    // 设置默认地址(无用的接口，设置后拉取列表，其中不包含默认地址是否设置的状态)
    async setDefaultAddress (context, addressId) {
      // 发送请求
      await setDefaultAddress(addressId)

      // 成功后，重新拉取地址列表
      getAddressList()
    },

    // 更新地址
    async updateAddress (context, dataObj) {
      // 发送更新请求
      await updateAddress(dataObj)

      // 更新之后，重新拉取地址列表
      getAddressList()
    },

    // 删除地址
    async deleteAddress (context, addressId) {
      // 发送删除请求
      await deleteAddress(addressId)

      // 删除成功后，重新拉取地址列表
      getAddressList()
    }
  },
  getters: {
    // 获取默认地址 ID（优先从 Vuex 中获取，否则从 localStorage 中获取）
    getDefaultAddressId: (state) =>
      state.defaultAddressId || localStorage.getItem('defaultAddressId')
  }
}

```

Vuex子模块addressMap处理引入的vant官方地区数据：`store/modules/addressMap.js`

```js
import { areaList } from '@vant/area-data'

const state = {
  // 代码到名称的映射
  codeToNameMap: {
    provinceMap: {},
    cityMap: {},
    countyMap: {}
  },
  // 名称到代码的映射
  nameToCodeMap: {
    provinceMap: {},
    cityMap: {},
    countyMap: {}
  }
}

const getters = {
  // 根据名称获取代码
  nameToCode: (state) => (name) => {
    return (
      state.nameToCodeMap.provinceMap[name] ||
      state.nameToCodeMap.cityMap[name] ||
      state.nameToCodeMap.countyMap[name] ||
      null
    )
  },
  // 根据代码获取名称
  codeToName: (state) => (code) => {
    return (
      state.codeToNameMap.provinceMap[code] ||
      state.codeToNameMap.cityMap[code] ||
      state.codeToNameMap.countyMap[code] ||
      null
    )
  }
}

const mutations = {
  SET_CODE_TO_NAME_MAP (state, { map, type }) {
    state.codeToNameMap[type] = map
  },
  SET_NAME_TO_CODE_MAP (state, { map, type }) {
    state.nameToCodeMap[type] = map
  }
}

const actions = {
  // 构建映射表
  buildReverseMaps ({ commit }) {
    const provinceCodeToNameMap = buildCodeToNameMap(areaList.province_list)
    const cityCodeToNameMap = buildCodeToNameMap(areaList.city_list)
    const countyCodeToNameMap = buildCodeToNameMap(areaList.county_list)

    const provinceNameToCodeMap = buildNameToCodeMap(areaList.province_list)
    const cityNameToCodeMap = buildNameToCodeMap(areaList.city_list)
    const countyNameToCodeMap = buildNameToCodeMap(areaList.county_list)

    commit('SET_CODE_TO_NAME_MAP', { map: provinceCodeToNameMap, type: 'provinceMap' })
    commit('SET_CODE_TO_NAME_MAP', { map: cityCodeToNameMap, type: 'cityMap' })
    commit('SET_CODE_TO_NAME_MAP', { map: countyCodeToNameMap, type: 'countyMap' })

    commit('SET_NAME_TO_CODE_MAP', { map: provinceNameToCodeMap, type: 'provinceMap' })
    commit('SET_NAME_TO_CODE_MAP', { map: cityNameToCodeMap, type: 'cityMap' })
    commit('SET_NAME_TO_CODE_MAP', { map: countyNameToCodeMap, type: 'countyMap' })
  }
}

// 构建代码到名称的映射
function buildCodeToNameMap (list) {
  const map = {}
  Object.keys(list).forEach(code => {
    map[code] = list[code] // 代码作为键，名称作为值
  })
  return map
}

// 构建名称到代码的映射
function buildNameToCodeMap (list) {
  const map = {}
  Object.keys(list).forEach(code => {
    map[list[code]] = code // 名称作为键，代码作为值
  })
  return map
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

```

配置路由并新增守卫规则：`router/index.js`

```js
import Address from '@/views/address/index.vue'
import AddressEdit from '@/views/address/edit.vue'

...

  { path: '/address/manage', component: Address },
  { path: '/address/edit', component: AddressEdit },
  
...

// 定义数组存储需要登录才能访问的路由
const authNeedRouters = ['/myorder', '/pay', '/address', '/address/edit', '/address/manage']

```

### 地址列表

地址列表代码：`views/address/index.vue`

```vue
<template>
  <div class="address-list">
    <van-nav-bar fixed title="地址列表" left-arrow @click-left="$router.go(-1)" />
    <div v-if="list.length > 0">
      <!-- 用于区分的文字 -->
      <div class="address-list-header">
        <p class="header-text">请选择或管理收货地址</p>
      </div>

      <!-- 地址列表 -->
      <van-address-list
        v-model="chosenAddressId"
        :switchable="true"
        :list="list"
        :disabled-list="disabledList"
        :disabled-text="disabledText"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      />
    </div>
    <van-empty v-else description="空空如也">
      <van-button round type="danger" class="bottom-button" @click="onAdd">添加地址</van-button>
    </van-empty>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AddressList',
  data () {
    return {
      // 默认选中的地址id
      chosenAddressId: '',
      // 地址列表
      list: [],
      // 禁用状态的地址列表（超出快递范围）
      disabledList: []
    }
  },
  computed: {
    ...mapGetters('AddressMap', ['codeToName']),
    ...mapGetters('Address', ['getDefaultAddressId']),
    disabledText () {
      return this.disabledList.length > 0 ? '以下地址超出配送范围' : ''
    }
  },
  async created () {
    try {
      // 构建地区映射表
      await this.buildReverseMaps()

      // 获取地址列表
      const response = await this.getAddressList()
      // console.log('获取地址列表成功：', response)
      const addressData = response.list || []
      // console.log('地址数据：', addressData)

      // 格式化地址列表数据
      this.list = addressData
        .filter((item) => !item.is_disabled) // 过滤掉禁用的地址
        .map((item) => ({
          id: item.address_id,
          name: item.name,
          tel: item.phone,
          address: this.formatAddress(item),
          isDefault: item.is_default || false
        }))

      // 从Vuex中获取默认地址的id
      const defaultAddressId = this.getDefaultAddressId
      console.log('默认地址id：', defaultAddressId)

      if (Number(defaultAddressId) !== -1) {
        // 遍历比对列表每一项的id是否与defaultAddressId相等，找到后返回索引（强等于比较，注意类型）
        const defaultIndex = this.list.findIndex((item) => Number(item.id) === Number(defaultAddressId))
        if (Number(defaultIndex) !== -1) {
          // 找到后设置为默认地址
          this.list[defaultIndex].isDefault = true
          this.chosenAddressId = Number(defaultAddressId)
        }
      } else {
        // Vuex没有默认地址，则默认选中第一个地址
        Toast('小主还没有默认地址哦\n快来设置一个吧❤️')
        console.log('未找到有效的默认地址')
        this.chosenAddressId = this.list[0].id || ''
      }
      // 设置禁用的地址列表
      this.disabledList = addressData
        .filter((item) => item.is_disabled)
        .map((item) => ({
          id: item.address_id,
          name: item.name,
          tel: item.phone,
          address: this.formatAddress(item),
          isDefault: item.is_default || false
        }))
    } catch (error) {
      // console.error('获取地址列表失败：', error)
      Toast.fail('获取地址列表失败')
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressList']),
    ...mapActions('AddressMap', ['buildReverseMaps']),
    // 格式化地址：
    formatAddress (item) {
      const provinceName = this.codeToName(item.province_id) || ''
      const cityName = this.codeToName(item.city_id) || ''
      const countyName = this.codeToName(item.county_id) || ''
      const detailAddress = item.detail || ''
      const result = `${provinceName}${cityName}${countyName}${detailAddress}`
      // console.log('codeToname：', this.codeToName(item.province_id))
      return result
    },
    onAdd () {
      this.$router.push('/address/edit?adsid=')
    },
    onEdit (item) {
      // console.log('跳转到编辑：', item)
      this.$router.push(`/address/edit?adsid=${item.id}`)
    }
  }
}
</script>

<style scoped lang="less">
.custom-nav-bar {
  background-color: #ffffff; // 导航栏背景色
  height: 50px; // 设置导航栏的高度
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // 添加阴影效果
}

.address-list {
  padding-top: 60px; // 增加顶部内边距，以避免内容被导航栏遮挡
}

.address-list-header {
  padding: 10px 16px;
  background-color: #f8f8f8;
}

.header-text {
  font-size: 16px;
  color: #333;
  text-align: left;
  margin: 0;
}

/* 地址列表项样式 */
.van-address-list__item {
  margin-bottom: 10px; // 每一项之间的间距
  padding: 10px 16px; // 内边距，使内容不贴边
  border: 1px solid #ddd; // 边框颜色
  border-radius: 4px; // 圆角边框
  background-color: #fff; // 背景色

  .van-cell__title, .van-cell__label {
    white-space: normal; // 允许内容换行
    word-wrap: break-word; // 自动换行
    word-break: break-all; // 长单词换行
  }
}

/* 禁用状态的地址项样式 */
.van-address-list__item--disabled {
  background-color: #f5f5f5; // 禁用项的背景色
  color: #999; // 禁用项的文字颜色
}
</style>

```

### 地址编辑

地址编辑可以是新建也可以是更新操作：`views/address/edit.vue`

```vue
<template>
  <!-- 可编辑也可以作为添加地址的页面 -->
  <div class="address-list">
    <van-nav-bar fixed title="地址编辑" left-arrow @click-left="$router.go(-1)" />

    <div class="address-edit">
      <van-address-edit
        :address-info="addressInfo"
        :area-list="areaList"
        show-delete
        :show-set-default="this.adsId != -1 ? true : false"
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        :detail-maxlength="20"
        @save="onSave"
        @delete="onDelete"
        @change-default="onChangeDefault"
      />
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapActions, mapGetters } from 'vuex'
import { areaList } from '@vant/area-data' // 引入vant官方的地区数据

export default {
  name: 'AddressEdit',
  data () {
    return {
      adsId: 0, // 地址id
      addressInfo: {}, // 初始地址详情对象，若是新建地址则为空对象
      areaList: areaList, // 地区列表
      searchResult: [], // 详细地址搜索结果
      checkDefault: false // 默认地址的标识，数据内的isDefault会随着设置按钮而改变，此字段标识数据原始状态
    }
  },
  computed: {
    ...mapGetters('AddressMap', ['nameToCode', 'codeToName']),
    // 获取要进行编辑的地址id，如果为空则赋值为-1表示为新建地址
    getAdsId () {
      return this.$route.query.adsid || -1
    }
  },
  async created () {
    // 构建映射表
    await this.buildReverseMaps()

    // 获取要进行编辑的地址id，如果为空则赋值为-1表示为新建地址
    this.adsId = this.getAdsId
    // console.log('adsId:', this.adsId)

    // 如果adsId不等于-1，则进行地址详情的拉取
    if (this.adsId !== -1) {
      // 说明是编辑地址，则需要拉取地址详情
      const { data: { detail } } = await this.getAddressDetail(this.adsId)
      this.addressInfo = {
        id: detail.address_id,
        name: detail.name,
        tel: detail.phone,
        province: this.codeToName(detail.province_id) || '',
        city: this.codeToName(detail.city_id) || '',
        county: this.codeToName(detail.county_id) || '',
        addressDetail: detail.detail,
        areaCode: String(detail.region_id),
        isDefault: this.isDefault
      }
      // 从Vuex得到默认地址的id
      const defaultAddressId = this.$store.state.Address.defaultAddressId
      // 比对当前地址是否为默认地址
      if (Number(defaultAddressId) === Number(detail.address_id)) {
        console.log('当前地址为默认地址')
        this.addressInfo.isDefault = true // 设置默认按钮为打开状态
        this.checkDefault = true // 为真说明该地址获取的时候就是默认地址
      } else {
        // 说明当前地址不是默认地址
        console.log('当前地址不是默认地址')
        this.addressInfo.isDefault = false // 设置默认按钮为关闭状态
        this.checkDefault = false // 为假说明该地址获取的时候不是默认地址
      }
    } else {
      // 说明是新建地址，不做操作
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressDetail', 'addAddress', 'updateAddress']),
    ...mapActions('AddressMap', ['buildReverseMaps']),

    // 保存地址
    async onSave (content) {
      // 判断是新建地址还是编辑地址
      if (this.adsId === -1) {
        // 新建地址
        content.country = '中国'
        this.addressInfo = content

        // 使用映射表进行地区数据处理
        const region = [
          {
            value: Number(this.nameToCode(content.province)) || '',
            label: content.province
          },
          {
            value: Number(this.nameToCode(content.city)) || '',
            label: content.city
          },
          {
            value: Number(this.nameToCode(content.county)) || '',
            label: content.county
          }
        ]

        // 封装数据对象
        const dataObj = {
          name: this.addressInfo.name,
          phone: this.addressInfo.tel,
          region: region,
          detail: this.addressInfo.addressDetail
        }

        // 调用接口进行地址的保存
        await this.addAddress(dataObj)
        Toast('保存成功')
        this.$router.replace({ path: '/address/manage' }) // 保存成功后返回地址列表页面
      } else {
        // 编辑地址
        // console.log('编辑地址的content:', content)
        this.addressInfo = content
        // 封装对象，用于发送请求
        const dataObj = {
          address_id: this.addressInfo.id,
          form: {
            name: this.addressInfo.name,
            phone: this.addressInfo.tel,
            region: [
              {
                label: this.addressInfo.province,
                value: Number(this.nameToCode(this.addressInfo.province)) || ''
              },
              {
                label: this.addressInfo.city,
                value: Number(this.nameToCode(this.addressInfo.city)) || ''
              },
              {
                label: this.addressInfo.county,
                value: Number(this.nameToCode(this.addressInfo.county)) || ''
              }
            ],
            detail: this.addressInfo.addressDetail
          }
        }
        // console.log('dataObj:', dataObj)
        await this.updateAddress(dataObj)
        Toast('保存成功')

        // 处理默认地址的标识问题
        if (this.checkDefault) { // 为真说明当前编辑的是默认地址
          console.log('当前是默认地址，content:', content)
          console.log('当前是默认地址，this.adressInfo:', this.addressInfo)

          if (content.isDefault !== this.checkDefault) {
            // 说明用户取消了这个默认地址，需要将Vuex的默认地址id赋值为-1
            this.$store.commit('Address/setDefaultAddressId', -1)
          }
          // 否则什么也不做
        } else {
          // 说明当前编辑的不是默认地址
          console.log('当前不是默认地址，content:', content)
          console.log('当前不是默认地址，this.adressInfo:', this.addressInfo)

          if (content.isDefault !== this.checkDefault) {
            // 说明用户将当前不是默认地址的地址设置为默认地址
            this.$store.commit('Address/setDefaultAddressId', this.addressInfo.id)
          }
          // 否则什么也不做
        }

        // 处理完成后跳转会地址列表页
        this.$router.replace({ path: '/address/manage' })
      }
    },
    async onDelete () {
      // 判断是否删除的是默认地址，如果是，则将Vuex的默认地址id赋值为-1
      if (this.checkDefault) {
        this.$store.commit('Address/setDefaultAddressId', -1)
        console.log('删除默认地址, Vuex的默认地址id:', this.$store.state.Address.defaultAddressId)
      }
      await this.$store.dispatch('Address/deleteAddress', this.addressInfo.id)
      Toast('删除成功')
      setTimeout(() => {
        this.$router.replace('/address/manage')
      }, 1000)
    },
    // 设置默认地址
    onChangeDefault (val) {
      // console.log(val)
      // 只有编辑才可以设置默认地址
      this.addressInfo.isDefault = val
      console.log('设置默认地址的按钮被触发, this.addressInfo.isDefault:', this.addressInfo.isDefault)
    }
  }
}
</script>

<style scoped lang="less">
.address-list {
  padding-top: 60px; /* 增加与导航栏等高的内边距，避免内容被导航栏覆盖 */
}

.address-edit {
  padding: 10px 16px; /* 给地址编辑区域增加一些内边距，使内容不贴边 */
  background-color: #fff; /* 设置背景色为白色 */
}
</style>

```

导入vant组件略过。

## 订单结算台

### 静态结构

```vue
<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.go(-1)" />

    <!-- 地址相关 -->
    <div class="address">

      <div class="left-icon">
        <van-icon name="logistics" />
      </div>

      <div class="info" v-if="true">
        <div class="info-content">
          <span class="name">小红</span>
          <span class="mobile">13811112222</span>
        </div>
        <div class="info-address">
          江苏省 无锡市 南长街 110号 504
        </div>
      </div>

      <div class="info" v-else>
        请选择配送地址
      </div>

      <div class="right-icon">
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 订单明细 -->
    <div class="pay-list">
      <div class="list">
        <div class="goods-item">
            <div class="left">
              <img src="http://cba.itlike.com/public/uploads/10001/20230321/8f505c6c437fc3d4b4310b57b1567544.jpg" alt="" />
            </div>
            <div class="right">
              <p class="tit text-ellipsis-2">
                 三星手机 SAMSUNG Galaxy S23 8GB+256GB 超视觉夜拍系统 超清夜景 悠雾紫 5G手机 游戏拍照旗舰机s23
              </p>
              <p class="info">
                <span class="count">x3</span>
                <span class="price">¥9.99</span>
              </p>
            </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 12 件商品，合计：</span>
        <span class="money">￥1219.00</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥1219.00</span>
        </div>

        <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
        </div>

        <div class="pay-cell">
          <span>配送费用：</span>
          <span v-if="false">请先选择配送地址</span>
          <span v-else class="red">+￥0.00</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span><van-icon name="balance-o" />余额支付（可用 ¥ 999919.00 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="buytips">
        <textarea placeholder="选填：买家留言（50字内）" name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥999919</span></div>
      <div class="tipsbtn">提交订单</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayIndex',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}
.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}
.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
</style>

```

### 渲染

```vue
<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.go(-1)" />

    <!-- 地址相关 -->
    <div class="address">

      <div class="left-icon">
        <van-icon name="logistics" />
      </div>

      <div class="info" v-if="addressList.length > 0">
        <div class="info-content">
          <span class="name">{{ chosenAddress.name }} </span>
          <span class="mobile">{{ chosenAddress.phone }}</span>
        </div>
        <div class="info-address">
          {{ regionName.province }} {{ regionName.city }} {{ regionName.county }} {{ chosenAddress.detail }}
        </div>
      </div>

      <div class="info" v-else>
        还没有地址哦，点击右侧按钮添加吧
      </div>

      <div class="right-icon" @click="$router.push('/address/manage')">
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 订单明细 -->
    <div class="pay-list">
      <div class="list">
        <div class="goods-item" v-for="item in cartList" :key="item.id">
            <div class="left">
              <img :src="item.goods.goods_image" alt="" />
            </div>
            <div class="right">
              <p class="tit text-ellipsis-2">
                 {{ item.goods.goods_name }}
              </p>
              <p class="info">
                <span class="count">共{{ item.goods_num }}件</span>
                <span class="price">¥{{item.goods.goods_price_min * item.goods_num}}</span>
              </p>
            </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{selectedCartCount()}} 件商品，合计：</span>
        <span class="money">￥{{selectedPrice()}}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥{{selectedPrice()}}</span>
        </div>

        <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
        </div>

        <div class="pay-cell">
          <span>配送费用：</span>
          <span v-if="false">请先选择配送地址</span>
          <span v-else class="red">+￥0.00</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span><van-icon name="balance-o" />余额支付（可用 ¥ 999919.00 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="buytips">
        <textarea placeholder="选填：买家留言（50字内）" name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥{{selectedPrice()}}</span></div>
      <div class="tipsbtn" @click="$router.push('/order/confirm')">提交订单</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PayIndex',
  async created () {
    // 构建地区映射表
    await this.buildReverseMaps()

    // 处理购物车详情展示
    // 拉取购物车列表
    await this.getCartAction()
    this.cartList = this.selectedCartList()
    console.log('购物车列表：', this.cartList)

    // 获取地址列表
    const { list } = await this.getAddressList()
    this.addressList = list
    console.log('地址列表：', this.addressList)

    // 从Vuex中获取默认地址的id
    const defaultAddressId = this.getDefaultAddressId()
    console.log('默认地址id：', defaultAddressId)

    if (this.addressList.length > 0) {
      // 如果有地址查询参数?adsid，则说明进行了地址切换
      console.log('地址切换参数：', this.getadsid)
      if (this.getadsid) {
        // chosenAddress被赋值为切换的id的地址
        const address = this.addressList.find(item => String(item.address_id) === String(this.getadsid))
        this.chosenAddress = address
        console.log('切换后的地址：', this.chosenAddress)
      } else {
        // 如果没有地址切换参数，则说明没有切换地址
        if (Number(defaultAddressId) !== -1) {
          // 遍历比对列表每一项的id是否与defaultAddressId相等，找到后返回索引（强等于比较，注意类型）
          const defaultIndex = this.addressList.findIndex((item) => String(item.address_id) === String(defaultAddressId))
          // console.log('默认地址索引：', defaultIndex)
          if (Number(defaultIndex) !== -1) {
            // 找到后将数组数据转对象赋值给chosenAddress属性
            this.chosenAddress = this.addressList[defaultIndex]

            // 处理地址Code转为Name
            const regionId = String(this.chosenAddress.region_id)
            // 调用 getFullAddressInfo 方法
            this.regionName = await this.fetchFullAddressName(regionId)
          } else {
            console.log('未找到有效的默认地址索引')
          }
        } else {
          // Vuex没有默认地址，则默认选中第一个地址
          // 设置chosenAddress属性为addressList的第一个地址
          this.chosenAddress = this.addressList[0]
          const regionId = String(this.chosenAddress.region_id)
          this.regionName = await this.fetchFullAddressName(regionId)
          console.log('无默认地址，展示数据chosenAddress：', this.chosenAddress)
        }
      }
    }
  },
  data () {
    return {
      addressList: [], // 地址列表
      chosenAddress: {}, // 被选择进行展示的地址
      regionName: {}, // 将地址Code转为Name
      cartList: [] // 购物车列表
    }
  },
  computed: {
    getadsid () {
      return this.$route.query.adsid
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressList', 'getAddressDetail']),
    ...mapGetters('Address', ['getDefaultAddressId']),
    ...mapActions('AddressMap', ['buildReverseMaps', 'fetchFullAddressName']),
    ...mapActions('Cart', ['getCartAction']),
    ...mapGetters('Cart', ['selectedCartList', 'selectedCartCount', 'selectedPrice'])
  }
}
</script>

<style lang="less" scoped>
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}
.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}
.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
</style>

```

## 订单结算

购物车携带参数：

![image-20240902013448659](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409020134925.png)

## 文件上传——unfinished

### 图片上传

> 接口要求：POST `/upload/image`
>
> Header参数：
>
> - Access-Token(String)	示例：`1741f74aed758a688515f72572dc8e37`
> - platform(String)        示例值：H5
>
> Body参数：`multipart/form-data`
>
> - file对象

上传图片通常涉及到裁剪操作，于是使用vue-cropper插件辅助完成。

#### 安装vue-cropper

```sh
npm install vue-cropper --save
```

#### 在组件中使用 `vue-cropper`

创建上传的组件，允许用户选择图片、裁剪图片并实时预览裁剪效果，然后上传裁剪后的图片。

```vue
<template>
  <div class="avatar-upload">
    <vue-cropper
      v-if="showCropper"
      ref="cropper"
      :img="imageSrc"
      :output-size="{ width: 200, height: 200 }"
      :output-type="'jpeg'"
      :can-move-box="true"
      :auto-crop="true"
      :fixed-box="true"
      :fixed="true"
      :center-box="true"
    ></vue-cropper>

    <div v-else>
      <img :src="avatarUrl" alt="Avatar" v-if="avatarUrl" class="avatar-preview" />
      <input type="file" @change="onAvatarChange" />
    </div>

    <div v-if="showCropper" class="cropper-controls">
      <button @click="cropImage">裁剪并上传</button>
      <button @click="cancelCrop">取消</button>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropper';
import { uploadImage } from '@/api/upload';

export default {
  components: {
    VueCropper
  },
  data() {
    return {
      avatarUrl: '', // 存储裁剪后的头像URL
      imageSrc: '',  // 存储用户选择的图片的URL
      showCropper: false // 控制是否显示裁剪器
    };
  },
  methods: {
    onAvatarChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageSrc = URL.createObjectURL(file);
        this.showCropper = true;
      }
    },
    async cropImage() {
      // 获取裁剪后的图片数据
      this.$refs.cropper.getCropBlob(async (blob) => {
        // 上传裁剪后的图片
        try {
          const formData = new FormData();
          formData.append('file', blob);
          const response = await uploadImage(blob);
          if (response.status === 200) {
            this.avatarUrl = response.data.fileInfo.preview_url;
            this.showCropper = false;
          } else {
            this.$toast.fail('上传失败，请重试');
          }
        } catch (error) {
          this.$toast.fail('上传失败，请重试');
          console.error(error);
        }
      });
    },
    cancelCrop() {
      this.showCropper = false;
      this.imageSrc = '';
    }
  }
};

</script>

<style>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.cropper-controls {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.cropper-controls button {
  padding: 5px 10px;
  background-color: #FF3E47;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cropper-controls button:hover {
  background-color: #E0363D;
}
</style>
```



## 打包优化

### 优化访问路径

打包命令：`yarn build` 或者 `npm run build`

打包如果没有配置vue.config.js的`publicPath`，默认生成的匹配文件的写法是绝对路径，这意味着将来的可移植性降低。于是配置：

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './', // 默认为'/'
  transpileDependencies: true
})

```

### 懒加载

打包实际上将多个文件多合一，如果一次性加载所有的js文件是非常消耗性能的，因此推荐配置懒加载。

[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)

- 异步组件改造

```js
const ProDetail = () => import('@/views/prodetail')
const Pay = () => import('@/views/pay')
...
```

- 路由中应用

```js
const router = new VueRouter({
  routes: [
    ...
    {path:'prodetail/:id', component: ProDetail},
    {Path:'/Pay', component: Pay},
    ...
  ]
})
```

对比：

![image-20240903045130463](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409030451734.png)