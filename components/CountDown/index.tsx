import { useState,useEffect } from "react"
import styles from './index.module.scss'
interface Iprops{
    time:number,
    onEnd:Function
}
 const CountDown = (props:Iprops)=>{
    const {time,onEnd} = props
    const [count,setCount] = useState(time || 60)
    useEffect(()=>{
       const timeid= setInterval(()=>{
            setCount((count)=>{
                if(count===0){
                    clearInterval(timeid)
                    onEnd && onEnd()
                    return count
                }               
                return count -1
            });          
        },1000)
        return ()=>{clearInterval(timeid)}
    },[time,onEnd])
    
        return(
            <div className={styles.countDown}>{count}</div>
        )
 }

 export default CountDown;