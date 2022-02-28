<template>
  <div class="app-container mr-1">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="请输入关键字" style="width: 200px;" class="filter-item mr-1" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="商品ID" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="{row}">
          <span :title="row.name">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" align="center" width="100">
        <template slot-scope="{row}">
          <span :title="row.price">{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" align="center" width="95">
        <template slot-scope="{row}">
          <img :src="row.carousel[0] && row.carousel[0].url" alt="" style="width: 60px">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="redirectToProductEdit(row.id)">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item label="商品名称" prop="name" required>
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description" required>
          <div>
            <tinymce v-model="temp.description" :height="300" />
          </div>
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
import { fetchList, destroy } from '@/api/product'
import Tinymce from '@/components/Tinymce'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ProductIndex',
  components: { Pagination, Tinymce },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      temp: {
        id: undefined,
        name: null,
        description: `<h1 style="text-align: center;">Welcome to the TinyMCE demo!</h1>`
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商品',
        create: '新建商品'
      },
      rules: {
        name: [{ required: true, message: '名称不可为空!', trigger: 'blur' }],
        description: [{ required: true, message: '内容不可为空!', trigger: 'blur' }]
      }
    }
  },
  activated() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
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
        product_id: null,
        start_time: null,
        end_time: null,
        prefix: null,
        start_number: null,
        quantity: null,
        length: null,
        status: 0,
        image: null,
        full_image: null,
        tips: null
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
    handleDestroy(row, index) {
      destroy(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功!',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    redirectToProductEdit(id) {
      this.$router.push('/product/edit/' + id)
    }
  }
}
</script>
<style scoped>
  .line {
    text-align: center;
  }
</style>

