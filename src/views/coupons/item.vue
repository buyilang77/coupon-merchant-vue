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
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-circle-check" @click="bulkUpdateStatus(1)">
        开启
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-circle-close" @click="bulkUpdateStatus(0)">
        关闭
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="兑换码">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="密码">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="开启状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.open_status | openStatusType">
            {{ row.open_status | openStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="兑换状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.redemption_status | redemptionStatusType">
            {{ row.redemption_status | redemptionStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{row}">
          <el-button v-if="row.open_status === 0" type="primary" size="mini" @click="handleModifyStatus(row, 1)">
            开启
          </el-button>
          <el-button v-if="row.open_status === 1" type="info" size="mini" @click="handleModifyStatus(row, 0)">
            关闭
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, updateItem, bulkUpdateItem } from '@/api/coupon_item'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'CouponItems',
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
      listQuery: {
        page: 1,
        limit: 20,
        code: undefined,
        open_status: undefined,
        redemption_status: undefined
      },
      updateItemParameters: {
        open_status: undefined,
        items: undefined
      },
      statusOptions: {
        0: '未开启',
        1: '已开启'
      },
      downloadLoading: false,
      multipleSelection: []
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getList(this.id)
  },
  methods: {
    getList(id) {
      this.listLoading = true
      fetchList(id, this.listQuery).then(response => {
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
      updateItem(row.id, this.updateItemParameters).then(response => {
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['兑换码', '密码', '领取链接', '开启状态', '兑换状态']
        const filterVal = ['code', 'password', 'qr_code_link', 'open_status_text', 'redemption_status_text']
        const data = this.formatItem(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '兑换码列表'
        })
        this.downloadLoading = false
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
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
