function fibonacci(n){
    return n <= 2? 1 : fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(this);  //worker全局对象
var onmessage = function(event){
    var number = event.data;
    console.log('分线程接收到主线程发送的数据：'+number);
    //计算
    var result= fibonacci(number);
    postMessage(result);
    console.log('分线程向主线程返回数据：'+result);
    // alert(result);   //不能掉，因为alert()是window的方法
    //分线程中的全局对象不再是window，所以在分线程中不可能更新界面
}

