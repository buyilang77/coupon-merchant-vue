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
      <el-button v-waves class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="活动名称" align="center">
        <template slot-scope="{row}">
          <span :title="row.title">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡券售价" align="center">
        <template slot-scope="{row}">
          <span :title="row.price">{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡券面值" align="center">
        <template slot-scope="{row}">
          <span :title="row.original_price">{{ row.original_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换商品" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="(product, index) in row.products" :key="index">{{ productText(product) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="预览地址" align="center">
        <template slot-scope="{row}">
          <el-link type="info" :href="row.qr_code_link" target="_blank">{{ row.qr_code_link }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center" width="95">
        <template slot-scope="{row}">
          <img :src="row.qr_code_preview" alt="" style="width: 60px">
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
        <template slot-scope="{row, index}">
          <el-button type="success" size="mini" @click="redirectToCouponItem(row.id)">
            卡密管理
          </el-button>
          <el-button type="primary" size="mini" @click="redirectToEdit(row.id)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDestroy(row.id, index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, updateActivity, destroyActivity } from '@/api/activity'
import { fetchList as productList } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Activity',
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
      statusOptions: ['未开始', '进行中', '已结束'],
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
      downloadLoading: false
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
    handleCreate() {
      this.$router.push({ name: 'ActivityCreate' })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateActivity(tempData.id, tempData).then(response => {
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
    handleDestroy(id, index) {
      destroyActivity(id).then(response => {
        this.$notify({
          title: 'Success',
          message: '删除成功!',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    redirectToEdit(id) {
      this.$router.push({ name: 'CouponEdit', params: { id: id }})
    },
    redirectToCouponItem(id) {
      this.$router.push({ name: 'CouponItems', params: { id: id }})
    },
    productText(product) {
      const item = this.product_list.find((item) => {
        return item.id === product
      })
      return item && item.name
    }
  }
}
</script>
