<template>
<div class="">
  <el-dialog title="计算任务" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="示例" :label-width="formLabelWidth">
        <el-button @click="showexample('1')">求平均</el-button>
        <el-button @click="showexample('2')">平方和</el-button>
      </el-form-item>

      <el-form-item label="函数主体" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" placeholder="" disabled></el-input>
      </el-form-item>
      <el-form-item label="函数描述" :label-width="formLabelWidth">
        <el-input v-model="form.desc" autocomplete="off" placeholder="求平均"></el-input>
      </el-form-item>
      <el-form-item label="项数" :label-width="formLabelWidth">
        <el-input v-model="form.a_number" autocomplete="off" placeholder="4" type="number" @change="onanumberchange"></el-input>
      </el-form-item>
      <el-form-item label="x个数" :label-width="formLabelWidth">
        <el-input v-model="form.number" autocomplete="off" placeholder="4" @change="onnumberchange" type="number"></el-input>
      </el-form-item>
      <el-form-item label="每项的系数" :label-width="formLabelWidth">
        <el-input v-model="form.a_str" autocomplete="off" placeholder="[1,1,1,1]" @change="onachange_a"></el-input>
      </el-form-item>
      <el-form-item label="除数" :label-width="formLabelWidth">
        <el-input v-model="form.divisor" autocomplete="off" placeholder="1" type="number" @change="update_poly"></el-input>
      </el-form-item>
      <el-form-item :label="'第'+(index+1)+'项的指数'" v-for="(m,index) in form.e_str" :key="index" :label-width="formLabelWidth">
        <el-input v-model="form.e_str[index]" autocomplete="off" placeholder="[1,0,0,0]" @change="onachange_e(index)"></el-input>
      </el-form-item>
      <el-form-item :label="'X'+(index+1)" v-for="(m,index) in form.inputusers" :key="index+'s'" :label-width="formLabelWidth">
        <el-input v-model="form.inputusers[index]" autocomplete="off" placeholder="指定输入方" @change="validate_user(index)"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit()" :disabled=wrong>确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  MessageBox,
  Message
} from 'element-ui'

import {
  showError,
  showSuccess
} from "@/utils/message"

