import React,{Component} from 'react';

import './home.css';

import SearchCom from '../minComponent/search.jsx';

function s(key,cb){
    let mod = [
        {
            key:key,
            id:1,
            name:'hhh'
        },
        {
            id:2,
            name:'aaa'
        },
        {
            id:3,
            name:'bbbbb'
        },
    ]
    cb(mod);
}
//绘制主页
class homePage extends Component{
    constructor(props){
        super(props);
        
    }

    render(){
        return (
            <div className="homePage">
                <SearchCom suggestFn={s} ></SearchCom>
            </div>
        )
    }

}


export default homePage;