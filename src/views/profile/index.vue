<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="8" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本信息" name="account">
                <information />
              </el-tab-pane>

              <el-tab-pane label="修改密码" name="password">
                <password />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import Information from './components/Information'
import Password from './components/Password'
export default {
  name: 'Profile',
  components: { Information, Password },
  data() {
    return {
      activeTab: 'account'
    }
  }
}
</script>