function isNumber(str) {
  if (str == "" || str == null)
    return false
  for (let index = 0; index < str.length; index++) {
    let element = str.charAt(index);
    if (element >= '0' && element <= '9')
      continue
    else if (element == '[' || element == ']' || element == ',')
      continue
    return false
  }
  return true
}
export default {
  name: 'creatingDialog',
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: '', //函数主体
        desc: '', //函数描述
        number: 0, //输入个数
        inputusers: [], //指定输入用户
        a_number: 0, //项数
        a: [], //每项参数
        a_str: "", //每项参数的字符表示
        e: [
          []
        ], //每项指数
        e_str: [], //每项指数的字符表示
        divisor: 1 //除数
      },
      formLabelWidth: "120px",
      wrong: true,
      wrongs: []
    }
  },
  updated() {},
  methods: {
    async validate_user(index) {
      let user_name = this.form.inputusers[index]
      this.$store.dispatch('user/isValidUser', user_name).then((value) => {
        this.wrongs[index] = false
        for (let index = 0; index < this.wrongs.length; index++) {
          let element = this.wrongs[index];
          if (element == true) {
            this.wrong = true
            return
          }
        }
        this.wrong = false
      }).catch((err) => {
        this.showError(user_name + "不存在")
        this.wrong = true
      })
    },
    showexample(str) {
      if (str == "1") {
        this.form.name = "(x1+x2+x3+x4)/4"
        this.form.desc = "求平均"
        this.form.number = 4
        this.form.a_number = 4
        this.form.inputusers = ["", "", "", ""]
        this.form.a = [1, 1, 1, 1]
        this.form.a_str = "[" + this.form.a.toString() + "]"
        this.form.divisor = 4
        console.log(JSON.stringify(this.form))
        this.form.e = [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ]
        this.form.e_str = []
        for (let index = 0; index < this.form.e.length; index++) {
          const element = this.form.e[index];
          this.form.e_str.push("[" + element.toString() + "]")
        }
        this.wrongs = [true, true, true, true]
      }
      if (str == "2") {
        this.form.name = "x1^2+x2^2"
        this.form.desc = "平方和"
        this.form.number = 2
        this.form.a_number = 2
        this.form.inputusers = ["", ""]
        this.form.divisor = 1
        this.form.a = [1, 1]
        this.form.a_str = "[" + this.form.a.toString() + "]"
        console.log(JSON.stringify(this.form))
        this.form.e = [
          [2, 0],
          [0, 2]
        ]
        this.form.e_str = []
        for (let index = 0; index < this.form.e.length; index++) {
          const element = this.form.e[index];
          this.form.e_str.push("[" + element.toString() + "]")
        }
        this.wrongs = [true, true]
      }
    },
    showError(msg) {
      Message({
        message: msg,
        type: 'error',
        duration: 2 * 1000
      })
    },
    validate_poly() {
      console.log("validating polynomials...");
      if (eval(this.form.divisor) == 0) {
        this.showError("除数不可为0")
        return false
      }
      if (eval(this.form.a_number) == 0) {
        this.showError("项数不可为0")
        return false
      }
      if (eval(this.form.number) == 0) {
        this.showError("输入个数不可为0")
        return false
      }
      let n = this.form.number
      let n_a = this.form.a_number
      let a = this.form.a
      if (a.length != n_a) {
        this.showError("系数个数不一致")
        return false
      }
      let e = this.form.e
      if (e.length != n_a) {
        this.showError("指数的个数不一致")
        return false
      }
      for (let index = 0; index < e.length; index++) {
        const element = e[index];
        if (element.length != n) {
          this.showError("第" + (index + 1) + "项指数的个数不一致")
          return false
        }
      }
      if (isNumber(this.form.a_str) == false) {
        this.showError("系数应该为整数")
        return false
      }
      for (let index = 0; index < this.form.e_str.length; index++) {
        let element = this.form.e_str[index];
        if (isNumber(element) == false) {
          this.showError("第" + (index + 1) + "项指数应为整数")
          return false
        }
      }
      return true
    },
    update_poly() {
      //TODO
      if (this.validate_poly() == false) {
        this.form.name = "函数不合法"
        return
      }
      let body = ""
      let e = this.form.e
      let a = this.form.a
      for (let i = 0; i < this.form.a_number; i++) {
        if (a[i] == 0)
          continue
        else if (a[i] != 1) {
          body += a[i] + "*"
        }
        for (let j = 0; j < this.form.number; j++) {
          if (e[i][j] == 0)
            continue
          body += "x" + (j + 1)
          if (e[i][j] != 1)
            body += "^" + e[i][j]
        }
        if (i != this.form.a_number - 1) {
          body += '+'
        }
      }
      if (this.form.divisor != 1) {
        body = "(" + body + ")/" + this.form.divisor
      }
      this.form.name = body
    },
    async submit() {
      console.log(this.form);
      let flag = this.validate_poly()
      if (flag) {
        this.$store.dispatch('user/addfunction', this.form).then(() => {
          console.log("成功提交函数");
          this.$router.push({
            path: '/table/table'
          })
          showSuccess("提交成功")
        }).catch(() => {})
      }
      // this.dialogFormVisible = false
      // this.$router.push({
      //   path: '/table/table'
      // })
    },
    onnumberchange(event) {
      if (event <= 0) {
        showError("x个数需大于0")
        return
      }
      while (this.form.inputusers.length != event) {
        if (this.form.inputusers.length < event) {
          this.form.inputusers.push("")
        } else {
          this.form.inputusers.pop()
        }
      }

      while (this.wrongs.length != event) {
        if (this.wrongs.length < event) {
          this.wrongs.push(true)
        } else {
          this.wrongs.pop()
        }
      }

      for (let index = 0; index < this.form.e.length; index++) {
        while (this.form.e[index].length != event) {
          if (this.form.e[index].length < event) {
            this.form.e[index].push(1)
          } else {
            this.form.e[index].pop()
          }
        }
        this.form.e_str[index] = "[" + this.form.e[index] + "]"
      }
      this.update_poly()
    },
    onanumberchange(event) {
      if (event <= 0) {
        showError("项数需大于0")
        return
      }
      while (this.form.a.length != event) {
        if (this.form.a.length < event) {
          this.form.a.push(1)
        } else {
          this.form.a.pop()
        }
      }
      this.form.a_str = "[" + this.form.a.toString() + "]"
      while (this.form.e_str.length != event) {
        if (this.form.e_str.length < event) {
          this.form.e_str.push("")
        } else {
          this.form.e_str.pop()
        }
      }
      while (this.form.e.length != event) {
        if (this.form.e.length < event) {
          this.form.e.push([1])
        } else {
          this.form.e.pop()
        }
      }
      this.update_poly()
    },
    onachange_a(event) {
      console.log(event)
      let nums = eval(event)
      this.form.a = nums
      console.log(nums)
      this.update_poly()
    },
    onachange_e(index) {
      let nums = eval(this.form.e_str[index])
      this.form.e[index] = nums
      console.log(this.form.e)
      this.update_poly()
    }
  }
}
</script>

<style lang="" scoped>

</style>
