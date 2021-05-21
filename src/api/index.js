import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const getNotive = ()=>{
    return request({
        url: '/getNotice',
        method: 'post'
    })
}
export const postNotice = (form)=>{
    console.log(form.noticeid)
    return request({
        url: '/admin/postNotice',
        method: 'post',
        data:{
            noticeid:form.noticeid,
            notice:form.notice,
        }
    })

}
export const queryGoodsData = (query) =>{
    console.log(query)
    return request({
        url: '/admin/queryGoodsData',
        method: 'post',
        data:{
            pageIndex:query.pageIndex,
            pageSize:query.pageSize,
            goodStatus:query.goodStatus,
            goodsName:query.goodsName
            
        }
    })
}

export const getGoodsData = (pageIndex,pageSize) =>{
    return request({
        url: '/admin/getGoodList?pageIndex='+pageIndex+'&pageSize='+pageSize,
        method:'get',
        

    });

}
