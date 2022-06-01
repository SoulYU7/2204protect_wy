class Clock {
    constructor(){
        this.times;
        this.d;
        this.h;
        this.m;
        this.s;
        this.getNode();
        this.endTime = '2022-6-3 09:00:00';
        // this.mySetTime(this.endTime);
        this.writeIn();
    }

    getNode(){
        this.title = this.$('.biaoti');
        this.strong = this.$('.clock_span strong');
        // this.day = this.$('.')
        this.hours = this.$('.hour');
        this.minutes = this.$('.minute');
        this.seconds = this.$('.second')
    }

    //获取时间方法
    // 获取时间差,转化为字符串
     mySetTime(endTime) {
        // 起始时间是当前时间
        let start = new Date();
        // 结束事件是设定时间
        let end = new Date(endTime);

        this.strong.innerHTML = parseInt((end.getTime())/1000/60/60%24);
        // 获取计算时间差
        // (结束时间戳 - 起始时间戳) / 1000 取整  随便上下四舍五入都可以
        this.times = parseInt((end.getTime() - start.getTime()) / 1000);

        // 计算天   时间差秒数 / 1天的秒数   取整
        this.d = parseInt(this.times / (24 * 60 * 60));

        // 计算时   转化为天之后的余数 / 1小时的秒数   取整
        this.h = parseInt((this.times % (24 * 60 * 60)) / (60 * 60));

        // 计算分   转化为小时之后的余数 / 1分钟的秒数   取整
        this.m = parseInt((this.times % (60 * 60)) / 60);
        if (this.m < 10) {
            this.m = '0' + this.m;
        }

        // 计算秒   转化为分钟之后的余数 
        this.s = this.times % 60;
        if (this.s < 10) {
            this.s = '0' + this.s;
        }


    }

    //传递时间
    writeIn(){
        setInterval(()=>{
            this.mySetTime(this.endTime);
            this.mySetColor();
            this.hours.innerHTML = this.h;
            this.minutes.innerHTML = this.m;
            this.seconds.innerHTML = this.s;
            this.title.style.backgroundColor = this.rgb;
        }, 1000);
        
    }
     //获取标签节点方法
     $(ele){
        let res = document.querySelectorAll(ele);
        //如果获取到多个节点就取第一个，如果不是就返回第一个
        return res.length == 1 ? res[0] : res;
    }

    mySetColor(){
        let c1 = parseInt(Math.random()*256);
        let c2 = parseInt(Math.random()*256);
        let c3 = parseInt(Math.random()*256);
        this.rgb = `rgb(${c1},${c2},${c3})`;
    }
}

new Clock;