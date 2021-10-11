<template>
  <div class="app-container mr-1">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="请输入关键字" style="width: 200px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="请选择状态" clearable class="filter-item mr-1" style="width: 130px">
        <el-option v-for="(item, index) in statusOptions" :key="index" :label="item" :value="index" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="type === 'shipped'" label="物流单号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tracking_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属活动" align="center">
        <template slot-scope="{row}">
          <span :title="row.title">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提货码" align="center">
        <template slot-scope="{row}">
          <span :title="row.code">{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所提商品" align="center">
        <template slot-scope="{row}">
          <el-tag style="margin-right:2px">{{ row.product }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提货时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.consignee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货电话" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货地址" align="center">
        <template slot-scope="{row}">
          <span>{{ formatRegion(row.region) }} {{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusType">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" :disabled="row.status === 1" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" :disabled="row.status === 1" @click="handleShipment(row)">
            发货
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="收货人" prop="consignee">
          <el-input v-model="temp.consignee" />
        </el-form-item>
        <el-form-item label="收货电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="地区" prop="region">
          <el-cascader
            v-model="temp.region"
            size="large"
            :options="regionOptions"
            style="width: 300px"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="dialogShipmentFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="物流公司" prop="consignee">
          <el-select v-model="temp.logistics_company_id" placeholder="请选择">
            <el-option v-for="(item, index) in logistics_companies" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="phone">
          <el-input v-model="temp.tracking_number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShipmentFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmShipment(temp)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateOrder, orderShipment, fetchLogisticsCompanies } from '@/api/order'
import { fetchList as productList } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  name: 'Coupon',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未发货',
        1: '已发货'
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
        title: undefined,
        status: undefined
      },
      statusOptions: ['未发货', '已发货'],
      dialogFormVisible: false,
      dialogShipmentFormVisible: false,
      dialogTitle: '编辑发货信息',
      temp: {
        id: undefined,
        tracking_number: null,
        logistics_company_id: null,
        consignee: null,
        phone: null,
        region: [],
        address: null,
        status: null
      },
      rules: {
        consignee: [{ required: true, message: '收货人不可为空!', trigger: 'blur' }],
        phone: [{ required: true, message: '收货电话不可为空!', trigger: 'blur' }],
        region: [{ required: true, message: '活动日期不可为空!', trigger: 'change' }],
        address: [{ required: true, message: '地址不可为空!', trigger: 'blur' }],
        status: [{ required: true, message: '状态不可为空!', trigger: 'blur' }]
      },
      downloadLoading: false,
      regionOptions: regionData,
      multipleSelection: []
    }
  },
  created() {
    console.log(this.type)
    switch (this.type) {
      case 'shipped':
        this.listQuery.status = 1
        break
      case 'not-shipped':
        this.listQuery.status = 0
        break
    }
    this.getList()
    this.getProductList()
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.meta.total
      })
    },
    getLogisticsCompanies() {
      fetchLogisticsCompanies().then(response => {
        this.logistics_companies = response.data
      })
    },
    getProductList() {
      productList().then(response => {
        this.product_list = response.data.data
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
    handleShipment(row) {
      this.getLogisticsCompanies()
      this.temp = Object.assign({}, row) // copy obj
      this.dialogShipmentFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateOrder(tempData.id, tempData).then(response => {
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
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['活动名称', '物流公司', '单号', '商品信息', '收货人', '收货电话', '收货地址']
        const filterVal = ['title', 'logistics_company', 'tracking_number', 'product', 'consignee', 'phone', 'address']
        const data = this.formatItem(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$route.meta.title
        })
        this.downloadLoading = false
      })
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
    confirmShipment(temp) {
      temp.status = 1
      orderShipment(temp.id, temp).then(response => {
        this.dialogShipmentFormVisible = false
        this.$notify({
          title: 'Success',
          message: response.message,
          type: 'success',
          duration: 2000
        })
      })
    },
    formatRegion(region) {
      const item = region.map((item) => {
        return CodeToText[item]
      })
      return item.join('')
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

