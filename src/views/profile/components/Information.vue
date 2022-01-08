<template>
  <el-form>
    <el-form-item label="用户名">
      <el-input v-model.trim="postForm.username" :disabled="true" />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model.trim="postForm.phone" :disabled="true" />
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model.trim="postForm.surname" />
    </el-form-item>
    <el-form-item label="商户名">
      <el-input v-model.trim="postForm.merchant_name" />
    </el-form-item>
    <el-form-item label="上传Logo">
      <el-upload
        class="avatar-uploader"
        action=""
        :http-request="handleFile"
        :show-file-list="false"
        accept=".jpg, .jpeg, .png"
      >
        <img v-if="postForm.avatar" :src="postForm.avatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
    </el-form-item>
    <el-form-item label="地区" prop="region">
      <el-cascader v-model="postForm.region" class="width-100" size="large" :options="regionOptions" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { update } from '@/api/user'
import { regionData } from 'element-china-area-data'
import { image } from '@/api/upload'
const defaultForm = {
  username: '',
  surname: '',
  merchant_name: '',
  phone: '',
  avatar: '',
  region: []
}
export default {
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      regionOptions: regionData
    }
  },
  created() {
    this.postForm = this.$store.state.user
  },
  methods: {
    submit() {
      update(this.postForm).then(response => {
        this.$message({
          message: response.message,
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    handleFile(file) {
      const formData = new FormData()
      formData.set('file', file.file)
      image(formData).then(response => {
        this.postForm.avatar = response.data.path
      })
    },
    handleAvatarSuccess(res, file) {
      this.postForm.avatar = URL.createObjectURL(file.raw)
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
