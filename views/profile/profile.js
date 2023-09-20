var arr = [
	{tag:"新品",name: "HUAWEI Mate X3",price: 12999,sale: 345,rate: 92,img: "../list/imgs/img1.png"},
	{tag:"新品",name: "HUAWEI P60",price: 4988,sale: 300,rate: 94,img: "../list/imgs/img2.png"},
	{tag:"新品",name: "HUAWEI P60 Pro",price:6988,sale: 430,rate: 97,img: "../list/imgs/img3.png"},
	{tag:"新品",name: "HUAWEI P60 Art",price: 8988,sale: 43,rate: 97,img: "../list/imgs/img4.png"},
	{tag:"新品",name: "华为畅想 60",price: 1249,sale: 674,rate: 97,img: "../list/imgs/img5.png"},
	{tag:"热销爆款",name: "HUAWEI nova 9 Pro",price: 2199,sale: 75,rate: 83,img: "../list/imgs/img6.png"},
	{tag:"新品",name: "nova 10 青春版",price: 1949,sale: 342,rate: 79,img: "../list/imgs/img7.png"},
	{tag:"热销爆款",name: "【华为官方翻新】HUAWEI P50",price:3388,sale: 40,rate: 79,img: "../list/imgs/img8.png"},
	{tag:"热销爆款",name: "华为USB-A转USB-C",price: 59,sale: 111,rate: 88,img: "../list/imgs/img9.png"},
	{tag:"热销爆款",name: "华为超级快充充电器",price: 199,sale: 420,rate:84,img: "../list/imgs/img10.png"},
	{tag:"热销爆款",name: "华为充电器SuperCharge快充版",price: 159,sale: 123544,rate: 99,img: "../list/imgs/img11.png"},
	{tag:"热销爆款",name: "华为66W SuperCharge多协议双向超级快充移动电源",price: 399,sale: 300,rate:85,img: "../list/imgs/img12.png"}
];

var htmlStr = "";
function showData(){
	arr.forEach(function(item){
	htmlStr += `
	<div class="list_main">
			<img src="${item.img}" alt="">
			<p><span class="red">${item.tag}</span><span class="title">${item.name}</span></p>
			<p><span class="discription">适用设备:华为手机/耳机/平板等设备</span></p>
			<div><span>新品上市以旧换新至高补贴500元</span></div>
			<br>
			<span>￥${item.price}</span>
			<p><span class="rate">销售量${item.sale} 好评率${item.rate}%</span></p>
		</div>
		`;
	});
	document.querySelector(".list_main_container").innerHTML = htmlStr;
}
	showData();
