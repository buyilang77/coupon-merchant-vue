<template>
  <div class="app-container mr-1">
    <div class="filter-container">
      <el-input v-model="listQuery.order_num" placeholder="请输入订单号" style="width: 200px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="false" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="订单号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.order_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recharge_card_item.recharge_card.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recharge_card_item.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提货信息" align="center">
        <template slot-scope="{row}">
          <el-tag style="margin-right:2px">{{ row.product.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.total_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核销日期" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.write_off_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.contacts + ' ' + row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type === 'shipped'" label="物流单号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tracking_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status === 0" type="primary" size="mini" @click="handleWriteOff(row)">
            核销
          </el-button>
          <el-button v-else size="mini" disabled @click="handleWriteOff(row)">
            已核销
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="预约核销" :visible.sync="dialogUpdateFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="卡号">
          <el-input v-model="temp.recharge_card_item.code" :disabled="true" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="temp.recharge_card_item.password" :disabled="true" />
        </el-form-item>
        <el-form-item label="商品">
          <el-input v-model="temp.product.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="当前状态">
          <el-tag>{{ temp.status | statusFilter }}</el-tag>
        </el-form-item>
        <el-form-item label="收货人" prop="phone">
          <el-input v-model="temp.contacts" />
        </el-form-item>
        <el-form-item label="收货人电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmWriteOff(temp)">核销</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchOrder, fetchOrders, updateData, updateOrder } from '@/api/recharge-card'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { regionData } from 'element-china-area-data'
export default {
  name: 'RechargeCardOrder',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未核销',
        1: '已核销'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      logistics_companies: [],
      product_list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        order_num: undefined,
        status: undefined
      },
      statusOptions: ['未发货', '已发货'],
      dialogFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogTitle: '编辑发货信息',
      temp: {
        id: undefined,
        contacts: null,
        phone: null,
        recharge_card_item: {
          code: '',
          password: ''
        },
        product: {
          name: ''
        },
        status: null
      },
      rules: {
        contacts: [{ required: true, message: '收货人不可为空!', trigger: 'blur' }],
        phone: [{ required: true, message: '收货电话不可为空!', trigger: 'blur' }]
      },
      downloadLoading: false,
      regionOptions: regionData,
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    getList() {
      fetchOrders(this.listQuery).then(res => {
        this.list = res.data.data
        this.total = res.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleWriteOff(row) {
      fetchOrder(row.id).then(res => {
        this.temp = res.data
        this.temp.code = res.data.recharge_card_item.code
        this.getList()
      })
      this.dialogUpdateFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateData(tempData.id, tempData).then(response => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
    },
    formatItem(filterVal) {
      let items = []
      if (this.multipleSelection.length > 0) {
        items = this.multipleSelection
      } else {
        items = this.list
      }
      return items.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    confirmWriteOff(temp) {
      updateOrder(temp.id, temp).then(response => {
        this.getList()
        this.dialogUpdateFormVisible = false
        this.$notify({
          title: 'Success',
          message: response.message,
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style scoped>
.line {
  text-align: center;
}
</style>

