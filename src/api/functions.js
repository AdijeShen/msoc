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
export function loadfunctiondetail(data) {
  return requester({
    url: '/demo/findOneFunctionById',
    method: 'post',
    params: data
  })
}
export function updatefunctionparams(data) {
  return requester({
    url: '/demo/updateFunctionParams',
    method: 'post',
    params: data
  })
}
export function getresult(data) {
  return requester({
    url: '/demo/getResult',
    method: 'post',
    params: data
  })
}

export function getCResult(data) {
  return requester({
    url: '/demo/getCipherResult',
    method: 'post',
    params: data
  })
}

export function getUserCipherText(data) {
  return requester({
    url: '/demo/getUserCipherText',
    method: 'post',
    params: data
  })
}

export function gettime(data) {
  return requester({
    url: '/demo/getTime',
    method: 'post'
  })
}

export function getfhetime(data) {
  return requester({
    url: '/demo/getFHETime',
    method: 'post'
  })
}


export function getsimpleresult(data) {
  return requester({
    url: '/demo/getSimpleResult',
    method: 'post',
    params: data
  })
}

export function submitusage(data) {
  console.log(data)
  return requester({
    url: '/demo/SimpleCal',
    method: 'post',
    params: data
  })
}



export function getcspciphertext(data) {
  return requester({
    url: '/demo/getCspCipherText',
    method: 'post',
    params: data
  })
}