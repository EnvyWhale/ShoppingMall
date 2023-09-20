import api_home from "../../utils/api.js";
console.log(api_home);
import { setCookie } from "../../utils/cookie.js";
// 获取验证码按钮点击事件
// 获取验证码按钮

const myModal = new bootstrap.Modal(document.getElementById("myModal"));
var btn = document.querySelector("button.btn-ok");
// 判断电话是否为空，为空则不能获取验证码
btn.onclick = function () {
  if (TellNumber.value == "") {
    alert("电话不能为空");
    return;
  }
  // 按钮被点击后让它暂时不能被点击
  // 给button设置disabled
  this.disabled = true;
  // 然后给按钮设置倒计时
  var seconds = 60,
    timer = setInterval(function () {
      // 判断是否到达时间
      if (seconds === 1) {
        clearInterval(timer);
        btn.innerText = "发送验证码";
        btn.disabled = false;
        return;
      }
      btn.innerText = `${--seconds}秒后重新获取`;
    }, 1000);

  // 等倒计时时间的到后恢复点击
  // 发送请求，获取短信验证码
  fetch(`${api_home}/sms/send`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      mobile: TellNumber.value,
      scene: 1,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      // let myModal=document.querySelector("#myModal")
      if (res.code == 200) {
        myModalText.innerHTML = "验证码为:" + res.data.smsCode;
      } else {
        myModalText.innerHTML = res.msg;
      }
      myModal.toggle();
    });
};

// 验证码登陆
// 点击登陆发送请求
let btnLogin = document.querySelector("#btnLogin");
btnLogin.onclick = () => {
  console.log(111);
  if (TellNumber.value == "" || smsCode.value == "") {
    //
    return;
  }
  // 不为空，发送请求，登陆
  //shopapi.phpclub.org.cn/home/authorize/mobileLogin
  fetch(`${api_home}/authorize/mobileLogin`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      mobile: TellNumber.value,
      smsCode: smsCode.value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code == 200) {
        // 登陆成功
        // 存取用户登陆状态
        console.log(res);

        // 默认时间为1小时过期
        let d = new Date;
        // 以当前时间计算出失效的时间 减掉8小时是因为要以格林威治时间计算
        d.setTime(d.getTime() + 3600 * 1000 * 2 - 8 * 3600 * 1000);
        setCookie('authorization', `${res.data.appSessionId}`, d)
        setCookie('mobile', `${res.data.mobile}`, d)
        // 默认跳主页
        // 如果地址栏有回跳，则使用回调

        let goback = location.search.slice(1).split('=')[1]
        console.log(goback);
        if (goback) {
          console.log(decodeURIComponent(goback));
          location.href = decodeURIComponent(goback)
        }
        else {
          location.href = "../index/index.html";
        }
      } else {
        alert(res.msg);
      }
    });
};
window.onkeydown = (e) => {
  if (e.keyCode == 13) {
    btnLogin.onclick()
  }
}
// 对手机号进行正则验证提示
document.querySelectorAll(".validate").forEach(function (item) {
  item.onblur = function () {
    var reg = new RegExp(this.dataset.reg);
    if (!reg.test(this.value)) {
      this.nextElementSibling.innerText = this.dataset.msg;
      this.classList.remove("valid");
      document.querySelector(".btn-login").disabled = true;
    } else {
      this.nextElementSibling.innerText = "";
      this.classList.add("valid");
      document.querySelector(".btn-login").disabled =
        document.querySelectorAll("validate:not(.valid)").length > 0;
    }
  };
});
