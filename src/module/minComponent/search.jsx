//搜索框
import React,{Component} from 'react'

import searchSvg from '../../svgs/search2.svg';

import './search.css'

//新的公共父组件,内部包含搜索框组件,以及返回信息组件
class searchBox2 extends Component{
    constructor(props){
        super(props)
        this.keyUp = this.keyUp.bind(this);
        this.suggestFn = this.suggestFn.bind(this);
        this.onBulr = this.onBulr.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.timer = null;
        /** 当前的关键字 */
        this.keyNow = '';

        /** 提示的关键字 默认为value*/
        this.keyCode = props.keyCode || 'value';
        /** 提示每项的唯一key 值 默认为id */
        this.idCode = props.idCode || 'id';
    }
    /** 搜索提示函数 */
    suggestFn(key){
        console.log('hhh');
        console.log(key);
        // 判断当前的关键字是否和之前的关键字一样,一样则跳过无需再次搜索
        if(this.keyNow == key){
            return;
        }
        this.keyNow = key;
        //改变搜索值
        let suggest = this.refs.suggest;
        // 搜索数据中
        suggest.setState({
            suggestState:1,
            selected:0,
            suggests:[]//设置搜索结果列表为空
        })
        this.timer = setTimeout(()=>{
            suggest.setState({
                suggestState:2,
                suggests:[
                    {
                        id:1,
                        value:key
                    },
                    {
                        id:2,
                        value:'2'+key
                    },
                    {
                        id:3,
                        value:'你输入了'+key
                    },
                    {
                        id:4,
                        value:'4'+key
                    },
                    {
                        id:5,
                        value:'5'+key
                    },
                ]
            })
        },1000)
        
    }
    /** 正式的搜索函数 */
    searchFn(keywords){
        console.log(keywords)
    }
    /** 键盘按下事件 切换上下 */
    keyUp(e){
        console.log(e.keyCode)
        let suggest = this.refs.suggest;
        getKey = getKey.bind(this.refs.input)
        let i = suggest.state.selected;
        let l = suggest.state.suggests.length;
        /** 搜索设置关键字函数 */
        function getKey(i,keyCode){
            //获取数据
            let arr = suggest.state.suggests;
            i--;
            //设置搜索字的值
            let key = ''
            if(arr[i]&&arr[i][keyCode]){
                key = arr[i][keyCode]
            }
            if(key !== ''){
                this.setState({
                    searchKey:key
                })
            }
        }
        switch (e.keyCode) {
            case 38:
                console.log('按下了上建')
                // 查看是否为0
                if(i === 0){
                    return;
                }
                // 将当前值减去1
                i--;
                // 判断是否小于1
                if(i<1){
                    i=l;
                }
                //设置搜索选项
                suggest.setState({
                    selected:i
                })
                getKey(i,this.keyCode)
                break;
            case 40:
                console.log('按下了下建')
                // 将当前值减去1
                i++;
                // 判断是否小于1
                if(i>l){
                    i=1;
                }
                //获取当前选项的
                suggest.setState({
                    selected:i
                })
                getKey(i,this.keyCode)
                console.log(i)
                break;
            case 13:
                console.log('按下了确认键');
                // 直接获取当前输入框的值进行搜索
                // 直接进行搜索
                this.refs.input.InputSearchCb();
                break;
            default:
                break;
        }
    }
    /** 搜索提示项的点击事件 */
    /** 失去焦点隐藏搜索提示框 */
    onBulr(){
        let suggest = this.refs.suggest;
        suggest.setState({
            suggestState:0,//关闭搜索列表显示
            selected:0,//关闭搜索显示结果
        })
    }
    /**元素获得焦点 */
    onFocus(){
        let suggest = this.refs.suggest;

        console.log(suggest)
        //查看是否有搜索关键字列表
        if(suggest.state.suggests&&suggest.state.suggests.length>=1){
            suggest.setState({
                suggestState:2,//关闭搜索列表显示
            })
        }
        
    }
    render(){
        return (
            <div className="searchBox" onKeyUp = {this.keyUp} onBlur={this.onBulr} onFocus={this.onFocus}>
                <InputBox suggestFn={this.suggestFn} cb={this.searchFn} ref='input' ></InputBox>
                <SuggestBox ref='suggest' cb={this.searchFn} itemKey={this.idCode} itemValue={this.keyCode}></SuggestBox>
            </div>
        )
    }
}

