import request from '../utils/request';

export const getUserList = (pageIndex,pageSize) => {
    
    return request({
        url: '/admin/getUserList?pageIndex='+pageIndex+'&pageSize='+pageSize,
        method: 'get',
    
       
    });
};

export const EditUser = (form) =>{

    return request({
        url: '/admin/updateUser',
        method: 'post',
        data:{
            openid:form.openid,
            limt:form.limt,
            state:form.state
        }
    })
}

