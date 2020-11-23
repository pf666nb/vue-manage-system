import request from '../utils/request';

export const login = (username,password) => {
    
    return request({
        url: '/login',
        method: 'post',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            username:username,
            password:password
        },
        transformRequest: [function(data){
            let ret = ''
            for(let it in data){
                ret += encodeURIComponent(it) + '='+encodeURIComponent(data[it])+ '&'
            }
            return ret
        }]
       
    });
};

export const logout = ()=>{
    return request({

        url:'/logout',
        method: 'post'
    })
}
