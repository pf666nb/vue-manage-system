<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 审核列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.goodStatus" placeholder="类别" class="handle-select mr10">
                    <el-option key="1" label="已审核" value="1"></el-option>
                    <el-option key="0" label="待审核" value="0"></el-option>
                </el-select>
                <el-input v-model="query.goodsName" placeholder="物品名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
            </div>
            <el-table
                v-loading="loading"
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="物品ID" width="70" align="center"></el-table-column>
                <el-table-column prop="goodsName" label="物品名字"></el-table-column>
                <el-table-column prop="goodsDesc" label="物品简介"></el-table-column>
                <el-table-column label="物品价格">
                    <template slot-scope="scope">￥{{scope.row.newPrice}}</template>
                </el-table-column>
                <el-table-column label="物品封面(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.imageUrl"
                            :preview-src-list="[scope.row.imageUrl]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="authorName" label="用户昵称"></el-table-column>
                <el-table-column label="物品状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.goodStatus===1?'success':(scope.row.goodStatus===0?'danger':'')"
                        >{{scope.row.goodStatus===1?"上架":"待审核"}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="发布时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            class=""
                            icon="el-icon-circle-check"
                            :class="[scope.row.goodStatus===1?'red':'green']"
                            @click="handleEdit(scope.$index, scope.row)"
                        >{{scope.row.goodStatus===1?"下架":"上架"}}</el-button>
                        <!-- <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除物品</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>  
</template>

<script>
import { fetchData,getGoodsData,queryGoodsData } from '../../api/index';
import { updateGoods } from '../../api/goods.js';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                goodStatus: '',
                goodsName: '',
                pageIndex: 1,
                pageSize: 5
            },
            loading: true,
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {

        queryData(){
            this.loading = true
            queryGoodsData(this.query).then(res=>{
                if(res.goodList!=null){
                this.tableData = res.goodList
                this.pageTotal = res.pageTotal
                this.loading = false
                }else{
                that.$message.error('获取数据失败')
                }
            })

        },
        // 获取 easy-mock 的模拟数据
        getData() {
            
            getGoodsData(this.query.pageIndex,this.query.pageSize).then(res =>{

                console.log(res)
                this.tableData = res.goodList
                this.pageTotal = res.pageTotal
                this.loading = false
                

            })
           
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
             this.$confirm('确定要执行此操作吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    if(row.goodStatus===1){
                        row.goodStatus = 0
                    }else{
                        row.goodStatus = 1
                    }
                    this.loading=true;
                    console.log(row)
                    let that = this
                    updateGoods(row.id,row.goodStatus).then(
                        res =>{
                           this.loading=false;
                            if(res.code===200){
                             
                             that.$message.success('修改成功');
                            }else{
                             that.$message.error('修改失败')
                            }
                             
                        }
                    )

                   
        
                })
                .catch(() => {});
            // this.idx = index;
            // this.form = row;
            // this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.green {
    color: green;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.table-td-thumb[data-v-31c7c926] {
    display: block;
    margin: auto;
    width: 80px;
    height: 130px;
}
</style>
