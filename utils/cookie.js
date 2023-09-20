function setCookie(name, value, expires = 0) {
    // 默认时间为1小时过期
    let d = new Date;
    // 以当前时间计算出失效的时间 减掉8小时是因为要以格林威治时间计算
    d.setTime(d.getTime() + 3600 * 1000 - 8 * 3600 * 1000);
    if (expires != 0) {
        d = expires
    }
    document.cookie = name + "=" + value + ";expires=" + d + ";path=/";

    //即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            let c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            let res = document.cookie.substring(c_start, c_end)
            // console.log(res);
            return res
        }
    }
    return ""
}
export { setCookie, getCookie }