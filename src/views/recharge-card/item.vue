<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="请输入关键字" style="width: 200px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.open_status" placeholder="请选择状态" clearable class="filter-item mr-1" style="width: 130px">
        <el-option v-for="(item, index) in statusOptions" :key="index" :label="item" :value="index" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-check" @click="bulkUpdateStatus(1)">
        开启
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-close" @click="bulkUpdateStatus(0)">
        关闭
      </el-button>
      <el-button v-waves class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="dialogFormVisible = true">
        生成卡密
      </el-button>
      <el-button v-waves class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="handleUpload">
        导入卡密
      </el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="兑换码">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" label="密码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" label="可用余额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" label="购卡会员" align="center">
        <template>
          <span />
        </template>
      </el-table-column>
      <el-table-column width="160px" label="绑定时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.payment_at }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="开启状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.open_status | openStatusType">
            {{ row.open_status | openStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{row}">
          <el-button v-if="row.open_status === 0" type="primary" size="mini" @click="handleModifyStatus(row, 1)">
            开启
          </el-button>
          <el-button v-if="row.open_status === 1" type="info" size="mini" @click="handleModifyStatus(row, 0)">
            冻结
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="卡密管理" width="30%" :visible.sync="dialogFormVisible">
      <el-form ref="couponForm" :rules="rules" :model="couponForm" label-position="left" label-width="110px" style="width: 80%; margin-left:50px;">
        <el-form-item label="卡券前缀">
          <el-input v-model="couponForm.prefix" />
        </el-form-item>
        <el-form-item label="起始编号" prop="start_number">
          <el-input-number v-model="couponForm.start_number" width="300px" :min="1" :max="10000000000000000" />
        </el-form-item>
        <el-form-item label="卡券数量" prop="quantity">
          <el-input-number v-model="couponForm.quantity" :min="1" :max="100000" />
        </el-form-item>
        <el-form-item label="编码长度" prop="length">
          <el-input-number v-model="couponForm.length" :min="4" :max="12" />
          <div>
            <small class="length-hint">编码长度必须介于 4 - 12 之间</small>
          </div>
        </el-form-item>
        <el-form-item label="卡密默认状态">
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
    <el-dialog title="导入卡密" width="30%" :visible.sync="importDialogFormVisible">
      <div class="import-container">
        <div>
          <el-button slot="trigger" size="small" type="info" @click="handleDownloadTemplate">下载模板</el-button>
        </div>
        <div>
          <el-upload
            action=""
            :http-request="handleFile"
            accept=".xlsx"
          >
            <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import {
  fetchList,
  createItem,
  updateItemStatus,
  bulkUpdateItem,
  exportItem,
  importRechargeCardTemplate, importRechargeCard
} from '@/api/recharge-card-item'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import fileDownload from 'js-file-download'
const defaultCouponForm = {
  prefix: null,
  start_number: null,
  quantity: 10,
  length: null,
  status: 1
}
export default {
  name: 'RechargeCardItems',
  components: { Pagination },
  directives: { waves },
  filters: {
    openStatusFilter(status) {
      const statusMap = {
        0: '未开启',
        1: '已开启'
      }
      return statusMap[status]
    },
    redemptionStatusFilter(status) {
      const statusMap = {
        0: '未兑换',
        1: '已兑换'
      }
      return statusMap[status]
    },
    openStatusType(status) {
      const statusMap = {
        0: 'primary',
        1: 'success'
      }
      return statusMap[status]
    },
    redemptionStatusType(status) {
      const statusMap = {
        0: 'primary',
        1: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      id: null,
      list: null,
      total: 0,
      listLoading: true,
      couponForm: Object.assign({}, defaultCouponForm),
      rules: {
        title: [{ required: true, message: '标题不可为空!', trigger: 'blur' }],
        products: [{ required: true, message: '商品不可为空!', trigger: 'blur' }]
      },
      listQuery: {
        page: 1,
        limit: 20,
        code: undefined,
        open_status: undefined,
        redemption_status: undefined
      },
      dialogFormVisible: false,
      importDialogFormVisible: false,
      updateItemParameters: {
        open_status: undefined,
        items: undefined
      },
      statusOptions: ['未开启', '已开启'],
      downloadLoading: false,
      multipleSelection: []
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.id, this.listQuery).then(response => {
        this.list = response.data
        this.total = response.meta.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList(this.id)
    },
    handleModifyStatus(row, status) {
      this.updateItemParameters.open_status = status
      updateItemStatus(row.id, this.updateItemParameters).then(response => {
        row.open_status = status
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    bulkUpdateStatus(status) {
      const multipleSelection = this.multipleSelection
      if (Object.keys(multipleSelection).length === 0) {
        this.$message({
          message: '还没有选择兑换码哦~',
          type: 'warning'
        })
        return
      }
      this.updateItemParameters.open_status = status
      this.updateItemParameters.items = multipleSelection.map((item) => {
        return item.id
      })
      bulkUpdateItem(this.updateItemParameters).then(response => {
        multipleSelection.map((item) => {
          item.open_status = status
          return item
        })
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    formatItem(filterVal) {
      if (this.multipleSelection.length > 0) {
        return this.multipleSelection.map(v => filterVal.map(j => {
          return v[j]
        }))
      } else {
        return this.list.map(v => filterVal.map(j => {
          return v[j]
        }))
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleUpload() {
      this.importDialogFormVisible = true
    },
    submitForm() {
      this.$refs.couponForm.validate(valid => {
        if (valid) {
          createItem(this.id, this.couponForm).then(response => {
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
          this.$router.push({ name: 'RechargeCardItems', params: { id: this.id }})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDownloadTemplate() {
      importRechargeCardTemplate().then(res => {
        fileDownload(res, 'RechargeCardTemplate.xlsx')
      })
    },
    handleDownload() {
      this.downloadLoading = true
      exportItem(this.id).then(res => {
        fileDownload(res, 'RechargeCard.xlsx')
        this.downloadLoading = false
      })
    },
    handleFile(file) {
      const formData = new FormData()
      formData.set('file', file.file)
      importRechargeCard(this.id, formData).then(response => {
        this.importDialogFormVisible = false
        this.$message.success('导入成功!')
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss">
.import-container {
  display: flex;
  justify-content: center;
  div {
    margin: 0 5px;
  }
}
</style>
