function G(params) {
	return document.querySelector(params)
}
function GAll(params) {
	return document.querySelectorAll(params)
}
import { getCookie, setCookie } from '../../utils/cookie.js'
// 页面加载，判断用户是否登陆，避免用户直接访问该页面
if (getCookie('authorization').length == 0) {
	// 用户已经登陆，允许跳转
	let res = alert("请先登陆")
	location.href = '../login/login2.html'
}
// 引入用户信息渲染模块，开始渲染用户基本信息
import { renderUserMsg, getCartMsg } from "../../utils/renderUserInfo.js";
renderUserMsg()

// 获取购物车信息
let list = [];
getCartMsg().then(res => {
	// 渲染购物车数据
	list = res.map(item => {
		// console.log(item);
		let desction = JSON.parse(item.sku.goodsSku);
		let descStr = '';
		for (const key in desction) {
			// console.log(key + option[key]);
			descStr += desction[key] + '/'
		}
		return {
			id: item.id,
			img: `${item.goods.goodsCover}`,
			details: `${item.goods.goodsName},${descStr.slice(0, -1)}`,
			price: item.sku.marketPrice,
			count: item.goodsCount,
			maxCount: item.sku.total
		}

	})
	renderTable(list)
})
let htmlStr = "";
//合并求和和求总金额
function totalAmount(list) {
	//找出tbody中所有选中的checkbox
	let inputList = GAll("tbody input.checkbox");
	let checkedItems = []
	inputList.forEach(item => {
		if (item.checked == true) {
			checkedItems.push(item)
		}
	})
	// 商品数量
	let amount = checkedItems.length;
	// 合计价格
	let sumPrice = 0;
	checkedItems.forEach((item) => {
		// 获取勾选td框的ID值
		let nowId = item.parentNode.parentNode.dataset.id;
		// 去购物车数组中加金额
		// console.log(list);
		// 找到对应的单条购物车数据
		let obj = list.find(item => item.id == nowId)
		sumPrice += parseFloat(obj.price) * obj.count;
	});
	G("span.amount").innerText = amount;
	G("span.sumPrice").innerText = sumPrice.toFixed(2);
}
function renderTable(list) {
	//渲染
	list.forEach(function (item) {
		htmlStr += `
		<tr data-id = "${item.id}">
			<td>
			<input class="checkbox" type='checkbox' checked style="width:16px;height:16px"></input>
			</td>
			<td><a herf=""><img src ="${item.img}"></a></td>
			<td>${item.details}</td>
			<td>${item.price}</td>
			<td>
				<button class="btn-decrease" ${item.count === 1 ? "disabled" : ""}>-</button>
				<span class="count">${item.count}</span>
				<button class="btn-increase" ${item.count === item.maxCount ? "disabled" : ""}>+</button>
			</td>
			<td class="total-sub">￥${item.price * item.count}.00元</td>
			<td><button class="btn-delete">删除</button></td>
		</tr>
	`});
	G("table>tbody").innerHTML = htmlStr;
	//首次更新总金额和总数目
	totalAmount(list);

	//给thead里面的checkbox绑定点击事件
	G("thead input.checkbox").onclick = (e) => {
		//切换他的checked class属性值
		// 记录当前全选框的选中状态
		let typeAll = e.target.checked
		//让tbody里面的所有的checkbox的选中状态和this一致
		let inputs = GAll("tbody input.checkbox")
		inputs.forEach((item) => {
			item.checked = typeAll;
		});
		//更新总数量和总金额
		totalAmount(list);
	}
	//把tbody里面的checkbox点击事件委托到tbody上进行集中处理
	// 列表的input选中状态事件
	G("tbody").addEventListener("click", function (e) {
		//判断是不是checkbox冒泡上来的事件
		if (!e.target.classList.contains("checkbox")) return;
		//切换自己的勾选状态
		//更新thead中的全选状态
		let isAllChecked = true;
		let inputList = GAll("tbody input.checkbox")
		inputList.forEach(item => {
			if (item.checked == false) {
				isAllChecked = false
				return
			}
		})
		G("thead input.checkbox").checked = isAllChecked;
		//更新总数量和总金额
		totalAmount(list);
	});

	//把tbody里面的checkbox点击事件委托到tbody上进行集中处理
	G("tbody").addEventListener("click", function (e) {
		//判断是不是btn-delete冒泡上来的事件
		if (!e.target.classList.contains("btn-delete")) return;
		//是否确认删除
		if (!confirm("是否要删除？")) return;
		//删除数组中的数据
		let id = parseInt(e.target.parentNode.parentNode.dataset.id);
		//用id找出list中对应的-
		let target = list.find((item) => {
			return item.id === id;
		});
		//修改页面上的数据
		e.target.parentNode.parentNode.remove();
		// 删除购物车对应数据
		list = list.filter(item => item.id != target.id)
		//更新thead中的全选状态
		let isAllChecked = true;
		let inputList = GAll("tbody input.checkbox")
		inputList.forEach(item => {
			if (item.checked == false) {
				isAllChecked = false
			}
		})

		G("thead input.checkbox").checked = isAllChecked;
		//更新总数量和总金额
		totalAmount(list);

		// 删除同步到后台
		deleteCart(target)
	});
	//减少商品数目
	//把tbody里面的checkbox点击事件委托到tbody上进行集中处理
	G("tbody").addEventListener("click", function (e) {
		//判断是不是btn-decrease冒泡上来的事件
		if (!e.target.classList.contains("btn-decrease")) return;
		let id = parseInt(e.target.parentNode.parentNode.dataset.id);
		//用id找出list中对应的-,修改数组中的数据
		let target = list.find(function (item) {
			return item.id === id;
		});
		target.count -= 1;
		//修改页面上的tr里的数量，小计，如果减到1了让自己禁用，加号取消禁用
		e.target.nextElementSibling.innerText = target.count;
		// 小计
		e.target.parentNode.nextElementSibling.innerText = `￥${target.count * target.price}元`;
		// 控制下限
		{
			e.target.disabled = target.count === 1;
			e.target.nextElementSibling.nextElementSibling.disabled = false;
		}
		// 减完发请求，给后台购物车数据进行对应的修改
		changCartMsg(target)
		//更新总数量和总金额
		totalAmount(list);
	});
	//增加商品数目
	//把tbody里面的checkbox点击事件委托到tbody上进行集中处理
	G("tbody").addEventListener("click", function (e) {
		//判断是不是btn-increase冒泡上来的事件
		if (!e.target.classList.contains("btn-increase")) return;

		// 加数量执行
		let id = parseInt(e.target.parentNode.parentNode.dataset.id);
		//用id找出list中对应的-,修改数组中的数据

		let target = list.find((item) => {
			// 当前点击按钮的td元素中的id值等于购物车列表中的id，返回那个购物车对象
			return item.id === id;
		});
		if (target.count >= target.maxCount) {
			// 提示用户已到库存数量，不能加了
			alert('商品该版本库存已到上限，不能继续添加购物车！！！')
			e.target.disabled = true
			// 释放减按钮
			e.target.previousElementSibling.previousElementSibling.disabled = false;
			console.log(e.target.previousElementSibling.previousElementSibling);
		} else {
			// 当前商品数量
			target.count += 1;
			// 加完发请求，给后台购物车数据进行对应的修改
			changCartMsg(target)
			// 释放减
			e.target.previousElementSibling.previousElementSibling.disabled = false;

			//修改页面上的tr里的数量，小计，如果加到最大了让自己禁用
			e.target.previousElementSibling.innerText = target.count;
			// 小计
			e.target.parentNode.nextElementSibling.innerText = `￥${target.count * target.price}元`;
			//更新总数量和总金额
			totalAmount(list);
		}



	});
}
import api_home from "../../utils/api.js";

