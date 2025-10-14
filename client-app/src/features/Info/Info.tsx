import SkiResortList from "../Redis/RedisSkiResortList/RedisSkiResortList";
import SkiResortFormModal from "../Redis/SkiResortFormModal/SkiResortFormModal";

const Info = () =>{

    return(
        <>
        <SkiResortFormModal></SkiResortFormModal>
        <SkiResortList></SkiResortList>
        </>
    

    )
}
export default Info;