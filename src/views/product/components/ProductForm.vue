<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" class-name="sub-navbar draft">
        <el-button style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="postForm.name" name="name" />
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="postForm.price" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-divider />
            <el-form-item>
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
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件!</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 30px;" prop="description">
          <div class="title-label">商品描述</div>
          <Tinymce ref="editor" v-model="postForm.description" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import { fetchProduct, updateProduct, createProduct } from '@/api/product'
import { image } from '@/api/upload'

const defaultForm = {
  id: undefined,
  name: null, // 商品名称
  price: null, // 商品价格
  carousel: [], // 轮播图
  description: null // 商品描述
}

export default {
  name: 'ProductForm',
  components: { Tinymce, Sticky },
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
      rules: {
        name: [{ required: true, message: '商品名称不可为空!', trigger: 'blur' }],
        price: [{ required: true, message: '商品价格不可为空!', trigger: 'blur' }],
        description: [{ required: true, message: '商品描述不可为空!', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      fetchProduct(id).then(response => {
        this.postForm = response.data
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (this.postForm.description === null) {
          this.$message({
            message: '商品描述不可为空!',
            type: 'warning'
          })
        }
        if (valid) {
          if (this.isEdit) {
            updateProduct(this.postForm.id, this.postForm).then(response => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push('/product/index')
            })
          } else {
            createProduct(this.postForm).then(response => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push('/product/index')
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
      div:first-child {
        width: 500px
      }
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
