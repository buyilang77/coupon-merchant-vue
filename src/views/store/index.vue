<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="handleCreateStore">
        添加门店
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="门店地址">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
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

    <el-dialog title="门店管理" width="30%" :visible.sync="dialogFormVisible">
      <el-form ref="couponForm" :rules="rules" :model="couponForm" label-position="left" label-width="110px" style="width: 80%; margin-left:50px;">
        <el-form-item label="门店名称">
          <el-input v-model="couponForm.name" />
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
import waves from '@/directive/waves' // waves directive
const defaultStoreForm = {
  id: null,
  name: null
}

export default {
  name: 'StoreItems',
  directives: { waves },
  data() {
    return {
      id: null,
      list: null,
      listLoading: true,
      loading: false,
      dialogFormVisible: false,
      importDialogFormVisible: false,
      multipleSelection: [],
      couponForm: Object.assign({}, defaultStoreForm),
      rules: {
        name: [{ required: true, message: '标题不可为空!', trigger: 'blur' }]
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
        this.couponForm.id = res.data.id
        this.couponForm.name = res.data.name
      })
    },
    handleCreateStore() {
      this.dialogFormVisible = true
      this.couponForm = Object.assign({}, defaultStoreForm)
    }
  }
}
</script>
