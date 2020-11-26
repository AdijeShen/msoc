<template>
<div class="dashboard-container">
  <el-row :gutter="20">
    <el-col :span="2">
      <div class="dashboard-text"> {{ $store.state.user.username }}</div>
    </el-col>
    <el-col :span="8">
      <el-button type="primary" @click="showcreatingDialog" v-if="isUser">创建计算任务</el-button>
    </el-col>
  </el-row>
  <br>
  <el-row :gutter="20">
    <div class="alert alert-success" role="alert" style="word-wrap:break-word">
      公钥：<br>{{ $store.state.user.Pk_f }}
    </div>
  </el-row>
  <el-row :gutter="20">
    <div class="alert alert-danger" role="alert" style="word-wrap:break-word">
      私钥：<br>{{ $store.state.user.Sk_f }}
    </div>
  </el-row>
  <creating-dialog ref="creating_dialog" />
  <cspstatic v-if="isCsp"/>
  <serstatic v-if="isSer"/>

</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import creatingDialog from "./creatingDialog"
import cspstatic from './cspstatic'
import serstatic from './serstatic'

export default {
  name: 'Dashboard',
  mounted() {
    if (this.$store.state.user.username == "") {
      this.$router.replace({
        path: '/login?redirect=%2Fdashboard'
      })
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    isUser() {
      return this.$store.state.user.username != "CSP" && this.$store.state.user.username != "SER"
    },
    isCsp() {
      return this.$store.state.user.username == 'CSP'
    },
    isSer() {
      return this.$store.state.user.username == 'SER'
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      pk: "",
      sk: ""
    }
  },
  methods: {
    showcreatingDialog() {
      this.$refs.creating_dialog.dialogFormVisible = true
    }
  },
  components: {
    creatingDialog,
    cspstatic,
    serstatic
  }
}
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
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: .25rem
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb
}

.alert-success hr {
  border-top-color: #b1dfbb
}

.alert-success .alert-link {
  color: #0b2e13
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb
}

.alert-danger hr {
  border-top-color: #f1b0b7
}

.alert-danger .alert-link {
  color: #491217
}
</style>
