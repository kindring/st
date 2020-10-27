import React,{useState} from 'react'
import css from './switchBtn.css'
function SwitchBtn(props){
    const [model, setModel] = useState(true);
    let className = 'bg model1'
    function changeValue(){
        setModel(!model)
        console.log(model)
    }
    return (
        <div className="switch-btn" onClick={changeValue}>
            <div className={`bg ${model?'model1':'model2'}`}></div>
            <div className="btn">
                {props.value1}
            </div>
            <div className="btn">
                {props.value2}
            </div>
        </div>
    )
}

export default SwitchBtn;