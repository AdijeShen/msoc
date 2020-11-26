import { login, logout, getInfo, newLogin, register, isValidUser } from '@/api/user'
import { addfunction, findAllFunctions } from "@/api/functions"
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: "",
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
  },
  SET_SK: (state, sk) => {
    state.Sk_f = sk
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ID: (state, id) => {
    state.id = id
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

  findAllFunctions({ commit }, data) {
    num = data.num
    start = data.start
    return new Promise((resolve, reject) => {
      findAllFunctions({ num: num, start: start }).then(response => {
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