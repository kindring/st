/*
 * @Author: kindring
 * @Date: 2021-08-26 17:29:11
 * @LastEditTime: 2021-08-26 17:34:25
 * @LastEditors: Please set LastEditors
 * @Description: 深拷贝函数 v1.0
 * @FilePath: \st\src\store\deepClone.js
 */
function deepClone(obj){
    return JSON.parse(JSON.stringify(obj));
}
export default deepClone