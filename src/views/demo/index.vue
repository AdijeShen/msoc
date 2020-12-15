<template>
<div class="dashboard-container">


  <el-row>
    <el-col :span="7" style="margin: 20px">
      <el-card :body-style="{ padding: '60px' }">
        <el-image style="width: 250px; height: 200px" :src="communityUrl" fit="fill"></el-image>
        <div style="padding: 14px">
          <span>xxx食堂</span>
          <br/><br/>
          <span>用电量为 ******度</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button" @click="submitUsage(0)">提交加密用电量</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="7" style="margin: 20px">
      <el-card :body-style="{ padding: '60px' }">
        <el-image style="width: 250px; height: 200px" :src="commercialUrl" fit="fill"></el-image>
        <div style="padding: 14px">
          <span>xxx办公楼</span>
          <br/><br/>
          <span>用电量为 ******度</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button" @click="submitUsage(1)">提交加密用电量</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="7" style="margin: 20px">
      <el-card :body-style="{ padding: '60px' }">
        <el-image style="width: 250px; height: 200px" :src="industrialUrl" fit="fill"></el-image>
        <div style="padding: 14px">
          <span>xxx制造厂</span>
          <br/><br/>
          <span>用电量为 ******度</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button" @click="submitUsage(2)">提交加密用电量</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="margin:20px">
    <div class="alert alert-success" role="alert" style="word-wrap: break-word; text-align:center" width="20px">
      总价格：{{totalUsage }} 元
    </div>
  </el-row>
</div>
</template>

<script>
import {
  mapGetters
} from "vuex";

import Cookies from "js-cookie";
export default {
  name: "Dashboard",
  mounted() {
    this.loadData();
  },
  computed: {
    ...mapGetters(["name"]),
    isUser() {
      return (
        Cookies.get("username") != "CSP" &&
        this.$store.state.user.username != "SER"
      );
    },
    isCsp() {
      return this.$store.state.user.username == "CSP";
    },
    isSer() {
      return this.$store.state.user.username == "SER";
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      pk: "",
      sk: "",
      currentDate: new Date(),
      commercialUrl: require("./img/commercial.png"),
      communityUrl: require("./img/community.jpg"),
      industrialUrl: require("./img/industrial.jpg"),
      totalUsage: 0
    };
  },
  methods: {
    loadData() {
      this.$store.dispatch('user/getsimpleresult', null).then((res) => {
        let data = JSON.parse(res.data)
        this.totalUsage = data
      }).catch(() => {})
    },
    showcreatingDialog() {
      this.$refs.creating_dialog.dialogFormVisible = true;
    },
    submitUsage(val) {
      let type = "";
      if (val == 0)
        type = "xxx食堂";
      else if (val == 1)
        type = "xxx办公楼";
      else
        type = "xxx制造厂";
      this.$prompt('请输入用电量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\b\d{1,10}\b/,
        inputErrorMessage: '请输入1e10以下的数字'
      }).then(({
        value
      }) => {
        let form = {
          location: val,
          param: value
        }
        console.log(111)
        this.$store.dispatch('user/submitusage', form).then((res) => {
          this.loadData();
          this.$message({
            type: 'success',
            message: type + '用电量为: ' + value
          });
        }).catch(() => {})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.el-button {
  word-break: break-all;
}

.alert {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-success hr {
  border-top-color: #b1dfbb;
}

.alert-success .alert-link {
  color: #0b2e13;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-danger hr {
  border-top-color: #f1b0b7;
}

.alert-danger .alert-link {
  color: #491217;
}
</style>
