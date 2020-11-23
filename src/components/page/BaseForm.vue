<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 发布公告
                </el-breadcrumb-item>
                <el-breadcrumb-item>公告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="公告id">
                        <el-input :disabled="true" v-model="form.noticeid"></el-input>
                    </el-form-item>
                 
                    <el-form-item label="公告内容" v-loading="loading">
                        <el-input type="textarea" rows="5" v-model="form.notice"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="onSubmit">发布公告</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { getNotive ,postNotice} from '../../api/index';
export default {
    name: 'baseform',
    data() {
        return {
            loading:true,
            form: {
                noticeid: '',
                notice: ''
            }
        };
    },
     created() {
        this.getNo();
    },
    methods: {
        getNo(){
            getNotive().then(res =>{
                
                this.form.notice = res.data[0].notice
                this.form.noticeid = res.data[0].noticeid
                this.loading = false
            })
        },

        onSubmit() {
            this.loading = true
            postNotice(this.form).then(res=>{
                 this.$message.success('提交成功！');
                 this.loading = false
            })
           
        }
    }
};
</script>