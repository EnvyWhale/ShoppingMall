import api from '../../utils/api.js'
function G(params) {
	return document.querySelector(params)
}
function GAll(params) {
	return document.querySelectorAll(params)
}
let id = location.href.slice(location.href.indexOf('=') + 1)
// 页面加载，发请求获取商品详情信息
fetch(`${api}/goods/detail?id=${id}`)
	.then(res => res.json())
	.then(res => {
		// 渲染数据到商品详情页面
		G('.detail-title-main-left>h2').innerHTML = res.data.goodsName
		G('.detail-title-main-left>a').innerHTML = res.data.category.name
		G('.detail-info-main-right>.detail-info-right-top>h2').innerHTML = res.data.goodsName
		G('.detail-info-main-left').innerHTML = `<img src=${res.data.goodsCover} style="width:383px">`
		G('.amountNow').innerHTML = res.data.marketPrice + '元'
		G('.detail-info-right-top i').innerHTML = "原价:" + (parseFloat(res.data.marketPrice) + 100) + '元'
		// console.log(res);
		// 版本信息渲染
		let ulbox = G('ul.volume')
		let skulist = res.data.sku

		ulbox.innerHTML = skulist.map((item, index) => {
			// 把版本信息转为对象
			let option = JSON.parse(item.goodsSku)
			let str = ''
			for (const key in option) {
				// console.log(key + option[key]);
				str += option[key] + '/'
			}
			return `
			<li>
			<a ${index == 0 ? 'class="checked"' : ''} data-name="${str.slice(0, -1)}" data-goodskuid=${item.id} data-marketprice="${item.marketPrice}" data-shopprice="${item.shopPrice}">
				${str}${item.marketPrice}元
			</a>
			</li>
			`
		}).join('')
		renderFun()
	})
