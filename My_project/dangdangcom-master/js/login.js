//登录功能
class Login{
    constructor(){
        //给登录按钮绑定点击事件
        this.$('.btn_Login').addEventListener('click' , this.loginHander);

        //判断受否有回调地址
        let search = location.search; // url问号之后的部分
        if(search){
            this.url = search.split('=')[1];//取等号后面的部分
        }

    }
    //登录数据获取和传输
    loginHander = ()=>{//箭头函数防止事件函数this指向改变
        //获取表单元素
        let form = document.forms[0].elements;
        //获取表单元素value
        let username = form.uname.value.trim();
        let password = form.password.value.trim();
        //非空验证
        if(!username || !password) throw new Error('用户名或密码不能为空');
        //发送ajax请求实现登录
        //axios默认以json的形式请求和编码参数
        //要符合人家要求在network里面调试
        //当变量名和属性名一致时直接写变量名
        //// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';请求格式
        //key=val&key=val  //要求参数格式
        let param = `username=${username}&password=${password}`;
        console.log(param);
        axios.post('http://localhost:8888/users/login' , param,{
            //设置请求头配置请求格式
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res=>{
            console.log(res);
            //根据返回数据判断登路状态将用户信息保存
            if(res.status == 200 && res.data.code == 1){
                //将token和用户id保存到local
                localStorage.setItem('token' , res.data.token);
                localStorage.setItem('user_id' , res.data.user.id);
                if(this.url){//判断有无回调地址
                    //有就跳转
                    location.href = this.url;
                }else{
                    location.href = './index.html'
                }
            }
        })

    }

    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new Login;
