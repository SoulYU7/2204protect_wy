//购物车操作的实现
class Cart {
    constructor(){
        this.addCartGoods();
        //删除功能实现
        //给.cart_list标签绑定事件,实现对删除按钮的事件委托
        this.$('.cart-list').addEventListener('click' , this.dispath);

        //全选框功能
        //给全选框绑定事件
        this.$('.cart-th input').addEventListener('click' , this.checkAll);
    }

    //把获取到的的商品信息添加到购物车函数
    async addCartGoods(){  //async await解决异步问题 保证请求成功获取数据后再执行其他
        //携带token验证是否登录
        //获取token
        const AUTH_TOKEN = localStorage.getItem('token');
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;//请求配置
        //get请求，获取数据
        let {data , status} = await axios.get('http://localhost:8888/cart/list',{
            //需要用户id来操作数据
            //拿到用户id
            params:{
                id: localStorage.getItem('user_id')
            }
        })

        //判断ajax的请求状态
        //请求成功时把数据添加到页面
        if(status == 200 && data.code == 1){
        let html = '';
        data.cart.forEach(goods=>{
            //每条数据依次添加到html
            html+=`<ul class="goods-list yui3-g" data-id="${goods.goods_id}">
            <li class="yui3-u-3-8 pr">
                <input type="checkbox" class="good-checkbox">
                <div class="good-item">
                    <div class="item-img">
                        <img src="${goods.img_small_logo}">
                    </div>
                    <div class="item-msg">${goods.title}</div>
                </div>
            </li>
            <li class="yui3-u-1-8">
                
            </li>
            <li class="yui3-u-1-8">
                <span class="price">${goods.current_price}</span>
            </li>
            <li class="yui3-u-1-8">
                <div class="clearfix">
                    <a href="javascript:;" class="increment mins">-</a>
                    <input autocomplete="off" type="text" value="${goods.cart_number}" minnum="1" class="itxt">
                    <a href="javascript:;" class="increment plus">+</a>
                </div>
                <div class="youhuo">有货</div>
            </li>
            <li class="yui3-u-1-8">
                <span class="sum">${goods.current_price * goods.cart_number}</span>
            </li>
            <li class="yui3-u-1-8">
                <div class="del1">
                    <a href="javascript:;" class="del1">删除</a>
                </div>
                <div>移到我的关注</div>
            </li>
        </ul>`;
        })
        this.$('.cart-list').innerHTML += html;
        //单个商品添加是异步的,所以每添加一个商品给器单选按钮绑定事件
        this.oneGoodsCheckBox();
        }
    }

    //事件判断使用的是委托事件找到事件源
    dispath =(eve)=>{
        //获取事件源
        let target = eve.target;
        //判断
        if(target.nodeName == 'A' && target.classList.contains('del1')) this.delGoodsData(target)//删除操作
        if(target.nodeName == 'A' && target.classList.contains('plus')) this.asGoodsNum(target)//+操作
        if(target.nodeName == 'A' && target.classList.contains('mins')) this.asGoodsNum(target)

    }

    delGoodsData(tar){//商品删除函数
        //传参是因为删除要找到商品的id操作
        layer.confirm('是否删除商品',{
            title:'删除提示框'
        },function(){//确认删除的回调函数，给后台发送记录删除数据
            let ul = tar.parentNode.parentNode.parentNode;//找到标签的父元素
            let gId = ul.dataset.id; //获取商品id
            let uId = localStorage.getItem('user_id'); // 获取用户id
            //携带token后台验证
            const AUTH_TOKEN = localStorage.getItem('token');
            axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
            axios.get('http://localhost:8888/cart/remove',{
                params:{
                    id: uId,
                    goodsId: gId
                }
            }).then(res=>{
                //直接刷新页面
                //location.reload();
                //or 不刷新页面 关闭弹窗删除对应
                layer.closeAll();
                ul.remove();
            })
        })

    }

    checkAll = (eve)=>{
        let allStatus = eve.target.checked;//点击获取到全选框状态
        this.oneGoodsCheck(allStatus);//点击时使多选框状态和其保持一致
        this.countSumPrice();//全选改变总价
    }

    //单选跟随全选状态
    oneGoodsCheck(status){
        this.$('.good-checkbox').forEach(input=>{
            input.checked = status;
        })
    }
    oneGoodsCheckBox(){
        
        this.$('.good-checkbox').forEach(input=>{//每个多选框绑定点击事件
            let thisCart = this; //下面事件函数改变this指向
            input.onclick = function(){
                //多选框添加点击事件
                if(!this.checked){//多选框改变全选矿状态改变
                    thisCart.$('.cart-th input').checked = false;
                }

                //点击选中时再检查其他多选框状态
                if(this.checked){
                    let status = thisCart.getOneGoodsStatus();
                    thisCart.$('.cart-th input').checked = status;
                }
                thisCart.countSumPrice();
            }
        })
    }

    getOneGoodsStatus(status){
        //遍历其他多选框未被选中的找到存储到res中
        let res = Array.from(this.$('.good-checkbox')).find(input=>{
            return !input.checked
        })

        return !res;  //返回res为空则代表
    }

    //商品数量增加
    asGoodsNum = (tar)=>{
        console.log();
        //获取事件父元素拿到商品的id
        let ul = tar.parentNode.parentNode.parentNode;
        let num = ul.querySelector('.itxt');
        let sum = ul.querySelector('.sum');
        let price = ul.querySelector('.price').innerHTML -0;
        //获取数量
        let numVal = num.value;
        //点击数量增1
        if(tar.classList.contains('plus')){
            numVal++;
        }else{
            numVal--;
        }
        

        //更新数据计算价格
        const AUTH_TOKEN = localStorage.getItem('token')
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let uId = localStorage.getItem('user_id');
        let gId = ul.dataset.id;
        let param = `id=${uId}&goodsId=${gId}&number=${numVal}`
        axios.post('http://localhost:8888/cart/number',param).then(res=>{
            let{status , data} = res;
            if(status == 200 && data.code == 1){
                num.value = numVal;
                sum.innerHTML = Math.floor(numVal*price*100)/100;
                this.countSumPrice();
            }
        })
    }
    countSumPrice(){

        let sum = 0;
        let num = 0;
        this.$('.good-checkbox').forEach(input=>{
            if(input.checked){
                //选中状态时
                let ul = input.parentNode.parentNode;
                let tmpNum = ul.querySelector('.itxt').value-0;
                let tmpSum = ul.querySelector('.sum').innerHTML-0;
                sum += tmpSum;
                num += tmpNum;
            }
        });
        sum = parseInt(sum * 100)/100;//取整保留两位小数
        sum = sum.toFixed(2);
        //将价格和数量追加到页面
        this.$('.sumprice-top strong').innerHTML = num;
        this.$('.summoney span').innerHTML = sum;
    }
     //获取节点
     $(ele) {
        let res = document.querySelectorAll(ele);
        // 如果获取到的是,当个节点集合,就返回单个节点,如果是多个节点集合,就返回整个集合.
        return res.length == 1 ? res[0] : res;
    }
}
new Cart;