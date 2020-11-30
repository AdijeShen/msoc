import { login, logout, getInfo, newLogin, register, isValidUser } from '@/api/user'
import { addfunction, findAllFunctions, loadfunctiondetail, updatefunctionparams, getresult, getUserCipherText, getCResult, gettime, getcspciphertext, getfhetime, getsimpleresult, submitusage } from "@/api/functions"
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    Pk_f: "",
    Sk_f: "",
    id: "",
    username: ""
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PK: (state, pk) => {
    state.Pk_f = pk
    Cookies.set("Pk_f", pk)
  },
  SET_SK: (state, sk) => {
    state.Sk_f = sk
    Cookies.set("Sk_f", sk)
  },
  SET_USERNAME: (state, username) => {
    state.username = username
    Cookies.set("username", username)
  },
  SET_ID: (state, id) => {
    state.id = id
    Cookies.set("id", id)
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      newLogin({ username: username.trim(), password: password }).then(response => {
        let data = JSON.parse((response.data))
        commit('SET_TOKEN', 'user-token')
        commit('SET_PK', data.Pk_f)
        commit('SET_SK', data.Sk_f)
        commit('SET_USERNAME', data.username)
        setToken('user-token')
        resolve(data)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  findallfunctions({ commit }, data) {
    console.log(data);
    return new Promise((resolve, reject) => {
      findAllFunctions(data).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  loadfunctiondetail({ commit }, functionId) {
    let data = { id: functionId }
    return new Promise((resolve, reject) => {
      loadfunctiondetail(data).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  updatefunctionparams({ commit }, data) {
    return new Promise((resolve, reject) => {
      updatefunctionparams(data).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getresult({ commit }, data) {
    return new Promise((resolve, reject) => {
      getresult(data).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getciphertext({ commit }, data) {
    return new Promise((resolve, reject) => {
      getCResult(data).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getuserciphertext({ commit }, data) {
    return new Promise((resolve, reject) => {
      getUserCipherText(data).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getcspciphertext({ commit }, data) {
    return new Promise((resolve, reject) => {
      getcspciphertext(data).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getsimpleresult({ commit }, data) {
    return new Promise((resolve, reject) => {
      getsimpleresult(data).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  submitusage({ commit }, data) {
    return new Promise((resolve, reject) => {
      submitusage(data).then(response => {
        console.log(data)
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getfhetime({ commit }) {
    return new Promise((resolve, reject) => {
      getfhetime().then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  gettime({ commit }) {
    return new Promise((resolve, reject) => {
      gettime().then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  addfunction({ commit }, functionInfo) {
    const Base64 = require('js-base64').Base64
    let body = functionInfo.name
    let c = functionInfo.a
    c = "[" + c.toString() + "]";
    c = Base64.encode(c)
    let divisor = functionInfo.divisor
    divisor = divisor.toString()
    let e = functionInfo.e_str;
    e = "[" + e.toString() + "]";
    e = Base64.encode(e)
    let n = functionInfo.number
    n = n.toString()
    let n_a = functionInfo.a_number
    let recUsername = Cookies.get("username")
    let who = functionInfo.inputusers
    for (let index = 0; index < who.length; index++) {
      who[index] = "\"" + who[index].toString() + "\""
    }
    who = "[" + who.toString() + "]"
    console.log(who);
    who = Base64.encode(who)
    let des = functionInfo.desc
    let data = { body: body, c: c, divisor: divisor, e: e, n: n, n_a: n_a, recUsername: recUsername, who: who, des: des }
    console.log(data);
    return new Promise((resolve, reject) => {
      addfunction({ body: body, des: des, n: n, divisor: divisor, e: e, n_a: n_a, c: c, recUsername: recUsername, who: who }).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  register({ commit }, userInfo) {
    console.log("注册action！");
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      register({ username: username.trim(), password: password }).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  isValidUser({ commit }, username) {
    console.log("验证action!");
    return new Promise((resolve, reject) => {
      isValidUser({ username: username }).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
