<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户列表
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
                >删除</el-button>
                <el-select v-model="query.address" placeholder="类别" class="handle-select mr10">
                    <el-option key="1" label="已审核" value="已审核"></el-option>
                    <el-option key="2" label="待审核" value="待审核"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="昵称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                <el-table-column prop="openid" label="openid" width="70" align="center"></el-table-column>
                <el-table-column prop="nickname" label="用户昵称"></el-table-column>
                <!-- <el-table-column label="物品价格">
                    <template slot-scope="scope">￥{{scope.row.newPrice}}</template>
                </el-table-column> -->
                <el-table-column label="用户头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.avatar"
                            :preview-src-list="[scope.row.avatar]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="limt"  label="用户上传物品数量限制"></el-table-column>
                <el-table-column label="用户状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state===1?'success':(scope.row.state===0?'danger':'')"
                
                        >{{scope.row.state===1?"正常":"封禁"}}</el-tag>
                    </template>
                </el-table-column>
<!-- 
                <el-table-column prop="createTime" label="发布时间"></el-table-column> -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            :class="[scope.row.state===1?'red':'green']"
                            @click="handleDelete(scope.$index, scope.row)"
                        >{{scope.row.state===1?"封禁":"解封"}}</el-button>
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
                    <el-input :disabled="true" v-model="form.openid"></el-input>
                </el-form-item>
                <el-form-item label="物品限制">
                      <el-input-number v-model="form.limt" :min="1"  :max="10" label="描述文字"></el-input-number>
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
import { getUserList,EditUser } from '../../api/user';
export default {
    name: 'basetable',
    data() {
        return {
            loading: true,
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 5
            },
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
        // 获取 easy-mock 的模拟数据
        getData() {
            getUserList(this.query.pageIndex,this.query.pageSize).then(
                res=>{
                    
                    this.tableData = res.userList
                    this.pageTotal = res.pageTotal
                    this.loading = false
                    
                }
            )
           
            // fetchData(this.query).then(res => {
            //     console.log(res);
            //     this.tableData = res.list;
            //     this.pageTotal = res.pageTotal || 50;
            // });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 修改用户状态
        handleDelete(index, row) {
            // 二次确认修改
           
        
            this.$confirm('确定要修改用户状态吗？危险操作', '提示', {
                type: 'warning'
            })
                .then(() => {
                    
                    if(row.state===1){
                        row.state=0
                    } else{
                        row.state=1
                    }
                    EditUser(row).then(
                        res=>{
                            
                            if(res.code===200){
                            this.$message.success('修改成功');
                            }else{
                            this.$message.error('修改失败');
                            }
                        }
                    )
                })
                
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
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            // this.$set(this.tableData, this.idx, this.form);
            console.log(this)
            EditUser(this.form).then(

                res=>{
                    console.log(res)
                }
            )

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
.table-td-thumb[data-v-688c2fb3] {
    display: block;
    margin: auto;
    width: 100px;
    height: 100px;
}
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
</style>
