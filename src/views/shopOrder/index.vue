<template>
  <div class="app-container mr-1">
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="订单号" align="center">
        <template slot-scope="{row}">
          <span :title="row.order_no">{{ row.order_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡券" align="center" width="110px">
        <template slot-scope="{row}">
          <span>{{ row.coupon.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="110px">
        <template slot-scope="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.total_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>ç
      <el-table-column label="电话" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.payment_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchShopOrderList, updateOrder, orderShipment, fetchLogisticsCompanies } from '@/api/order'
import { fetchList as productList } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  name: 'ShopOrder',
  components: { Pagination },
  directives: { waves },
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
      downloadLoading: false,
      regionOptions: regionData,
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    this.getProductList()
  },
  methods: {
    getList() {
      fetchShopOrderList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
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

