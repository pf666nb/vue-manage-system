import request from '../utils/request';



export const updateGoods = (id,goodStatus) =>{
    console.log(id,goodStatus)
    return request({
        url: '/admin/updateGood',
        method:'post',
        data:{
            id:id,
            goodStatus:goodStatus
        }
        

    });

}
