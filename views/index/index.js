import api_home from "../../utils/api.js";
function G(params) {
  return document.querySelector(params)
}
// 页面加载，发送请求获取首页数据
//shopapi.phpclub.org.cn/home/index/index
console.log(api_home);

//如果用户登陆，则首页用户信息展示
let isLogin = false
// http://shopapi.phpclub.org.cn/home/user/index
import { getCookie } from "../../utils/cookie.js";

// 获取有效cookie(已经登陆)
import { renderUserMsg, renderCartMsg } from '../../utils/renderUserInfo.js'
if (getCookie('authorization')) {
  // 渲染用户信息
  renderUserMsg()
  // 渲染购物车信息
  renderCartMsg()
}

// 存放分类数据
// http://shopapi.phpclub.org.cn/home/system/category
let catroge = []
// 分类信息渲染
fetch(`${api_home}/system/category`, {
  headers: {
    "content-type": "application/json"
  }
}).then(res => res.json()).then(res => {
  catroge = res.data
  console.log(catroge);
  let insterBox = document.querySelector('.list1_box')
  // 动态渲染二级菜单
  catroge.forEach(item => {
    // 一级菜单
    let li = document.createElement('li')
    li.innerHTML = `<a>${item.name}</a><img src='../../images/arrow-right.png'>`
    // 判断当前菜单是否有子级菜单，有则继续创建并添加
    if (item.hasOwnProperty('children')) {
      // 定义创建子级菜单方法
      // 定义该菜单等级
      let top = 2
      function Creatchildren(top, dom, children) {
        // 创建子级菜单结构框架
        let div = document.createElement('div')
        // 给子级菜单盒子添加类名
        div.classList.add(`list${top - 1}-more`)
        // 子级菜单ul列表
        let ul = document.createElement('ul')
        ul.classList.add(`box${top}`)
        children.forEach(item => {
          let li = document.createElement('li')
          li.innerHTML = `
          <a target = "_blank" > 
          <img src = "${item.icon}" alt="">&nbsp;<span>${item.name}</span></img>
          `
          if (item.hasOwnProperty('children')) {
            let child_top = top + 1
            Creatchildren(child_top, li, item.children)
          }
          ul.appendChild(li)
        })
        div.appendChild(ul)
        dom.appendChild(div)
      }
      // 创建子级菜单
      Creatchildren(top, li, item.children)
    }
    // 将整个li加入box中
    insterBox.appendChild(li)
  })
})


// 存放banner和商品数据
fetch(`${api_home}/index/index`, {
  headers: {
    "content-type": "application/json",
  },
})
  .then((res) => res.json())
  .then((res) => {
    let banners = []
    banners = res.data.banners
    // 轮播图板块
    // 获取swiper轮播盒子
    let swiperbox = document.querySelector('.swiper-wrapper')
    swiperbox.innerHTML = banners.map(item => `
    <div class="swiper-slide"><img src=${item.img} style="width: 100%;"></div>
    `).join('')
    // 实例化轮播图
    var swiper = new Swiper(".swiper-container", {
      pagination: ".swiper-pagination",
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 30,
      loop: true,
      autoplay: 3000
    });

    // 商品展示板块
    let recGoods = res.data.recGoods
    document.querySelector('.menu_2_container').innerHTML =
      recGoods.map(item => `
    <div class="menu_2" >
    <a href='../detail/detail.html?id=${item.id}' style="color:black">
      <img src="${item.goodsCover}" alt="" style="width:90%">
      <div class="menu_2_text">
        <p>${item.goodsName}</p>
        <br>
        <p>现价:${item.shopPrice}</p>
        <p class="red"><span>原价:${item.marketPrice}</span><span>
        
      </div>
    </a>
    
    </div>
    `).join('')
    // console.log(res);
  });

// 用户登陆，可以修改资料
let UpdataUserMsg = document.querySelector('.UpdataUserMsg')
UpdataUserMsg.onclick = () => {
  if (!getCookie('authorization')) {
    confirm('请先登陆') ? location.href = '../login/login2.html' : ''
    return
  }
  // 实例化模态框
  let writeModal = new bootstrap.Modal(document.getElementById('writeModal'));

  // 展示修改用户数据模态框
  writeModal.toggle()

}

// 购物车的点击事件
document.querySelector('.gouwuche').onclick = () => {
  if (getCookie('mobile').length != 0) {
    // 用户已经登陆，允许跳转
    location.href = '../cart/cart.html'
  }
  else {
    let res = confirm("请先登陆")
    if (res) {
      location.href = '../login/login2.html'
    }
  }
}

// {
//   // 收集base64，图片
//   let cover = ''
//   // 封面图片文件解析base64格式文件
//   photofile.onchange = function (evt) {
//     // console.log(evt.target.files[0]);
//     // ?==>base64
//     let reader = new FileReader()
//     // 将链接地址转化为base64编码
//     reader.readAsDataURL(evt.target.files[0]);
//     // 解析完成后赋值给收集器并显示在预览位置
//     reader.onload = function (e) {
//       // 解析结果
//       // console.log(e.target.result);
//       cover = e.target.result;
//       let user_img = G('.user_img img')
//       user_img.src = cover
//       // console.log(cover);
//     }
//   }
// }



write_do.onclick = () => {

  // 获取编辑框中的数据
  let nickName = G('#username')
  let realName = G('#realName')
  let radios = document.getElementsByName('sex');
  let sex;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      sex = radios[i].value;
      break;
    }
  }
  console.log(sex);

  // http://shopapi.phpclub.org.cn/home/user/updateProfile
  fetch(`${api_home}/user/updateProfile`, {
    method: 'put',
    headers: {
      "content-type": "application/json",
      "Authorization": `bearer ${getCookie('authorization')}`
    },
    body: JSON.stringify({

      "avatarUrl": photofile.value,
      "nickname": nickName.value,
      "realName": realName.value,
      "gender": parseInt(sex)
    })
  }).then(res => res.json())
    .then(res => {
      console.log(res);
    })

}




