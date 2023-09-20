
// 点击显示隐藏的ul
document.querySelector(".info-fr a").onclick = function() {
	document.querySelector("ul.pay-section-hide").classList.toggle("show");
	if(document.querySelector("ul.pay-section-hide").classList.contains("show")) {
		document.querySelector(".address-info").innerText = "";
	}else {
		document.querySelector(".address-info").innerText = "收货信息：薛翔宇 199****6440 山东省 聊城市 东昌府区";
	}
};

// 懒加载图片用于提高性能
var ob = new IntersectionObserver(function(e) {
		e.forEach(function(entry) {
			if(entry.isIntersecting){
				entry.target.src = entry.target.parentNode.dataset.img;
			}
		});
	},
	{root:null, rootMargin: "0px 0px 20px 0px", threshold: [0]}
);

document.querySelectorAll(".pay-card-item img").forEach(function(item) {
	// 渲染完成后关掉监听
	item.onload = function() {
		ob.unobserve(item);
	};
	ob.observe(item);
});

// 目标时间，可以自定义
var targetTime = new Date("2023-04-19T00:00:00Z").getTime();

// 更新剩余时间并显示在页面上
var interval = setInterval(() => {
	// 当前时间
	var now = new Date().getTime();
	// 剩余时间（毫秒）
	var remainingTime = targetTime - now;
	// 将毫秒转换为天、小时、分钟、秒
	var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

	// 将剩余时间显示在页面上
	var countdown = document.querySelector("span.countdown");
	countdown.innerHTML = `${hours} 小时 ${minutes} 分钟 ${seconds}秒`;

	// 如果剩余时间小于等于零，清除计时器
	if (remainingTime <= 0) {
		clearInterval(interval);
		countdown.innerHTML = "请您重新支付！";
	}
}, 1000); // 每秒更新一次
