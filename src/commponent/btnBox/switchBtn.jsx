import React,{useState,forwardRef} from 'react'
import css from './switchBtn.css'
// function SwitchBtn(props,ref){
//     const [model, setModel] = useState(true);
//     let className = 'bg model1'
//     function changeValue(){
//         setModel(!model)
//         console.log(model)
//     }
//     return (
//         <div className="switch-btn" onClick={changeValue} ref={ref}>
//             <div className={`bg ${model?'model1':'model2'}`}></div>
//             <div className={`full-bg ${model?'full-model1':'full-model2'}`}></div>
//             <div className="btn">
//                 {props.value1}
//             </div>
//             <div className="btn">
//                 {props.value2}
//             </div>
//         </div>
//     )
// }
const SwitchBtn = forwardRef((props,ref)=>{
    const [model, setModel] = useState(true);
    let className = 'bg model1'
    let value = props.value1;
    function changeValue(){
        setModel(!model);
        //触发值改变事件
       value = model?props.value2:props.value1
       if(typeof props.OnChange == 'function')
       {
           props.OnChange(value)
       }
    }
    return (
        <div className="switch-btn" onClick={changeValue} ref={ref} >
            <div className={`bg ${model?'model1':'model2'}`}></div>
            <div className={`full-bg ${model?'full-model1':'full-model2'}`}></div>
            <div className="btn">
                {props.value1}
            </div>
            <div className="btn">
                {props.value2}
            </div>
        </div>
    )
})

export default SwitchBtn;