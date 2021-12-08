<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="handleCreateStore">
        添加门店
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="门店名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片" width="120">
        <template slot-scope="{row}">
          <img :src="row.photo" alt="" style="width: 40px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" width="120">
        <template slot-scope="{row}">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机" width="120">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="门店地址" width="400">
        <template slot-scope="{row}">
          <span>{{ CodeToText[row.region[0]] + CodeToText[row.region[1]] + CodeToText[row.region[2]] + ', ' + row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="营业时间" width="180">
        <template slot-scope="{row}">
          <span>{{ row.business_hours[0] + ' - ' + row.business_hours[1] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="经营状态" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusType">
            {{ row.status | statusFilter }}
          </el-tag>
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

    <el-dialog title="门店管理" width="700px" :visible.sync="dialogFormVisible">
      <el-form ref="couponForm" :rules="rules" :model="couponForm" label-position="right" label-width="110px" style="width: 80%; margin-left:50px;">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="couponForm.name" />
        </el-form-item>
        <el-form-item label="照片">
          <el-upload
            class="thumbnail-uploader"
            action=""
            :show-file-list="false"
            :http-request="handleFile"
            accept=".jpg, .jpeg, .png"
          >
            <img v-if="couponForm.photo" :src="couponForm.photo" alt="">
            <i v-else class="el-icon-plus thumbnail-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="couponForm.contact" />
        </el-form-item>
        <el-form-item label="门店地址" prop="region">
          <el-cascader v-model="couponForm.region" class="width-100" size="large" :options="regionOptions" />
        </el-form-item>
        <el-form-item prop="address">
          <el-input v-model="couponForm.address" placeholder="请输入详细地址" style="margin-top: 10px" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="couponForm.phone" />
        </el-form-item>
        <el-form-item label="营业时间" prop="business_hours">
          <el-time-picker
            v-model="couponForm.business_hours"
            is-range
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="经营状态">
          <el-radio-group v-model="couponForm.status" class="filter-item">
            <el-radio v-for="(item, index) in statusOptions" :key="index" :label="index"> {{ item }} </el-radio>
          </el-radio-group>
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
import { fetchList, fetchStore, destroy, createStore, updateStore } from '@/api/store'
import { image } from '@/api/upload'
import waves from '@/directive/waves'
import { regionData, CodeToText } from 'element-china-area-data' // waves directive
const defaultStoreForm = {
  id: undefined,
  name: null,
  photo: null,
  contact: null,
  address: null,
  phone: null,
  business_hours: null,
  status: 1
}

export default {
  name: 'StoreItems',
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未开启',
        1: '已开启'
      }
      return statusMap[status]
    },
    statusType(status) {
      const statusMap = {
        0: 'info',
        1: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      CodeToText,
      id: null,
      list: null,
      listLoading: true,
      loading: false,
      dialogFormVisible: false,
      importDialogFormVisible: false,
      multipleSelection: [],
      couponForm: Object.assign({}, defaultStoreForm),
      statusOptions: ['未开启', '已开启'],
      regionOptions: regionData,
      rules: {
        name: [{ required: true, message: '标题不可为空!', trigger: 'blur' }],
        contact: [{ required: true, message: '联系人不可为空!', trigger: 'blur' }],
        region: [{ required: true, message: '省市区不可为空!', trigger: 'change' }],
        address: [{ required: true, message: '地址不可为空!', trigger: 'blur' }],
        phone: [{ required: true, message: '手机不可为空!', trigger: 'blur' }],
        business_hours: [{ required: true, message: '营业时间不可为空!', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    submitForm() {
      this.$refs.couponForm.validate(valid => {
        if (valid) {
          if (this.couponForm.id) {
            updateStore(this.couponForm.id, this.couponForm).then(response => {
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
            createStore(this.couponForm).then(response => {
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
        this.couponForm.photo = response.data.path
      })
    },
    handleDestroy(id, index) {
      destroy(id).then(response => {
        this.$notify({
          title: 'Success',
          message: '删除成功!',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    editStore(id) {
      this.dialogFormVisible = true
      fetchStore(id).then(res => {
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
