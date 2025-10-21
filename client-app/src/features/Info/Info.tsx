
import { useEffect } from "react";
import { useWebSocket } from "../../services/useWebSocket";
import SkiResortList from "../Redis/RedisSkiResortList/RedisSkiResortList";
import SkiResortFormModal from "../Redis/SkiResortFormModal/SkiResortFormModal";
import { useStore } from "../../stores/store";

const Info = () =>{

    return(
        <>
        <SkiResortFormModal></SkiResortFormModal>
        <SkiResortList></SkiResortList>
        </>
    

    )
}
export default Info;