function G(params) {
	return document.querySelector(params)
}
function GAll(params) {
	return document.querySelectorAll(params)
}
const myModal = new bootstrap.Modal(document.getElementById("myModal"));

// 导入渲染用户信息模块
import api_home from '../../utils/api.js'
import { getCookie, setCookie } from '../../utils/cookie.js'
import { getCartMsg, renderCartMsg, renderUserMsg } from "../../utils/renderUserInfo.js";
// 判断用户是否登陆，避免用户直接访问该页面
window.addEventListener('load', async () => {
	if (!getCookie('authorization')) {
		// 用户已经登陆，允许跳转
		let res = alert("请先登陆")
		location.href = '../login/login2.html'
	}
	else {
		// 用户已经登陆，渲染页面数据和获取数据
		renderUserMsg()
		renderCartMsg()
		// 获取用户地址信息并渲染
		await fetch(`${api_home}/address/index`, {
			headers: {
				'content-type': 'application/json',
				'Authorization': `bearer ${getCookie('authorization')}`
			}
		}).then(res => res.json())
			.then(res => {
				// console.log(res);
				// 地址信息 
				if (res.data.length == 0) {
					// 用户没有地址数据。不用渲染
				} else {
					for (let item of res.data) {
						let target =
						{
							id: item.id,
							name: item.name,
							address: `${item.provinceName}-${item.cityName}-${item.districtName}`,
							lat: item.lat,
							lng: item.lng,
							phone: item.mobile,
							userId: item.userId
						}
						AddressList.push(target)
					}
					// 有地址信息，过滤地址信息
					renderAddress(AddressList)
				}
			})
		// 获取购物车信息
		// 获取地址栏中需要添加的购物车
		let CartList = window.location.search.slice(4).split(',')
		let res = await getCartMsg(CartList)
		// 渲染需要购买的订单
		renderOrder(res)
	}
})
let AddressList = [];

// 渲染地址函数
var container = document.querySelector(".container"),
	form = document.forms["dialog"],
	ul = document.querySelector("ul.list");

function renderAddress(AddressList) {
	// 渲染地址信息
	let htmlStr = "";
	AddressList.forEach(function (item) {
		htmlStr += `
		<li>
		<span>${item.name}</span>
			<span>${item.phone}</span>
			<span>${item.address}</span>
			<div class="btn-container">
			<button data-id="${item.id}" class="btn-remove">删除</button>
			<button data-id="${item.id}" class="btn-revise">修改</button>
			</div>
		</li>
	`;
	});
	ul.innerHTML = htmlStr;
	// 给地址添加选择事件
}
function renderOrder(OrderList) {
	// console.log(OrderList);
	G('.orderConfirmBox').innerHTML = OrderList.map(item => {
		let type = JSON.parse(item.sku.goodsSku)
		let str = '/'
		for (const key in type) {
			str += type[key] + '/'
		}
		str = str.slice(0, -1)
		let price = parseFloat(item.sku.marketPrice).toFixed(2)
		return `
	<div class="orderConfirm-left1" data-price=${item.goodsCount * price}>
		<div class='orderConfirm-left1-1'>
			<img src="${item.goods.goodsCover}" alt="">
		</div>
		<div  class='orderConfirm-left1-2'>
			<span class="discription">套餐</span>
			<span>${item.goods.goodsName}${str}</span>
		</div>
		<div class='orderConfirm-left1-3'>x${item.goodsCount}</div>
		<div class='orderConfirm-left1-4'>¥${price.toString()}</div>
	</div>
	`
	}).join('')
	// 计算总金额
	templatePrice()
}
// 计算金额函数
function templatePrice() {
	let sumPrice = 0
	GAll('.orderConfirm-left1').forEach(item => {
		let price = parseFloat(item.dataset.price);
		sumPrice += price
		// console.log(sumPrice);
	})
	// console.log(sumPrice);
	G('#sumPrice').innerHTML = sumPrice.toString()
	G('#endPrice').innerHTML = sumPrice.toString()
	G('#needPrice').innerHTML = sumPrice.toString()
}


