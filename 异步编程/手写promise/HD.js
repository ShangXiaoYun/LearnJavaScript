class HD{
    static PENDING ='pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(executor){
        this.status = HD.PENDING;
        this.value = null;
        this.callbacks = []; //把要执行的函数放进来，以后要执行再拿出来执行
        try{
            executor(this.resolve.bind(this),this.reject.bind(this));
        }catch(error){
            this.reject(error);
        }
    }
    //类里面遵循严格模式,
    resolve(value){
        if(this.status === HD.PENDING){
            this.status = HD.FULFILLED;
            this.value = value;
            setTimeout(()=>{
                this.callbacks.map(callback=>{
                    callback.onFulfilled(value);
                });
            });      
        }
    }

    reject(reason){
        if(this.status === HD.PENDING){
            this.status = HD.REJECTED;
            this.value = reason;
            setTimeout(()=>{
                this.callbacks.map(callback=>{
                    callback.onRejected(reason);
                });
            });
        }
    }

    then(onFulfilled,onRejected){
        if(typeof onFulfilled !== 'function'){
            onFulfilled =() => {return this.value};
        }
        if(typeof onRejected !== 'function'){
            onRejected =() => {return this.value};
        }

        let promise =  new HD((resolve,reject) => {
            if(this.status === HD.PENDING){
                //函数是以后要执行的
                this.callbacks.push({
                    onFulfilled:value=>{
                        this.parse(promise,onFulfilled(value),resolve,reject); 
                    },
                    onRejected:value =>{
                        this.parse(promise,onRejected(value),resolve,reject);     
                    }
                });
            }
            // console.log(this);
            //只有状态改变时才执行
            if(this.status === HD.FULFILLED){
                /*
                放在定时器里面就会在下一次事件循环再执行，
                这样在可以满足主线程的所有代码执行完，再执行promise.then()
                */
                setTimeout(()=>{
                    this.parse(promise,onFulfilled(this.value),resolve,reject); 
                });
            }
            if(this.status === HD.REJECTED){
                setTimeout(()=>{
                    this.parse(promise,onRejected(this.value),resolve,reject); 
                });
            }
        });
        return promise;
    }

    parse(promise,result,resolve,reject){
        if(promise === result){
            throw new TypeError("Chaining cycle detected");
        }
        try{
            if(result instanceof HD){
                result.then(value => {
                    resolve(value);
                },reason => {
                    reject(reason);
                })
            }else{
                resolve(result);
            }
        }catch(error){
            reject(error);
        }  
    }

    //静态方法
    static resolve(value){
        return new HD((resolve,reject) => {
            if(value instanceof HD){
                value.then(resolve,reject);
            }else{
                resolve(value);
            }
        });
    }

    static reject(value){
        return new HD((resolve,reject) =>{
            reject(value)
        });
    }

    static all(promises){
        //记录有几个promise是成功的
        const values = [];
        return new HD((resolve,reject) => {
            promises.forEach((promise)=>{
                promise.then(value =>{
                    values.push(value);
                    if(values.length === promises.length){
                        resolve(values);
                    }
                },reason => {
                    reject(reason);
                })
            })
        })
    }

    static race(promises){
        return new HD((resolve,reject) => {
            promises.map((promise)=>{
                promise.then(value =>{
                    resolve(value);
                },reason => {
                    reject(reason);
                })
            })
        })
    }
}

// new Promise((resolve,reject)=>{
//     resolve("解决");
//     reject("拒绝");
// }).then(value =>{

// },reason =>{

// })