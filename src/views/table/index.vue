<template>
<div class="app-container">
  <el-table v-loading="listLoading" :data="functions" element-loading-text="Loading" border fit highlight-current-row>
    <el-table-column align="center" label="编号" width="50">
      <span slot-scope="scope">
          {{ scope.row.functionId }}
      </span>
    </el-table-column>
    <!-- <el-table-column align="center" label="函数ID" width="70">
      <span slot-scope="scope">
          {{ scope.row.functionId }}
      </span>
    </el-table-column> -->
    <el-table-column align="center" label="函数主体" >
      <span slot-scope="scope">
          {{ scope.row.body }}
      </span>
    </el-table-column>
    <el-table-column align="center" label="描述" width="150">
      <span slot-scope="scope">
          {{ scope.row.des }}
      </span>
    </el-table-column>
        <el-table-column align="center" label="创建者" width="150">
      <span slot-scope="scope">
          {{ scope.row.recUsername }}
      </span>
    </el-table-column>
    <el-table-column align="center" class-name="status-col" label="空缺参数" width="120" >
      <span slot-scope="scope">
        <el-tag :type="scope.row.unset | numberFilter" @click="openFunction(scope.row)">
          {{ scope.row.unset }}</el-tag>
      </span>
    </el-table-column>
    <el-table-column align="center" prop="created_at" label="创建时间" width="200">
      <span slot-scope="scope">
        <i class="el-icon-time" />
        <span>{{ dateFormat(new Date(scope.row.gmtCreate)) }}</span>
      </span>
    </el-table-column>
  </el-table>

  <el-dialog title="任务详情" :visible.sync="outerVisible">
    <el-dialog width="30%" title="输入详情" :visible.sync="innerVisible" append-to-body>
      <el-form ref="form" label-width="120px">
        <el-form-item label="输入提供方：">
          <div>User2</div>
        </el-form-item>
        <el-form-item label="输入值（密文）:">
          <div>584662383851741</div>
        </el-form-item>
        <el-form-item label="重加密值:" v-if="name=='CSP'">
          <div>134152524642623</div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog width="30%" title="提供输入" :visible.sync="inputVisible" append-to-body>
      <el-form ref="form" label-width="120px">
        <el-form-item label="提交输入：">
          <el-input v-model="inputvalue" autocomplete="off" placeholder="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="inputVisible = false">取 消</el-button>
          <el-button type="primary" @click="inputVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <div>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="创建者：">
          <div>{{form.creator}}</div>
        </el-form-item>
        <el-form-item label="状态：">
          <div>{{form.status}}</div>
        </el-form-item>
        <el-form-item label="函数主体：">
          <div>{{form.name}}</div>
        </el-form-item>
        <el-form-item label="输入：">
          <el-button type="primary" @click="innerVisible = true">x1</el-button>
          <el-button type="primary" @click="innerVisible = true">x2</el-button>
          <el-button plain @click="inputVisible = true">x3</el-button>
        </el-form-item>
        <el-form-item v-if="name=='SER'" label="计算结果(密文)：">
          <div>42242423232322</div>
        </el-form-item>
      </el-form>

    </div>
  </el-dialog>
  <detaildialog ref="detaildialog"/>
</div>
</template>

<script>

import {showError,showSuccess} from '@/utils/message'
import {
  getList
} from '@/api/table'
import {
  mapGetters
} from 'vuex'
import detaildialog from './detailDialog'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        completed: 'success',
        pending: 'gray',
        invalid: 'danger'
      }
      return statusMap[status]
    },numberFilter(num){
      if(num==0){
        return 'success'
      }else{
        return 'gray'
      }
    }
  },
  components:{
    detaildialog
  },
  data() {
    return {
      list: null,
      listLoading: true,
      outerVisible: false,
      innerVisible: false,
      inputVisible: false,
      form: {
        name: "x1+x2^3-x3",
        creator: "生化",
        status: "pending"
      },
      inputvalue: "",
      functions: null
    }
  },
  created() {
    this.fetchData()
    this.getAllFunctions(100, 0)
  },
  methods: {
    dateFormat(date) {
      let fmt = "YYYY-mm-dd HH:MM:SS"
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
      };
      return fmt;
    },
    getAllFunctions(num, start) {
      let data = {
        num: num,
        start: start
      }
      this.$store.dispatch('user/findallfunctions', data).then((res) => {
        let functions = JSON.parse(res.data)
        this.functions = functions
        console.log(functions)
        let timeStamp = functions[0].gmtCreate
        let date = new Date(timeStamp)
        date = this.dateFormat(date)
        showSuccess("获取函数列表成功")
      }).catch(() => {})
    },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    openFunction(data) {
      let functionId = data.functionId
      this.$refs.detaildialog.loadFunction(functionId)
      this.$refs.detaildialog.outerVisible = true
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>
