//列表数据获取
class List {
    constructor(){
        this.getData();
        this.bindEve();
        this.currentPage = 1;//默认页码
        this.lock = false; //设置开关 防止懒加载执行太快
    }


    //处理事件函数数
    bindEve(){
        //点击加入购物车按钮事件绑定<事件委托给父元素ul>
        this.$('.sk_bd ul').addEventListener('click' , this.checkLogin.bind(this));
        //窗口绑定滚动条事件
        window.addEventListener('scroll' , this.lazyLoader)
    }

    //服务器获取数据
    async getData(page=1){//发送ajax请求   //初始页值为1
        let {data , status} = await axios.get('http://localhost:8888/goods/list?current='+page);
        //判断请求是否成功 //请求状态码和接口返回数据
        if(status !=200 && data.code !=1) throw new Error('数据获取失败.....请检查');

        //请求数据获取成功后
        //将数据追加到页面
        let html = '';
        data.list.forEach(goods=>{
            //遍历data下的列表数据//把每一条数据一次添加到页面
            //li添加一个自定义属性goods_id获取到货物的id
            html += `<li class="sk_goods" data-id="${goods.goods_id}">
            <a href="detail.html">
                <img src="${goods.img_big_logo}" alt="">
            </a>
            <h5 class="${goods.title}"></h5>
            <p class="sk_goods_price">
                <em>${goods.current_price}</em>
                <del>>${goods.price}</del>
            </p>
            <div class="sk_goods_progress">
                已售
                <i>${goods.sale_type}</i>
                <div class="bar">
                    <div class="bar_in"></div>
                </div>
                剩余
                <em>${goods.goods_number}</em>件
            </div>
            <a href="#none" class="sk_goods_buy">立即抢购</a>
        </li>`
        })
        this.$('.sk_bd ul').innerHTML += html;
    }

    //懒加载函数
    //实现原理 <当前实际内容高度<(小于)滚动条距离顶部的高度+可视区域的高度>
    lazyLoader = ()=>{
        //滚动条高度
        let top = document.documentElement.scrollTop;
        //可视区域高度
        let cliH = document.documentElement.clientHeight;
        //实际内容高度
        let conH = this.$('.sk_container').offsetHeight;
        //判断
        if(top + cliH >(conH + 450)){//450是头部高度
            if(this.lock) return;
            this.lock = true;


            setTimeout(()=>{
                this.lock = false;
            }, 1000)
            this.getData(++this.currentPage)//页数加1传参执行获取商品数据函数
        }
    }

    //点击加入购物车函数
    checkLogin(eve){
        //判断点击获取事件源 //并且点击到其他标签不跳转直接return
        if(eve.target.nodeName !='A' || eve.target.className !='sk_goods_buy') return;
        //判断用户是否登录未登录则跳转登录页面
        //获取token值判断是否登录
        let token = localStorage.getItem('token');
        //如果未登录直接跳转登陆页面
        if (!token) location.assign('./login.html?ReturnUrl=./list.html');

        //加入购物车需要获取用户id和商品id
        let goodsId = eve.target.parentNode.dataset.id;
        let userId = localStorage.getItem('user_id');
        //执行添加购物车函数将获取到的商品id和用户id传参到商品函数
        this.addCartGoods(goodsId , userId);
    }

    addCartGoods(gId , uId){//添加购物车函数
        //添加购物车接口发送请求  //需要携带token值传递
        const AUTH_TOKEN = localStorage.getItem('token');
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        //  axios.defaults.headers.common.authorization = AUTH_TOKEN
        // headers['Content-Type']  也是 给 headers 对象中添加属性,只是. 语法不支持 Content-Type
        let param = `id=${uId}&goodsId=${gId}`;
        axios.post('http://localhost:8888/cart/add' , param).then(({data , status}) =>{ //.then返回的res数据直接在then中解构赋值拿到data和status的值

        //判断购物车是否请求数据成功
        if(status == 200 && data.code == 1){
            //设置弹窗
            layer.open({
                title: '您的商品已放到购物车中'
                , content: '去购物车结算'
                , btn: ['NO' , 'YES']
                , btn2: function (index , layero){//按钮2执行函数
                    location.assign('./shopping.html')//跳转购物车页面
                }
                , time: 2000 //2秒后自动消失
            })
        }else if(status == 200 && data.code == 401){
             // //如果未登录重新登陆
             //并清除用户信息
             localStorage.removeItem('token');
             localStorage.removeItem('user_id');
             location.assign('./login.html?ReturnUrl=./list.html')
        }else{//登录过期去登录按钮重新登陆
            layer.open({
                title: '加入购物车失败'
                , content: '出错了,您的登录已过期,请重新登录'
                , time: 3000
            });
        }
    })
    }


     //获取标签节点方法
     $(ele){
        let res = document.querySelectorAll(ele);
        //如果获取到多个节点就取第一个，如果不是就返回第一个
        return res.length == 1 ? res[0] : res;
    }
}

new List;