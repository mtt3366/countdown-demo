let countdownModule = (function () {
    let textBox = document.querySelector('.text'),
        serverTime = 0,
        targetTime = +new Date('2025/01/01 00:00:00'),//先把时间字符串转化成标准的时间格式,然后使用+转化成时间戳
        timer = null;

    // 获取服务器时间
    const queryServerTime = function queryServerTime() {
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest;
            xhr.open('HEAD', '/');//请求当前项目的根目录
            xhr.onreadystatechange = () => {
                if ((xhr.status >= 200 && xhr.status < 300) && xhr.readyState === 2) {
                    let time = xhr.getResponseHeader('Date');
                    // 获取的时间是格林尼治时间 -> 变为北京时间-> 使用new Date(time)->然后转为时间戳
                    resolve(+new Date(time));
                }
            };
            xhr.send(null);
        });
    };
    
    // 倒计时计算
    const supplyZero = function supplyZero(val) {
        val = +val || 0;
        return val < 10 ? `0${val}` : val;
    };
    const computed = function computed() {
        let diff = targetTime - serverTime,
            hours = 0,
            minutes = 0,
            seconds = 0;
        if (diff <= 0) {
            // 到达抢购时间了
            textBox.innerHTML = '00:00:00';
            clearInterval(timer);
            return;
        }
        // 没到时间则计算即可
        hours = Math.floor(diff / (1000 * 60 * 60));
        diff = diff - hours * 1000 * 60 * 60;
        minutes = Math.floor(diff / (1000 * 60));
        diff = diff - minutes * 1000 * 60;
        seconds = Math.floor(diff / 1000);
        textBox.innerHTML = `${supplyZero(hours)}:${supplyZero(minutes)}:${supplyZero(seconds)}`;
    };

    return {
        async init() {
            serverTime = await queryServerTime();
            computed();

            // 设置定时器   
            timer = setInterval(() => {
                serverTime += 1000;
                computed();
            }, 1000);
        }
    };
})();
countdownModule.init();