//虚拟构建数据
var htmlStr = "";
var list = [
	{id: 7, img:"../images/cart1.png", details:"HUAWEI Mate 50 Pro 256GB ", price: 6499, count: 1, state: "待付款"},
	{id: 14, img:"../images/cart1.png", details:"HUAWEI Mate 50 128GB (曜金黑)", price: 4799, count: 1, state: "待付款"},
	{id: 24, img:"../images/cart2.png", details:"HUAWEI MatePad", price: 2199, count: 1, state: "待付款"},
	{id: 25, img:"../images/cart3.png", details:"HUAWEI MateBook 16s", price: 8499, count: 1, state: "待付款"}
];
list.forEach(function(item){
	htmlStr += `
		<tr data-id = "${item.id}">
			<td><a herf=""><img src ="${item.img}"></a></td>
			<td>${item.details}</td>
			<td></td>
			<td>${item.price}</td>
			<td><span class="count">${item.count}</span></td>
			<td>${item.state}</td>
			<td class="total-sub">￥${item.price * item.count}.00元</td>
			<td><button class="btn-ok">立即支付</button><button class="btn-cancel">取消订单</button></td>
		</tr>
	`});
document.querySelector("table>tbody").innerHTML = htmlStr;
// 取消订单
document.querySelector("tbody").addEventListener("click",function(e){
	//判断是不是btn-cancel冒泡上来的事件
	if(!e.target.classList.contains("btn-cancel")) return;
	//是否确认取消
	if(!confirm("确认取消订单?")) return;
	//删除数组中的数据
	var id = parseInt(e.target.parentNode.parentNode.dataset.id);
	//用id找出list中对应的-
	var i = list.findIndex(function(item){
		return item.id === id;
	});
	list.splice(i,1);
	//修改页面上的数据
	e.target.parentNode.parentNode.remove();
	//提示删除成功
	alert("删除成功！");
});