/**输入框组件 */
class InputBox extends Component{
    constructor(props){
        super(props);

        this.state = {
            searchKey:''
        }
        /** 是否绑定了搜索触发函数 */
        if(props.suggestFn && typeof props.suggestFn == "function"){
            this.suggestFlag = true;
        }else{
            this.suggestFlag = false;
        }
        /** 初始化基本数据,如节流时间 */
        this.timeValue = props.timeValue || 550;
        /** 防抖时间 */
        this.timer = null;
        /** 绑定时间函数 */
        this.InputChangeEvent = this.InputChangeEvent.bind(this);
        this.InputSearchCb = this.InputSearchCb.bind(this);
    }
    /** 绑定搜索提示事件 */
    InputChangeEvent(e){
        //判断是否有搜索函数
        if(!this.suggestFlag){
            return false;
        }
        // 清除事件绑定函数
        clearTimeout(this.timer);
        this.timer = null;
        e.persist();
        let value = e.target.value;
        // 设置绑定事件
        this.setState({searchKey:value});
        // console.log('按下键盘');
        // console.log(this.timeValue)
        this.timer = setTimeout(()=>{
            //时间到时自行调用api获取数据
            this.props.suggestFn(value);
        },this.timeValue);
    }
    /** 绑定真正的搜索函数 */
    InputSearchCb(){
        // 获取搜索关键词,传入callback函数
        let value = this.refs.searchInput.value;
        if(this.props.cb && typeof this.props.cb == 'function')
        {
            this.props.cb(value);
        }
    }
    render(){
        var keywords = this.state.searchKey;
        return (
            <div className="inputBox">
                <div className="input">
                    <input
                        type="text"
                        className="searchInput"
                        placeholder="搜索点歌曲吧,这里可以输入"
                        // value={this.state.searchKey}
                        ref="searchInput"
                        onInput={(e)=>{this.InputChangeEvent(e)}  }
                        value={keywords}
                    />
                    </div>
                    <div className="btn" onClick={this.InputSearchCb} >
                        <img src={searchSvg} alt="" className="svg"/>
                    </div> 
            </div>
        )
    }
}

/**搜索提示框组件 */
class SuggestBox extends Component{
    constructor(props)
    {
        super(props)
        //功能描述,可以用来展示搜索结果,自定义结果对象.  显示多种的搜索状态,如搜索状态,是否显示
        this.state = {
            /**是否显示整体的框架 */
            show:false,
            /** 搜索提示状态  0->不显示,未搜索 1->搜索中 2->搜索完成显示搜索列表 3->搜索失败,顺便显示原因 */
            suggestState:0,
            /** 搜索提示结果 */
            suggests:[],
            /** 搜索选中项  0->表示没有任何选中  对应的值为该数值减一 */
            selected:0,
        }
        //绑定显示效果
        this.itemKey_index = this.props.itemKey||'id';
        this.itemValue_index = this.props.itemValue||'value';
        this.bindClickHandel = this.bindClickHandel.bind(this)
    }
    /** 绑定点击事件 */
    bindClickHandel(item){
        //查看是否有回调函数进行直接搜索
        let keyworld = item[this.itemValue_index];
        if(this.props.cb && typeof this.props.cb == 'function'){
            this.props.cb(keyworld);
        }
    }
    render(){
        if(this.state.suggestState == 2){
            // 搜索出结果进行数据的渲染
            return (
                <div className="suggestBox">
                    <ul >
                        {
                            this.state.suggests.map((item,i)=>{
                                return (
                                <li className={(this.state.selected-1) == i?"suggestItem selected":"suggestItem"} 
                                key={item[this.itemKey_index]} title={item[this.itemValue_index]}
                                onClick={()=>{this.bindClickHandel(item)}}
                                >
                                    {item[this.itemValue_index]}
                                </li>)
                            })
                        }
                    </ul>
                </div>
            )
        }else if(this.state.suggestState != 0){
            return (
                <div className="suggestBox">
                    <div className="tips">正在搜索中</div>
                </div>
            )
        }else{
            return (
                <div className="suggestBox suggestHide">
                    隐藏结果
                </div>
            )
        }
    }
}




export default searchBox2;