// 地图选点
let addressObj =
{
	lat: "",
	lng: "",
	name: "",
	mobile: "",
	address: "",
	isDefault: 1
}
// 设置保存按钮是添加还是修改
let key = true
let id
// 删除地址功能
ul.onclick = function (e) {
	if (e.target.classList.contains("btn-remove")) {
		// 如果不删除就取消
		if (!confirm("确定删除？")) return;
		let id = parseInt(e.target.dataset.id);
		let i = AddressList.findIndex(function (item) {
			return item.id === id;
		});
		// console.log(i);

		// http://shopapi.phpclub.org.cn/home/address/remove
		fetch(`${api_home}/address/remove?id=${id}`, {
			method: 'delete',
			headers: {
				'content-type': 'application/json',
				Authorization: `bearer ${getCookie('authorization')}`
			}
		}).then(res => res.json())
			.then(res => {
				if (res.code == 200) {
					// 删除数组里面的元素
					AddressList.splice(i, 1);
					e.target.parentNode.parentNode.remove();
					alert("删除成功！")
					renderAddress(AddressList)

				}
			})
	}
	// 如果点击的是修改按钮
	if (e.target.classList.contains("btn-revise")) {
		id = parseInt(e.target.dataset.id);
		let i = AddressList.find(function (item) {
			return item.id === id;
		});
		// console.log(i);
		// 回显数据
		form.name.value = i.name;
		form.phone.value = i.phone;
		form.address.value = i.address
		addressObj.lat = i.lat
		addressObj.lng = i.lng
		key = false
		container.classList.add("show");
		renderAddress(AddressList)
	}
}



window.addEventListener('message', function (event) {
	// 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
	let loc = event.data;
	if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
		// console.log('location', loc);
		G('.form-control').value = loc.poiaddress
		addressObj.lat = loc.latlng.lat;
		addressObj.lng = loc.latlng.lng;
		addressObj.address = loc.poiaddress
	}
}, false)


// 新增地址
document.querySelector("button.btn-found").onclick = function () {
	key = true
	container.classList.add("show");
	// 重置表单
	form.reset();
}
document.querySelector("button.btn-cancel").onclick = function () {
	container.classList.remove("show");
}
//保存按钮
document.querySelector("button.btn-save").onclick = function () {
	addressObj.name = G('#name').value
	addressObj.mobile = G('#phone').value
	addressObj.address = G('#address').value
	addressObj.isDefault = G('#value_address').checked == true ? 2 : 1
	// console.log(addressObj);
	let ref = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
	if (addressObj.name == "" || !ref.test(addressObj.mobile) || addressObj.address == "") {
		alert('参数错误，重新输入')
	}
	else {
		if (key) {
			// 添加
			// http://shopapi.phpclub.org.cn/home/address/create
			fetch(`${api_home}/address/create`, {
				method: 'post',
				headers: {
					'content-type': 'application/json',
					Authorization: `bearer ${getCookie('authorization')}`
				},
				body: JSON.stringify(addressObj)
			}).then(res => res.json())
				.then(res => {
					// console.log(res);
					if (res.code == 200) {
						alert("添加地址成功")
						// 重置表单
						form.reset();
						container.classList.remove("show");
						renderAddress(AddressList)
					}
				})

		}
		else {
			// 修改
			// http://shopapi.phpclub.org.cn/home/address/update
			// 获取对应的经纬度
			let target = AddressList.find(item => {
				return item.id === id;
			})
			console.log(target);
			fetch(`${api_home}/address/update`, {
				method: 'put',
				headers: {
					'content-type': 'application/json',
					Authorization: `bearer ${getCookie('authorization')}`
				},
				body: JSON.stringify({ ...addressObj, id })
			}).then(res => res.json())
				.then(res => {
					console.log(res);
					if (res.code == 200) {
						alert("修改地址成功")
						// 重置表单
						form.reset();
						container.classList.remove("show");
						renderAddress(AddressList)
					}
				})
		}

	}

}
G('#button-address').onclick = () => {
	// 显示地图控件
	myModal.toggle()
}