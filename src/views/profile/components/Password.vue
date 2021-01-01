<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <el-form-item label="密码" prop="password">
      <el-input v-model.trim="postForm.password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { update } from '@/api/user'
export default {
  data() {
    return {
      postForm: { password: null },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          update(this.postForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success',
              duration: 5 * 1000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
