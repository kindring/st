// 窗口类
let {BrowserWindow} = require('electron');

//自定义的窗口类,用于继承主窗口使用自定义配置
class win extends BrowserWindow{
    constructor(option,loadOption){
        const defaultOption = {
            width:800,//默认宽度
            minWidth:400,//最大宽度
            height:600,//高度
            minHeight:300,//最小高度
            frame:false,//无边款
            
        };
        super({...defaultOption,...option});
        if(loadOption){   
            this.$load(loadOption);
        }
        // 在准备完成后显示窗口
        this.once('ready-to-show',()=>{
            this.show();
        });
        // 监听自己的关闭事件,清除自己的引用
        let _that = this;
        this.on('closed', () => {_that = null});
    };
    /** 引入链接
     * @param {object} option {mod:'需要调用的自带函数',path:'文件的路径或者url地址'} 
     */
    $load(option){
        //默认的文件加载方法
        const defaultLoadOption = {
            mod:'loadFile',
            path:'./index.html'
        }
        let finalOption = {...option,...defaultLoadOption}
        console.log(finalOption);
        this[finalOption.mod](finalOption.path);
    };
    /** 创建子窗口
     * 
     */
    createWin(option){
        return new win({...option,...{parent:this}})
    }
}


module.exports = function(option,fileOrUrl){
    return new win(...arguments);
}
