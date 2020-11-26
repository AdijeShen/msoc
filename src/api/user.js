import request from '@/utils/request'
import requester from "@/utils/network"

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return requester({
    url: '/demo/register',
    method: 'post',
    params: data
  })
}

export function addfunction(data) {
  return requester({
    url: '/demo/addFunction',
    method: 'post',
    params: data
  })
}


export function newLogin(data) {
  return requester({
    url: '/demo/login',
    method: 'post',
    params: data
  })
}

export function isValidUser(data) {
  return requester({
    url: '/demo/isValidUser',
    method: 'post',
    params: data
  })
}


export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}