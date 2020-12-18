<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="postForm.title" />
        </el-form-item>
        <el-form-item label="客服电话">
          <el-input v-model="postForm.services_phone" />
        </el-form-item>
        <el-form-item label="活动说明">
          <el-input v-model="postForm.activity_description" type="textarea" />
        </el-form-item>
        <el-form-item label="活动日期" required>
          <el-col :span="11">
            <el-form-item prop="start_time">
              <el-date-picker v-model="postForm.start_time" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="end_time">
              <el-date-picker v-model="postForm.end_time" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="选择商品" prop="products">
          <el-select v-model="postForm.products" multiple class="filter-item">
            <el-option v-for="(item, index) in product_list" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡券前缀">
          <el-input v-model="postForm.prefix" />
        </el-form-item>
        <el-form-item label="起始编号" prop="start_number">
          <el-input-number v-model="postForm.start_number" width="300px" :min="1" :max="10000000000000000" />
        </el-form-item>
        <el-form-item label="卡券数量" prop="quantity">
          <el-input-number v-model="postForm.quantity" :min="1" :max="100000" />
        </el-form-item>
        <el-form-item label="编码长度" prop="length">
          <el-input-number v-model="postForm.length" :min="1" :max="20" />
        </el-form-item>
        <el-form-item label="卡券默认状态">
          <el-radio-group v-model="postForm.status" class="filter-item">
            <el-radio v-for="(item, index) in statusOptions" :key="index" :label="index"> {{ item }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider />
        <div class="text-center">
          <el-button v-loading="loading" style="margin-left: 10px;" @click="submitForm">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchCoupon, updateCoupon, createCoupon } from '@/api/coupon'
import { fetchList as productList } from '@/api/product'

const defaultForm = {
  id: undefined,
  title: null,
  services_phone: null,
  activity_description: null,
  products: [],
  start_time: null,
  end_time: null,
  prefix: null,
  start_number: null,
  quantity: 500,
  length: null,
  status: 0
}

export default {
  name: 'CouponForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      product_list: [],
      statusOptions: ['未启用', '启用'],
      rules: {
        title: [{ required: true, message: '标题不可为空!', trigger: 'blur' }],
        products: [{ required: true, message: '商品不可为空!', trigger: 'blur' }],
        start_time: [{ required: true, message: '活动日期不可为空!', trigger: 'change' }],
        end_time: [{ required: true, message: '活动日期不可为空!', trigger: 'change' }],
        start_number: [{ required: true, message: '起始编号不可为空!', trigger: 'blur' }],
        quantity: [{ required: true, message: '卡券数量不可为空!', trigger: 'blur' }],
        length: [{ required: true, message: '卡券长度不可为空!', trigger: 'blur' }],
        status: [{ required: true, message: '状态不可为空!', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.getCoupon(id)
    }
    this.getProductList()
  },
  methods: {
    getCoupon(id) {
      fetchCoupon(id).then(response => {
        this.postForm = response.data
      })
    },
    getProductList() {
      productList().then(response => {
        this.product_list = response.data.data
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateCoupon(this.postForm.id, this.postForm).then(response => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push('/coupons/index')
            })
          } else {
            createCoupon(this.postForm).then(response => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push('/coupons/index')
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
  .title-label {
    color: #9E9E9E;
    font-size: 18px;
  }
</style>
