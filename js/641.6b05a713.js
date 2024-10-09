"use strict";(self["webpackChunkgo_shopping"]=self["webpackChunkgo_shopping"]||[]).push([[641],{6641:function(t,e,i){i.r(e),i.d(e,{default:function(){return v}});var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"login"},[e("van-nav-bar",{attrs:{title:"登录页面","left-arrow":""},on:{"click-left":function(e){return t.$router.go(-1)}}}),t.isLogin?e("div",{staticClass:"empty"},[e("van-skeleton",{attrs:{title:"",avatar:"",row:10}})],1):e("div",{staticClass:"container"},[t._m(0),e("div",{staticClass:"form"},[e("div",{staticClass:"form-item"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.phoneNum,expression:"phoneNum"}],staticClass:"inp",attrs:{maxlength:"11",placeholder:"请输入手机号码",type:"text"},domProps:{value:t.phoneNum},on:{input:function(e){e.target.composing||(t.phoneNum=e.target.value)}}})]),e("div",{staticClass:"form-item"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.picCode,expression:"picCode"}],staticClass:"inp",attrs:{maxlength:"5",placeholder:"请输入图形验证码",type:"text"},domProps:{value:t.picCode},on:{input:function(e){e.target.composing||(t.picCode=e.target.value)}}}),t.picUrl?e("img",{attrs:{src:t.picUrl,alt:""},on:{click:t.getPicCode}}):t._e()]),e("div",{staticClass:"form-item"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.smsCode,expression:"smsCode"}],staticClass:"inp",attrs:{placeholder:"请输入短信验证码",type:"text"},domProps:{value:t.smsCode},on:{input:function(e){e.target.composing||(t.smsCode=e.target.value)}}}),e("button",{on:{click:t.getCode}},[t._v(t._s(t.totalTime===t.timeNow?"获取验证码":`${t.timeNow}秒后重试`))])])]),e("div",{staticClass:"login-btn",on:{click:t.login}},[t._v("登录")])])],1)},o=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"title"},[e("h3",[t._v("手机号登录")]),e("p",[t._v("未注册的手机号登录后将自动注册")])])}],a=(i(1860),i(1981)),n=(i(7345),i(6579)),r=i(5720);const c=()=>r.A.get("/captcha/image"),l=(t,e,i)=>r.A.post("/captcha/sendSmsCaptcha",{form:{captchaCode:t,captchaKey:e,mobile:i}}),m=(t,e)=>r.A.post("/passport/login",{form:{isParty:!1,mobile:t,partyData:{},smsCode:e}});var p={name:"LoginIndex",data(){return{reg_phone:/^1[3-9]\d{9}$/,reg_picCode:/^\w{4}$/,phoneNum:"",picCode:"",smsCode:"",picKey:"",picUrl:"",timerId:null,totalTime:60,timeNow:60}},async created(){this.isLogin&&n.A.alert({title:"已登录提醒",message:"您已登录，请勿重复登录！",confirmButtonText:"确定"}).then((()=>{this.$router.replace("/")})),this.getPicCode()},computed:{isLogin(){return this.$store.getters.token}},methods:{async getPicCode(){const{data:{base64:t,key:e}}=await c();this.picUrl=t,this.picKey=e},validFn(){return this.reg_phone.test(this.phoneNum)?!!this.reg_picCode.test(this.picCode)||((0,a.A)("图形验证码错误！"),!1):((0,a.A)("请输入正确的手机号！"),!1)},async getCode(){this.validFn()&&(await l(this.picCode,this.picKey,this.phoneNum),(0,a.A)("短信发送成功，请注意查收"),this.timerId||this.timeNow!==this.totalTime||(this.timerId=setInterval((()=>{this.timeNow--,this.timeNow<=0&&(clearInterval(this.timerId),this.timerId=null,this.timeNow=this.totalTime)}),1e3),(0,a.A)("获取短信验证码成功")))},async login(){if(!this.validFn())return;if(!/^\d{6}$/.test(this.smsCode))return void(0,a.A)("请输入正确的短信验证码！");const t=await m(this.phoneNum,this.smsCode);if(200===t.status){(0,a.A)("登录成功"),this.$store.commit("User/setUserInfo",t.data);const e=this.$route.query.backUrl||"/";this.$router.replace(e)}else(0,a.A)("登录失败，请检查手机号和验证码是否正确")}},destroyed(){clearInterval(this.timerId)}},d=p,h=i(1656),u=(0,h.A)(d,s,o,!1,null,"7b63fc0e",null),v=u.exports}}]);
//# sourceMappingURL=641.6b05a713.js.map