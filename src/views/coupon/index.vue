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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="活动名称" align="center">
        <template slot-scope="{row}">
          <span :title="row.title">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动日期" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_time }} - {{ row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换商品" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="(product, index) in row.products" :key="index">{{ productText(product) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编码前缀" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.prefix }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起始编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提货卡总量" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已兑换数量" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.usage_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusType">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" @click="redirectToCouponItem(row.id)">
            查看兑换码
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDestroy(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="活动日期" prop="start_time" required>
          <el-col :span="11">
            <el-date-picker v-model="temp.start_time" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker v-model="temp.end_time" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="选择商品" prop="products">
          <el-select v-model="temp.products" multiple class="filter-item">
            <el-option v-for="(item, index) in product_list" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡券前缀" prop="prefix">
          <el-input v-model="temp.prefix" />
        </el-form-item>
        <el-form-item label="起始编号" prop="start_number">
          <el-input-number v-model="temp.start_number" width="300px" :min="1" :max="10000000000000000" />
        </el-form-item>
        <el-form-item label="卡券数量" prop="quantity">
          <el-input-number v-model="temp.quantity" :min="1" :max="100000" />
        </el-form-item>
        <el-form-item label="卡券长度" prop="length">
          <el-input-number v-model="temp.length" :min="1" :max="20" />
        </el-form-item>
        <el-form-item label="卡券默认状态">
          <el-radio-group v-model="temp.status" class="filter-item">
            <el-radio v-for="(item, index) in statusOptions" :key="index" :label="index"> {{ item }} </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateCoupon, createCoupon, destroyCoupon } from '@/api/coupon'
import { fetchList as productList } from '@/api/product'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Coupon',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未开始',
        1: '进行中',
        2: '已结束'
      }
      return statusMap[status]
    },
    statusType(status) {
      const statusMap = {
        0: 'primary',
        1: 'success',
        2: 'info'
      }
      return statusMap[status]
    },
    statusText(status) {
      const statusMap = {
        0: '未启用',
        1: '启用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      product_list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        status: undefined
      },
      statusOptions: ['未启用', '启用'],
      temp: {
        id: undefined,
        title: null,
        products: null,
        start_time: null,
        end_time: null,
        prefix: null,
        start_number: null,
        quantity: null,
        length: null,
        status: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑卡券',
        create: '新建卡券'
      },
      rules: {
        title: [{ required: true, message: '标题不可为空!', trigger: 'blur' }],
        products: [{ required: true, message: '商品不可为空!', trigger: 'blur' }],
        start_time: [{ required: true, message: '活动日期不可为空!', trigger: 'change' }],
        end_time: [{ required: true, message: '活动日期不可为空!', trigger: 'change' }],
        prefix: [{ required: true, message: '卡券前缀不可为空!', trigger: 'blur' }],
        start_number: [{ required: true, message: '起始编号不可为空!', trigger: 'blur' }],
        quantity: [{ required: true, message: '卡券数量不可为空!', trigger: 'blur' }],
        length: [{ required: true, message: '卡券长度不可为空!', trigger: 'blur' }],
        status: [{ required: true, message: '状态不可为空!', trigger: 'blur' }]
      },
      downloadLoading: false,
      domain: process.env.VUE_APP_DOMAIN + 'storage/'
    }
  },
  created() {
    this.getList()
    this.getProductList()
  },
  methods: {
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.meta.total
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
    resetTemp() {
      this.temp = {
        id: undefined,
        title: null,
        products: [],
        start_time: null,
        end_time: null,
        prefix: null,
        start_number: null,
        quantity: null,
        length: null,
        status: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createCoupon(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateCoupon(tempData.id, tempData).then(response => {
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
    handleDestroy(row, index) {
      destroyCoupon(row.id).then(response => {
        this.$notify({
          title: 'Success',
          message: '删除成功!',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    redirectToCouponItem(id) {
      this.$router.push('/coupon/item/' + id)
    },
    productText(product) {
      const item = this.product_list.find((item) => {
        return item.id === product
      })
      return item.name
    }
  }
}
</script>
<style scoped>
  .line {
    text-align: center;
  }
</style>

