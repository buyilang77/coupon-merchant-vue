<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="left" label-width="110px" style="width: 500px; margin-left:50px;">
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
          <el-input-number v-model="postForm.length" :min="4" :max="12" />
          <div>
            <small class="length-hint">编码长度必须介于 4 - 12 之间</small>
          </div>
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

const defaultForm = {
  id: undefined,
  services_phone: null,
  activity_description: null,
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
      activity_list: [],
      statusOptions: ['未启用', '启用'],
      rules: {
        start_time: [{ required: true, message: '活动日期不可为空!', trigger: 'change' }],
        end_time: [{ required: true, message: '活动日期不可为空!', trigger: 'change' }],
        start_number: [{ required: true, message: '起始编号不可为空!', trigger: 'blur' }],
        quantity: [{ required: true, message: '卡券数量不可为空!', trigger: 'blur' }],
        length: [{ required: true, message: '卡券长度不可为空!', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.getCoupon(id)
    }
  },
  methods: {
    getCoupon(id) {
      fetchCoupon(id).then(response => {
        this.postForm = response.data
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
  .length-hint {
    color: #9E9E9E;
  }
</style>
