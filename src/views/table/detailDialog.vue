<template>
  <div class="">
    <el-dialog title="任务详情" :visible.sync="outerVisible">
      <el-dialog
        width="30%"
        title="输入详情"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form ref="form" label-width="120px">
          <el-form-item label="输入提供方：">
            <div>{{ func.who[inputIndex] }}</div>
          </el-form-item>
          <el-form-item label="输入值（密文）:">
            <div>{{ ciphertext[inputIndex + 1] }}</div>
          </el-form-item>
          <el-form-item label="重加密值:" v-if="name == 'CSP'">
            <div>{{ cspciphertext[inputIndex + 1] }}</div>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        width="30%"
        title="提供输入"
        :visible.sync="inputVisible"
        append-to-body
      >
        <el-form ref="form" label-width="120px">
          <el-form-item label="提交输入：">
            <el-input
              v-model="inputvalue"
              autocomplete="off"
              placeholder="number"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="inputVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitInput" :loading="loading"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <div>
        <el-form ref="func" :model="func" label-width="120px">
          <el-form-item label="创建者：">
            <div>{{ func.recUsername }}</div>
          </el-form-item>
          <el-form-item label="描述">
            <div>{{ func.des }}</div>
          </el-form-item>
          <el-form-item label="函数主体：">
            <div>{{ func.body }}</div>
          </el-form-item>
          <el-form-item
            label="输入提供方："
            v-for="(m, index) in func.state"
            :key="index + 'b'"
          >
            <el-button
              :loading="loading"
              :type="m | buttonFilter"
              :disabled="isDisable(index)"
              @click="showinput(index)"
              >{{ func.who[index] + " : x" + (index + 1) }}</el-button
            >
          </el-form-item>
          <el-form-item label="计算结果(密文)：">
            <div>{{ encResult | resultFilter }}</div>
            <el-button
              type="primary"
              @click="decryption(functionId)"
              v-if="stateAllSatisfied()"
              >解密
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { showError, showSuccess } from "@/utils/message";
import Cookies from "js-cookie";
import { Base64 } from "js-base64";

export default {
  name: "",
  filters: {
    buttonFilter(s) {
      if (s == 1) return "primary";
      return "";
    },
    resultFilter(result) {
      if (result == "" || result == null) return "尚无结果";
      else return result;
    },
  },
  data() {
    return {
      outerVisible: false,
      innerVisible: false,
      inputVisible: false,
      func: {
        body: "3x^2",
        c: "[3]",
        delete: false,
        des: "向量内积运算",
        divisor: "1",
        e: "[[2]]",
        functionId: 1,
        gmtCreate: 1601707620000,
        gmtModified: 1602078660000,
        isDelete: false,
        n: 1,
        n_a: 1,
        params: "params/cfcd208495d565ef66e7dff9f98764da",
        recUsername: "123",
        result: 27,
        state: [0],
        who: ["Bob"],
      },
      encResult: null,
      functionId: null,
      inputvalue: "",
      inputIndex: 0,
      loading: false,
      ciphertext: "111",
      cspciphertext: "11",
      username: Cookies.get("username"),
    };
  },
  computed: {
    name() {
      return Cookies.get("username");
    },
  },
  mounted() {},
  methods: {
    decryption(functionId) {
      let data = {
        functionid: functionId,
        username: this.username,
      };
      this.$store
        .dispatch("user/getresult", data)
        .then((res) => {
          showSuccess("解密结果:" + res.data / this.func.divisor);
        })
        .catch(() => {});
    },
    loadFunction(functionId) {
      this.functionId = functionId;
      this.$store
        .dispatch("user/loadfunctiondetail", functionId)
        .then((res) => {
          let data = JSON.parse(res.data);
          data.who = JSON.parse(data.who);
          console.log(data);
          data.state = JSON.parse(data.state);
          this.func = data;
          if (this.stateAllSatisfied()) {
            let data = {
              functionid: functionId,
            };
            this.$store
              .dispatch("user/getciphertext", data)
              .then((res) => {
                let data = JSON.parse(res.data);
                this.encResult = data.ccsp2;
              })
              .catch(() => {});
          } else {
            this.encResult = "";
          }
          showSuccess("获取成功");
        })
        .catch(() => {});
    },
    stateAllSatisfied() {
      for (let index = 0; index < this.func.state.length; index++) {
        let element = this.func.state[index];
        if (element == 0) return false;
      }
      return true;
    },
    showinput(index) {
      this.inputIndex = index;
      if (this.func.state[index] == 0) {
        this.inputVisible = true;
      } else {
        this.loading = true;
        let data = {
          functionid: this.functionId,
        };
        this.$store
          .dispatch("user/getuserciphertext", data)
          .then((res) => {
            let data = JSON.parse(res.data);
            this.ciphertext = data;
            this.loading = false;
            this.innerVisible = true;
          })
          .catch(() => {
            this.loading = false;
          });
        if (Cookies.get("username") == "CSP") {
          let data = {
            functionid: this.functionId,
          };
          this.$store
            .dispatch("user/getcspciphertext", data)
            .then((res) => {
              let data = JSON.parse(res.data);
              this.cspciphertext = data;
              this.loading = false;
              this.innerVisible = true;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      }
    },
    isDisable(index) {
      if (
        this.func.state[index] == 0 &&
        this.func.who[index] != Cookies.get("username")
      ) {
        return true;
      }
      return false;
    },
    submitInput() {
      const Base64 = require("js-base64").Base64;
      let input = {};
      input[this.inputIndex + 1] = this.inputvalue;
      input = JSON.stringify(input);
      input = Base64.encode(input.toString());
      //TODO:发送输入
      let data = {
        id: this.functionId,
        params: input,
        username: Cookies.get("username"),
      };
      this.loading = true;
      this.$store
        .dispatch("user/updatefunctionparams", data)
        .then((res) => {
          showSuccess("提交成功");
          this.inputIndex = null;
          this.inputvalue = null;
          this.inputVisible = false;
          this.loading = false;
          this.loadFunction(this.functionId);
          this.$parent.getAllFunctions(100, 0);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="" scoped>
</style>
