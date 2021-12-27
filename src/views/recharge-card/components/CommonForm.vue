<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="left" label-width="110px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本设置" name="first">
            <div class="container">
              <el-form-item label="卡券名称" prop="name">
                <el-input v-model="postForm.name" />
              </el-form-item>
              <el-form-item label="卡券形式" prop="type">
                <el-radio-group v-model="postForm.type" class="filter-item">
                  <el-radio v-for="(item, index) in typeOptions" :key="index" :label="index"> {{ item }} </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="postForm.type === '2'" label="实物卡销售" prop="is_online">
                <el-radio-group v-model="postForm.is_online" class="filter-item">
                  <el-radio v-for="(item, index) in onlineOptions" :key="index" :label="index"> {{ item }} </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="卡券售价" prop="price">
                <el-input v-model="postForm.price" />
              </el-form-item>
              <el-form-item label="卡券面值" prop="denomination">
                <el-input v-model="postForm.denomination" />
              </el-form-item>
              <el-form-item label="配送设置" prop="delivery_type">
                <el-checkbox-group
                  v-model="postForm.delivery_type"
                  :min="1"
                >
                  <el-checkbox v-for="delivery in deliveryTypes" :key="delivery" :label="delivery">{{ delivery | deliveryType }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="卡券介绍" name="second">
            <el-form-item label="活动说明">
              <el-input v-model="postForm.remark" type="textarea" />
            </el-form-item>
            <el-form-item label="轮播图">
              <el-upload
                action=""
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :file-list="postForm.carousel"
                list-type="picture"
                :http-request="handleFile"
                accept=".jpg, .jpeg, .png"
              >
                <el-button size="small" type="primary">点击上传轮播图</el-button>
                <div slot="tip" class="el-upload__tip">只能上传 JPG / PNG 文件!</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="活动介绍" prop="description" style="margin-right: 2px">
              <Tinymce ref="editor" v-model="postForm.activity_description" :height="400" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-divider />
        <div class="text-center">
          <el-button v-loading="loading" style="margin-left: 10px; width: 150px" @click="submitForm">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchData, updateData, createData } from '@/api/recharge-card'
import Tinymce from '@/components/Tinymce'
import { image } from '@/api/upload'

const defaultForm = {
  id: undefined,
  name: null,
  price: '0.00',
  denomination: '0.00',
  type: '2',
  delivery_type: ['delivery'],
  is_online: 0,
  carousel: [],
  remark: null,
  activity_description: null
}

export default {
  name: 'CommonForm',
  components: { Tinymce },
  filters: {
    deliveryType(status) {
      const statusMap = {
        'delivery': '快递发货',
        'pick_up': '门店自提'
      }
      return statusMap[status]
    }
  },
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
      typeOptions: {
        1: '电子卡',
        2: '实物卡'
      },
      deliveryTypes: [
        'delivery',
        'pick_up'
      ],
      onlineOptions: ['线下销售', '在线销售'],
      rules: {
        name: [{ required: true, message: '名称不可为空!', trigger: 'blur' }],
        price: [{ required: true, message: '售价可为空!', trigger: 'blur' }],
        denomination: [{ required: true, message: '面值可为空!', trigger: 'blur' }]
      },
      activeName: 'first'
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.getData(id)
    }
  },
  methods: {
    getData(id) {
      fetchData(id).then(response => {
        this.postForm = response.data
        this.postForm.type = this.postForm.type + ''
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateData(this.postForm.id, this.postForm).then(response => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push({ name: 'RechargeCardIndex' })
            })
          } else {
            createData(this.postForm).then(response => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push({ name: 'RechargeCardIndex' })
            })
          }
        } else {
          // TODO 2556
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    handleFile(file) {
      const formData = new FormData()
      formData.set('file', file.file)
      image(formData).then(response => {
        this.handleSuccess(response, file.file)
      })
    },
    handleSuccess(response, file) {
      this.postForm.carousel.push({ name: file.name, url: response.data.path })
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      this.postForm.carousel = fileList
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
      top: 0;
    }
    .container {
      width: 500px;
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0;
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
