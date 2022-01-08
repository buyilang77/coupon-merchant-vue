<template>
  <div class="app">
    <div class="container">
      <h4>用户提货统一登录入口</h4>
      <el-divider />
      <div class="container-box">
        <div class="container-box-left">
          <qrcode-vue :value="pick_up_link" class="ddd" size="120" level="H" />
        </div>
        <div class="container-box-right">
          <div class="info-box">
            <div class="info-box-item">
              <div class="info-box-item-title">网址:</div>
              <div class="info-box-item-content"><el-link :href="pick_up_link" type="info" target="_blank">{{ pick_up_link }}</el-link></div>
            </div>
            <div class="info-box-item">
              <div class="info-box-item-title">使用方法:</div>
              <div class="info-box-item-content">公众号绑定提货网址的步骤:<br>
                第一步: 登录公众号，进入左侧内容与互动》自定义菜单<br>
                第二步: 添加菜单:在线提货复制此网址添加到跳转网页>页面地址<br>
                第三步: 点击保存并发布按钮即可。</div>
            </div>
            <div class="info-box-item">
              <div class="info-box-item-title">说明:</div>
              <div class="info-box-item-content red">手机可直接扫上方二维码登录使用;<br>每种提货卡的独立网址仍然可以正常使用;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <h4>储值卡商品兑换商城</h4>
      <el-divider />
      <div class="container-box">
        <div class="container-box-left">
          <qrcode-vue :value="link" class="ddd" size="120" level="H" />
        </div>
        <div class="container-box-right">
          <div class="info-box">
            <div class="info-box-item">
              <div class="info-box-item-title">网址:</div>
              <div class="info-box-item-content"><el-link :href="link" type="info" target="_blank">{{ link }}</el-link></div>
            </div>
            <div class="info-box-item">
              <div class="info-box-item-title">说明:</div>
              <div class="info-box-item-content">本商城当前仅用于储值卡兑换商品时使用。暂不支持游客在线购买。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
export default {
  name: 'Dashboard',
  components: { QrcodeVue },
  data() {
    return {
      link: '',
      pick_up_link: ''
    }
  },
  created() {
    this.link = `http://recharge-card.hipi5.com/${this.$store.state.user.username}`
    this.pick_up_link = `http://h5.hipi5.com/#/${this.$store.state.user.username}`
  }
}
</script>
<style lang="scss" scoped>
.app {
  display: flex;
}
.container {
  width: 800px;
  margin: 2rem 1rem;
  padding: 0 1rem;
  border: 1px solid #DCDFE6;
  font-size: 14px;
  &-box {
    display: flex;
    &-left {
      margin-right: 40px;
    }
    .info-box-item {
      display: flex;
      margin-bottom: 1rem;
      &-title {
        width: 100px;
      }
      &-content {
        width: 100%;
      }
    }
  }
}
.red {
  color: #f56c6c;
}
</style>