// 修改购物车中商品数量
function changCartMsg(obj) {
	fetch(`${api_home}/cart/change`, {
		method: 'put',
		headers: {
			"content-type": "application/json",
			"Authorization": `bearer ${getCookie('authorization')}`
		},
		body: JSON.stringify({
			id: obj.id,
			goodsCount: obj.count
		})

	}).then(res => res.json())
		.then(res => {
			console.log("对该购物车订单数量的操作:" + res.msg);
		})
}
// 删除购物车
function deleteCart(obj) {
	fetch(`${api_home}/cart/remove?id=${obj.id}`, {
		method: 'delete',
		headers: {
			"content-type": "application/json",
			Authorization: `bearer ${getCookie('authorization')}`

		},
	}).then(res => res.json())
		.then(res => {
			console.log("对该条购物车信息删除:" + res.msg);
		})
}
G('.btn-settle').onclick = () => {
	// 结算点击，跳转提交订单页面
	// 1.获取选中商品的id
	let inputList = GAll('input.checkbox');
	let idArr = []
	inputList.forEach(item => {
		if (item.checked) {
			if (item.parentNode.parentNode.dataset.id) idArr.push(item.parentNode.parentNode.dataset.id)
		}
	})
	console.log(idArr);

	// 2.将goodsSkuid传到提交订单页面
	location.href = `../orderConfirm/orderConfirm.html?id=${idArr}`
}
