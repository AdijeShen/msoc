const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: 'x1+x2^2-3*x1^2*x2^4+3',
    'status|1': ['completed', 'pending', 'invalid'],
    author: '@cname',
    display_time: '@datetime',
    pageviews: '@integer(0, 3)'
  }]
})

module.exports = [{
  url: '/vue-admin-template/table/list',
  type: 'get',
  response: config => {
    const items = data.items
    return {
      code: 20000,
      data: {
        total: items.length,
        items: items
      }
    }
  }
}]