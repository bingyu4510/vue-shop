import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
import moment from 'moment'

// 导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'

//导入富文本编辑器组件中的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//这里是axios全局配置，有default
//设置基本路径
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
    // axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
    // axios.defaults.baseURL = 'http://shop.liulongbin.top/api/private/v1/'

//设置超时时间为10秒
axios.defaults.timeout = 10000

Vue.prototype.$axios = axios
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // console.log(config)
    return config //拦截之后必须返回，才能继续执行
})

//注册vue-table-with-tree-grid组件
Vue.component('tree-table', treeTable)

//这里导入的是element-ui中使用的样式文件，导入之后组件样式才会起作用
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/css/global.css'

Vue.config.productionTip = false

//在全局中注册富文本编辑器
Vue.use(VueQuillEditor, /* { default global options } */ )

//时间格式化
Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
        // yyyy-mm-dd hh:mm:ss
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
    render: h => h(App),
    router
}).$mount('#app')