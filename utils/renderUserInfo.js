// 用户登陆的情况下
// 渲染用户基本信息
import api_home from './api.js'
import { getCookie, setCookie } from './cookie.js';
function renderUserMsg() {
    // http://shopapi.phpclub.org.cn/home/user/index
    fetch(`${api_home}/user/index`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${getCookie('authorization')}`
        }
    }).then(res => res.json()).then(res => {
        // console.log(res);
        // 渲染用户信息到首页导航栏
        let userIP = document.querySelector('.userIP')
        userIP.innerHTML = res.data.nickname == '' ? '请修改昵称' : res.data.nickname
        user_img.src = res.data.avatarUrl == '' ? '' : res.data.avatarUrl
        userIP.style.color = 'red'
        userIP.href = "javascript:;"
    })
}

// 渲染顶部购物车信息
function renderCartMsg() {
    // 获取用户购物车信息
    fetch(`${api_home}/cart/index`, {
        method: 'post',
        headers: {
            "content-type": "application/json",
            "Authorization": `bearer ${getCookie('authorization')}`
        }
    }).then(res => res.json())
        .then(res => {
            // console.log(res);
            let obj = res.data
            if (obj.length != 0) {
                let span = document.createElement('span')
                span.innerHTML = `
            你有<i style="color:red">${obj[0].goods.goodsName}</i>
            等<i style="color:red">${obj.length}件</i>商品
            `
                document.querySelector('.gouwuche_count b').innerHTML = obj.length
                document.querySelector('.gouwuche_more').innerHTML = ''
                document.querySelector('.gouwuche_more').appendChild(span)
            }

        })
}
async function getCartMsg(idArray = null) {
    let obj;
    let body = {}
    if (idArray) {
        body['id'] = idArray
    }
    await fetch(`${api_home}/cart/index`, {
        method: 'post',
        headers: {
            "content-type": "application/json",
            "Authorization": `bearer ${getCookie('authorization')}`
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
        .then(res => {
            obj = res.data
        })
    return obj
}
export {
    renderUserMsg, renderCartMsg, getCartMsg
}