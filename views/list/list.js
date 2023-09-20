var arr = [
	{tag:"新品",name: "HUAWEI Mate X3",price: 12999,sale: 345,rate: 92,img: "imgs/img1.png"},
	{tag:"新品",name: "HUAWEI P60",price: 4988,sale: 300,rate: 94,img: "imgs/img2.png"},
	{tag:"新品",name: "HUAWEI P60 Pro",price:6988,sale: 430,rate: 97,img: "imgs/img3.png"},
	{tag:"新品",name: "HUAWEI P60 Art",price: 8988,sale: 43,rate: 97,img: "imgs/img4.png"},
	{tag:"新品",name: "华为畅想 60",price: 1249,sale: 674,rate: 97,img: "imgs/img5.png"},
	{tag:"热销爆款",name: "HUAWEI nova 9 Pro",price: 2199,sale: 75,rate: 83,img: "imgs/img6.png"},
	{tag:"新品",name: "nova 10 青春版",price: 1949,sale: 342,rate: 79,img: "imgs/img7.png"},
	{tag:"热销爆款",name: "【华为官方翻新】HUAWEI P50",price:3388,sale: 40,rate: 79,img: "imgs/img8.png"},
	{tag:"热销爆款",name: "华为USB-A转USB-C",price: 59,sale: 111,rate: 88,img: "imgs/img9.png"},
	{tag:"热销爆款",name: "华为超级快充充电器",price: 199,sale: 420,rate:84,img: "imgs/img10.png"},
	{tag:"热销爆款",name: "华为充电器SuperCharge快充版",price: 159,sale: 123544,rate: 99,img: "imgs/img11.png"},
	{tag:"热销爆款",name: "华为66W SuperCharge多协议双向超级快充移动电源",price: 399,sale: 300,rate:85,img: "imgs/img12.png"},
	{tag:"热销爆款",name: "华为超级快充充电器(Max22.5W SE)",price:69,sale: 430,rate:88,img: "imgs/img13.png"},
	{tag:"热销爆款",name: "华为快充移动电源(Max 18W)",price: 1498,sale: 30023,rate:87,img: "imgs/img14.png"},
	{tag:"热销爆款",name: "华为5A/6A数据线USB-C转USB-C",price: 69,sale: 624,rate:97,img: "imgs/img15.png"},
	{tag:"热销爆款",name: "华为多协议超级快充移动电源10000mAh (Max 22.5W SE)",price: 179,sale: 3005,rate: 89,img: "imgs/img16.png"},
	{tag:"热销爆款",name: "华为超级快充立式无线充电器(Max 50W)",price: 479,sale: 14444,rate:96,img: "imgs/img17.png"},
	{tag:"热销爆款",name: "华为超级快充无线车充(Max50W)",price:349,sale: 15423,rate:97,img: "imgs/img18.png"},
	{tag:"热销爆款",name: "华为超级快充车载充电器(Max66W)",price: 229,sale: 12356,rate:98,img: "imgs/img19.png"},
	{tag:"热销爆款",name: "华为超级快充无线充电器(MAX27W)",price: 119,sale: 49213,rate:99,img: "imgs/img20.png"}
];

var ob = null, sortDir = "asc", sortKey = "price";
var arrShow = arr.sort(function(a,b) {
			return sortDir == "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
	});
function updateArr(){
	function showData() {
		var htmlStr = "";
		arrShow.forEach(function(item, i) {
			htmlStr += `
			<div class="box">
				<p class = "p-tag"><span>${item.tag}</span></p>
				<img data-img = "${item.img}" alt="" src="">
				<h6>${item.name}</h6>
				<span>￥${item.price}</span><span class="span_border">多款可选</span>
				<br><h4>销量：${item.sale}</h4>
				<h5 class="red">赠送积分</h5>
				<h4>好评率${item.rate}%</h4>
			</div>
			`;
		});
		document.querySelector(".commodity").innerHTML = htmlStr;
	};
		showData();	
		//监听所有图片的交叉情况，动态加载图片资源
		ob = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					//如果图片滚动到达指定位置，设src请求加载图片
					entry.target.src = entry.target.dataset.img;
				}
			});
		}, {root: null, rootMargin: "0px 0px 20px 0px", threshold: [0]});
		document.querySelectorAll(".commodity img").forEach(function(item) {
			//监听图片加载完毕事件，在里面取消ob对图片的懒加载监听
			// console.log(document.querySelectorAll(".commodity img"));
			item.onload = function() {ob.unobserve(this);}
			//开启图片的懒加载监听
			ob.observe(item);
	});
}
//进来先调用一遍
updateArr();
//搜索功能
document.forms["search"].onsubmit = function(e){
	//取消ob当前所有的交叉监听
	ob.disconnect();
	//获取用户的搜索条件
	var words = this.words.value.trim();
	//根据搜索条件更新arrShow
	arrShow = arr.filter(function(item){
		return item.name.indexOf(words) !== -1;
	});
	//调用updateArr更新页面
	updateArr();
	//阻止表单默认提交刷新页面行为
	e.preventDefault();
}
// 分类功能
//先封装函数
function categorySearch(a,str){
	document.querySelector(a).onclick = function(e){
		//取消ob当前所有的交叉监听
		ob.disconnect();
		arrShow = arr.filter(function(item){
			return item.name.indexOf(str) !== -1;
		});
		updateArr();
		e.preventDefault();
	}
}
//传参数
categorySearch(".changxiang","畅想");
categorySearch(".nova","nova");
categorySearch(".P","HUAWEI P");
categorySearch(".Mate","Mate");
categorySearch(".ershouji","二手");
categorySearch(".fanxin","官方");
categorySearch(".Pocket","Pocket");


var sortKey = "price";
document.querySelectorAll("span.sort-item").forEach(function(item) {
	  item.onclick = function() {
		  // 如果已经激活,那就是切换排序方向
		   if(this.classList.contains("active")) {
				this.classList.toggle("asc");
				this.classList.toggle("desc");
				sortDir = sortDir === "asc" ? "desc" : "asc" ;
			} 
			//排序方向不变 改变排序方式
			else {
				document.querySelector("span.sort-item.active").classList.remove("active","asc","desc");
				this.classList.add("active",sortDir)
				sortKey = this.dataset.key;
			}
			// 取消ob当前所有的交叉监听
				ob.disconnect();
				// 更新listShow
				arrShow.sort(function(a,b) {
				return sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
			});
		   updateArr();
	  };
 });