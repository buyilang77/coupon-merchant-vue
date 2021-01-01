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
const defaultForm = {
  username: '',
  surname: '',
  merchant_name: '',
  phone: '',
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
    }
  }
}
</script>
