function myModule(){
    //私有数据
    var msg = 'Sophie';
    //操作数据的函数
    function doSomething(){
        console.log('doSomething()' + msg.toUpperCase());
    }
    function doOtherthing(){
        console.log('doOtherthing()' + msg.toLowerCase());
    }
    // return doSomething;    //如果想暴露两个函数就暴露对象
    //向外暴露对象（给外部使用的方法）
    return {
        doSomething:doSomething,
        doOtherthing:doOtherthing
    }
}