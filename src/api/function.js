import requester from "@/utils/network"

export function addfunction(data) {
  return requester({
    url: '/demo/addFunction',
    method: 'post',
    params: data
  })
}

export function findAllFunctions(data) {
  return requester({
    url: '/demo/findAllFunctions',
    method: 'post',
    params: data
  })
}