/*
 * @Author: kindring
 * @Date: 2021-08-26 11:05:05
 * @LastEditTime: 2021-08-26 11:09:18
 * @LastEditors: Please set LastEditors
 * @Description: 帮助处理promise
 * @FilePath: \st\js\promiseHalper.js
 */
function handel (promise){
    return new Promise((resolve,reject)=>{
        promise.then(val=>{
            resolve([undefined,val])
        }).catch(err=>{
            resolve([err])
        })
    })
}

module.exports = handel;