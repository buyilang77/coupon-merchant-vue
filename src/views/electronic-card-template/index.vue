<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="handleCreateStore">
        添加模板
      </el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="模板名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="来自">
        <template slot-scope="{row}">
          <span>{{ row.from }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="祝福语">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="背景图片" width="120">
        <template slot-scope="{row}">
          <img :src="row.image" alt="" style="width: 40px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="editStore(row.id)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="模板管理" width="700px" :visible.sync="dialogFormVisible">
      <el-form ref="couponForm" :rules="rules" :model="couponForm" label-position="right" label-width="110px" style="width: 80%; margin-left:50px;">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="couponForm.name" />
        </el-form-item>
        <el-form-item label="来自">
          <el-input v-model="couponForm.from" placeholder="XX公司" />
        </el-form-item>
        <el-form-item label="祝福语">
          <el-input v-model="couponForm.description" type="textarea" />
        </el-form-item>
        <div style="margin: 0 0 22px 110px;"><el-link href="http://thb.piao8.net/zhufuyu.html" target="_blank">祝福语参考</el-link></div>
        <el-form-item label="卡片背景图">
          <el-upload
            class="thumbnail-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleFile"
            accept=".jpg, .jpeg, .png"
          >
            <img v-if="couponForm.image" :src="couponForm.image" alt="">
            <i v-else class="el-icon-plus thumbnail-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createData, updateData, fetchData } from '@/api/electronic-card-template'
import { image } from '@/api/upload'
import waves from '@/directive/waves'
const defaultStoreForm = {
  id: undefined,
  from: '',
  image: null,
  description: null,
  name: null
}

export default {
  name: 'ElectronicCardTemplateIndex',
  directives: { waves },
  data() {
    return {
      id: null,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      listLoading: true,
      loading: false,
      dialogFormVisible: false,
      importDialogFormVisible: false,
      multipleSelection: [],
      couponForm: Object.assign({}, defaultStoreForm),
      rules: {
        name: [{ required: true, message: '模板名称不可为空!', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    submitForm() {
      this.$refs.couponForm.validate(valid => {
        if (valid) {
          if (this.couponForm.id) {
            updateData(this.couponForm.id, this.couponForm).then(response => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.dialogFormVisible = false
            })
          } else {
            createData(this.couponForm).then(response => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.dialogFormVisible = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleFile(file) {
      const formData = new FormData()
      formData.set('file', file.file)
      image(formData).then(response => {
        this.couponForm.image = response.data.path
      })
    },
    editStore(id) {
      this.dialogFormVisible = true
      fetchData(id).then(res => {
        this.couponForm = res.data
      })
    },
    handleCreateStore() {
      this.dialogFormVisible = true
      this.couponForm = Object.assign({}, defaultStoreForm)
    }
  }
}
</script>
<style>
.thumbnail-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.thumbnail-uploader .el-upload img {
  width: 350px;
}
.thumbnail-uploader .el-upload:hover {
  border-color: #409EFF;
}
.thumbnail-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.thumbnail {
  width: 300px;
  height: 150px;
  display: block;
}
</style>
