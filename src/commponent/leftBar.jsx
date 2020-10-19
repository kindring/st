import React, { useState } from 'react';
import leftBarCss from './leftBar.css'
/**
 * 
 * @param {*} arr 数组,对象
 * id 必须
 * name 非必须
 * svg 图片 必须
 * title 标题
 * cb 点击事件
 */
function leftBar(state){
    return (
        <div className="leftBar">
            <ul className="ul">
                {
                    state.arr.map((item)=>{
                        //创建绑定事件
                        return <li className="li" key={item.id} onClick={(e)=>{
                            if(item.cb && typeof item.cb == 'function'){
                                item.cb(e)
                            }    
                        }}>
                            {item.name}
                        </li>
                    })
                }
                <li className="li"></li>
            </ul>
        </div>
    )
}


export default leftBar