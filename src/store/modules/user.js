import { login, logout, getInfo } from '@/api/user'
import { getAccessToken, setAccessToken, removeToken } from '@/utils/auth'

const state = {
  access_token: getAccessToken(),
  username: '',
  surname: '',
  merchant_name: '',
  phone: '',
  avatar: '',
  region: [],
  roles: []
}

const mutations = {
  SET_ACCESS_TOKEN: (state, access_token) => {
    state.access_token = access_token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_SURNAME: (state, surname) => {
    state.surname = surname
  },
  SET_MERCHANT_NAME: (state, merchant_name) => {
    state.merchant_name = merchant_name
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_REGION: (state, region) => {
    state.region = region
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_ACCESS_TOKEN', response.access_token)
        setAccessToken(response.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user sign up
  signUp({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        commit('SET_ACCESS_TOKEN', response.access_token)
        setAccessToken(response.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.access_token).then(response => {
        const { data } = response
        data.roles = ['admin']
        data.avatar = require('@/assets/avatars/phper.png')
        const { roles, username, surname, merchant_name, phone, region, avatar } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_USERNAME', username)
        commit('SET_SURNAME', surname)
        commit('SET_PHONE', phone)
        commit('SET_REGION', region)
        commit('SET_AVATAR', avatar)
        commit('SET_MERCHANT_NAME', merchant_name)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
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
