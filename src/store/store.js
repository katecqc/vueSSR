// 使用require.context匹配出module模块下的所有store，一次性加载到router里面
const storeContext = require.context('../module/', true, /\.(\/.+)\/js\/store(\/.+){1,}\.js/)

const getStore = (context) => {
  storeContext.keys().filter((key) => {
    const filePath = key.replace(/^(\.\/)|(js\/store\/)|(\.js)$/g,'')
    let moduleData = storeContext(key).default || storeContext(key)
    const namespaces = filePath.split('/')

    moduleData = normalizeModule(moduleData, filePath)
    store.modules = store.modules || {}
    const storeModule = getStoreModule(store, namespaces) // 递归创建模块
    VUEX_PROPERTIES.forEach((property) => {
      mergeProperty(storeModule, moduleData[property], property) // 将每个模块的store统一挂载管理
    })
    return true
  })
}

export default ({ context }) => {
  getStore(context)

  return new Vuex.Store({
    modules: {
      ...store.modules,
    }
  })
}
