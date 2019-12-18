
function start() {
    // 页面加载的时候执行
    //　进入页面的时间为当前时间，浏览时长开始累加，判断用户活跃状态计时开始
    is_send = false;
    login_time = (new Date()).valueOf();
    read_time = 0;
    activate = 0;
    sleep_time = 0;

    var today_integral = localStorage.getItem("today_integral");
    if (today_integral){
         if(today_integral >= 100){
            is_send_integral = 0
        }else{
            is_send_integral = 1
        }
    }else{
        is_send_integral =1
    }



    // 监听滚动条，滚动条一旦滚动就执行该函数
    window.addEventListener("onscroll", function () {
        // alert(1);
        // console.log(onscroll);
        if(sleep_time >= 150){
            window.location.reload()
        };
        activate = 0;
        sleep_time = 0;});

    window.addEventListener("mousedown", function () {
        // alert(1);
         if(sleep_time >= 120){
            window.location.reload()
        };
        activate = 0;
        sleep_time = 0;});

    window.addEventListener("mousemove", function () {
        // alert(1);
         if(sleep_time >= 150){
            window.location.reload()
        };
        activate = 0;
        sleep_time = 0;});


    // 窗口关闭的执行
    window.addEventListener('beforeunload', function() {
        var logout_time = (new Date()).valueOf();
        var data = {
            "login_time":login_time,
            "read_time":read_time,
            "activate":activate,
            "logout_time":logout_time,
            "from":"关闭"
        };
        send_data(data);
        is_send = true;
    });


    t = setInterval(function () {
       // 判断用户是否在看
        if(activate >= 90){
            if(sleep_time >= 150){
            //  说明用户已不再看新闻
                // 如果从打开到现在没有任何操作，说明这三分钟没有任何意义这种数据没意义
                if(activate !== read_time){
                   var logout_time = (new Date()).valueOf();
                   var data = {
                        "login_time":login_time,
                        "read_time":read_time,
                        "activate":activate,
                        "logout_time":logout_time,
                        "from":"超时"
                   };
                   send_data(data)
                }
                window.clearInterval(t);
                is_send = true;
            }
            sleep_time++
        }else{
            console.log(read_time);
            read_time++;
            activate++;
            if (read_time >=20 && is_send_integral === 1){
                console.log('开始了');
                send_integral();
                is_send_integral = 0
            }
        }

    }, 1000)

}
start();


function send_data(data) {
    　var news_id_list = window.document.getElementsByClassName('intransit');
     // console.log(news_id_list);
    　var news_id = news_id_list[0].id;
     var openid = $.cookie('openid');

     data['openid'] = openid;
     data['news_id'] = news_id;
     // console.log(data);
     $.ajax({
             type: "POST",
             url: "/wx/user_action/",
             async: false,
             contentType: 'application/x-www-form-urlencoded;charset=utf-8',
             data: data,
             dataType: "json",
             headers: {"X-CSRFToken":$.cookie('csrftoken')},
             success: function(data){
                 },
             error:function(e){
                 // console.log(e);
             }
         });
}


        let str='';
function send_integral() {
     let popout=window.document.getElementById('popout');
        console.log(popout);
        let awaitIng=window.document.getElementById('awaitIng');
    var openid = $.cookie('openid',openid);
    var time = new Date();
    console.log(time);
    var obj = {"openid":openid,"time":time};
    let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('post', 'http://home.insight-time.com/wx/integral_regist/', true);
    xhr.setRequestHeader("X-CSRFToken",$.cookie('csrftoken'));
    let data = JSON.stringify(obj);
    console.log(data);
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 删除历史全局历史数
            data = JSON.parse(xhr.responseText);
            let integral = data.integral;
            let today_integral = data.today_integral;
            localStorage.setItem("today_integral",today_integral);
            console.log(integral);
            console.log(today_integral);
            str+= `
           
            <div class="Popout-text" id="Popout-text">
            本次阅读已成功获取<span>10</span>积分,您今日累计获得<span>${today_integral}</span>积分,您的累计总积分为<span>${integral}</span>
             </div>
            `;
            console.log(str);

            popout.innerHTML+=str;
            awaitIng.style.display='block';
                awaitIng.onclick=function () {
                     awaitIng.style.display='none';
                }

        }else{

        }
    }
}



function thumbs() {

    var news_id_list = window.document.getElementsByClassName('base');
    // console.log(news_id_list);
    var news_id = news_id_list[0].id;
    var token = sessionStorage.getItem('token');
     var openid = $.cookie('openid');



    if (openid && token){
        var data = {
            "news_id":news_id,
            "user_id":openid
        };
        $.ajax({
             type: "POST",
             url: "/wx/give_thumb/",
             async: false,
             contentType: 'application/x-www-form-urlencoded;charset=utf-8',
             data: data,
             dataType: "json",
             headers: {"X-CSRFToken":$.cookie("csrftoken"),"Authorization":'JWT'+token},
             success: function(data){
                 // console.log(data)
                 },
             error:function(e){
                 // console.log(e);
             }
         });
    }
    else{
        location.href = 'http://home.insight-time.com/home/login/';
    }
}


function showMessage(message,type,time) {
        let str = ''
        switch (type) {
            case 'success':
                str = '<div class="success-message" style="width: 300px;height: 40px;text-align: center;background-color:#daf5eb;;color: rgba(59,128,58,0.7);position: fixed;left: 43%;top: 10%;line-height: 40px;border-radius: 5px;z-index: 9999">\n' +
                    '    <span class="mes-text">'+message+'</span></div>'
                break;
            case 'error':
                str = '<div class="error-message" style="width: 300px;height: 40px;text-align: center;background-color: #f5f0e5;color: rgba(238,99,99,0.8);position: fixed;left: 43%;top: 10%;line-height: 40px;border-radius: 5px;;z-index: 9999">\n' +
                    '    <span class="mes-text">'+message+'</span></div>'
        }
        $('body').append(str)
        setTimeout(function () {
            $('.'+type+'-message').remove()
        },time)
    }
