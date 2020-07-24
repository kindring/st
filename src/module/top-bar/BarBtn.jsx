import React,{Component} from 'react';

class barbtn extends Component{
    constructor(props){
        super(props);
        //通过props设置自身状态
        console.log(props)
        this.state={
            sta:props.props.state,
            svgs: props.props.svgs,
            title:props.props.title,
            className:props.props.className,
            eventHandel:props.props.eventHandel,
        }
        console.log(this.state)
        this.clickMe = this.clickMe.bind(this);
    }
    clickMe(e,Event){
        e.preventDefault();
        /**阻止元素被选中 */
        e.returnValue = false;
        let nextState = this.state.sta + 1;
        if(nextState >= this.state.eventHandel.length){
            //超出部分恢复成正常的值
            this.state.sta = 0;
        }
        nextState = nextState>(this.state.eventHandel.length-1)?0:nextState;
        this.setState({
            sta:nextState
        });
        if(this.props.cb&&typeof this.props.cb === "function"){
            this.props.cb(Event);
        }
    }
    render(){
        return (
            <div className={this.state.className} onClick={(e)=>{
                this.clickMe(e,this.state.eventHandel[this.state.sta])
            }} title={this.state.title[this.state.sta]}>
                <img src={this.state.svgs[this.state.sta]} alt=""/>
            </div>
        )
    }
}


export default barbtn;