function renderFun() {
	// 滚动隐藏home标识栏（返回顶部功能）
	window.onscroll = function () {
		var winScrollLen = document.documentElement.scrollTop || document.body.scrollTop;
		if (winScrollLen > 810) G("a.returntop").classList.add("bottom-show");
		if (winScrollLen < 810) G("a.returntop").classList.remove("bottom-show");
	}
	// 点击更新页面的信息（金额的改变）默认选项和可选项有个data-price自定义金额属性
	function updataAmountAndInfoStr() {
		var amount = 0;
		var infoStr = "";
		var goodName = G('.detail-title-main-left>h2').innerHTML
		var volumeChecked = G("ul.volume a.checked");
		var taocanChecked = G("ul.taocan a.checked");
		var serviceChecked = G("ul.service a.checked");
		//选中的check进行价格计算
		infoStr = '商品:' + goodName + ' ' + volumeChecked.dataset.name + " " + taocanChecked.dataset
			.name + " " + serviceChecked.dataset.name;
		amount += parseInt(volumeChecked.dataset.marketprice) + parseInt(taocanChecked
			.dataset.price) + parseInt(serviceChecked.dataset.price);
		G(".select-info").innerText = infoStr;
		GAll(".amount").forEach(function (item) {
			item.innerText = "¥" + amount;
		});
	}
	updataAmountAndInfoStr()
	// 版本
	// 改变每个板块的样式，默认选中有个class类。checked
	GAll("ul.volume a").forEach(function (item) {
		item.onclick = function () {
			// 如果包含这个css就返回
			if (this.classList.contains("checked")) return;
			// 去除原来已经有checked的css样式
			G("ul.volume a.checked").classList.remove("checked");
			// 添加一个checked的css样式,为默认配置选中
			this.classList.add("checked");
			// 查找已经选中的藏的值然后相加
			updataAmountAndInfoStr();

		}
	});
	// 套餐
	GAll("ul.taocan a").forEach(function (item) {
		item.onclick = function () {
			// 如果包含这个css就返回
			if (this.classList.contains("checked")) return;
			// 去除原来已经有checked的css样式
			G("ul.taocan a.checked").classList.remove("checked");
			// 添加一个checked的css样式
			this.classList.add("checked");
			// 查找已经选中的藏得值然后相加
			updataAmountAndInfoStr();

		}
	});
	// 服务
	GAll("ul.service a").forEach(function (item) {
		item.onclick = function () {
			// 如果包含这个css就返回
			if (this.classList.contains("checked")) return;
			// 去除原来已经有checked的css样式
			G("ul.service a.checked").classList.remove("checked");
			// 添加一个checked的css样式
			this.classList.add("checked");
			// 查找已经选中的藏的值然后相加
			updataAmountAndInfoStr();
		}
	});
	// 锚点定位
	GAll(".sticky a").forEach(function (item) {
		item.onclick = function () {
			if (this.classList.contains("active")) return;
			G(".sticky a.active").classList.remove("active");
			this.classList.add("active");
		}
	});
	//滚动页面控制上面的title激活
	{
		var ob = new IntersectionObserver(
			function (entry) {
				if (entry[0].isIntersecting) {
					var activeLi = G(".sticky a.active");
					//如果存在的话就去掉
					if (activeLi) activeLi.classList.remove("active");
					GAll(".sticky a")[entry[0].target.index].classList.add("active");
				}
			}, {
			root: null,
			//监听的位置
			rootMargin: "-45% 0px -50% 0px",
			threshold: [0]
		}
		);
	}
	// 搜索想要监听的标签
	var parts = GAll(".boxes");
	for (var i = 0, len = parts.length; i < len; i++) {
		// 给没有关联的多个盒子设置一个属性，记录他是第几个
		parts[i].index = i;
		// 给每个盒子添加交叉监听事件
		ob.observe(parts[i]);
	}
}
// 渲染用户基本信息
import { renderUserMsg, renderCartMsg, getCartMsg } from '../../utils/renderUserInfo.js';
if (getCookie('mobile')) {
	renderCartMsg()
	renderUserMsg()
}
// 加入购物车
import { getCookie } from '../../utils/cookie.js';
G('#goCart').onclick = () => {
	// 用户已经登陆情况
	if (getCookie('mobile')) {

		// 2-1.发请求获取用户是否有该商品类型的购物车订单
		// 2-2.有则该购物车数量，没有则添加购物车
		let obj;
		// 获取用户原本购物车数据
		getCartMsg().then(res => {
			// 定义加入购物车的数量
			let count;
			let obj = res;
			let id = parseInt(G("ul.volume a.checked").dataset.goodskuid)
			let target = obj.find(item => item.sku.id == id)
			if (!target) {
				console.log("该版本不在用户购物车。可以添加");
				count = 1
				changCartMsg(count)
			}
			else {
				count = target.goodsCount + 1
				changCartMsg(count)
			}
		})
	}
	else {
		let res = confirm("请先登陆")
		console.log(res);
		if (res) {
			let route_this = encodeURIComponent(location.href)
			location.href = `../login/login2.html?goback=${route_this}`
		}
	}
}
// 购物车的点击事件
document.querySelector('.gouwuche').onclick = () => {
	if (getCookie('mobile').length != 0) {
		// 用户已经登陆，允许跳转
		location.href = '../cart/cart.html'
	}
	else {
		let res = confirm("请先登陆")
		console.log(res);
		if (res) {
			location.href = '../login/login2.html?goback='
		}
	}

}
// 添加购物车事件
function changCartMsg(count) {
	fetch(`${api}/cart/create`, {
		method: "post",
		headers: {
			"content-type": "application/json",
			"Authorization": `bearer ${getCookie('authorization')}`
		},
		body: JSON.stringify({
			goodsSkuId: parseInt(G("ul.volume a.checked").dataset.goodskuid),
			goodsCount: count
		})
	}).then(res => res.json())
		.then(res => {
			if (res.code == 200) {
				alert("加入购物车成功")
				renderCartMsg()
			} else {
				alert(res.msg)
			}
			console.log(res);
		})
}
scorllToCarts.onclick = () => {
	if (getCookie('mobile').length != 0) {
		// 用户已经登陆，允许跳转
		location.href = '../cart/cart.html'
	}
	else {
		let res = confirm("请先登陆")
		console.log(res);
		if (res) {
			location.href = '../login/login2.html'
		}
	}
}