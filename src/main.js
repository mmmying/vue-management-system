// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import './assets/css/global.css';
import './assets/fonts/iconfont.css';
import {
  Button,
  Input,
  Form,
  FormItem,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItem,
  Divider,
  Breadcrumb,
  Pagination,
  Table,
  TableColumn,
  Switch,
  Row,
  Col,
  Dialog,
  Select,
  Option,
  MessageBox,
  Steps,
  Step,
  Cascader,
  Tabs,
  TabPane,
  Tag
} from 'element-ui';
// Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }; // 全局配置
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Divider);
Vue.use(Breadcrumb);
Vue.use(Pagination);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Cascader);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$message = Message;

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
Vue.prototype.$axios = axios;

// 过滤器
Vue.filter('formatDate', function(val) {
  const date = new Date(val * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1 + '').padStart(2, '0');
  const day = (date.getDate() + '').padStart(2, '0');
  const h = (date.getHours() + '').padStart(2, '0');
  const m = (date.getMinutes() + '').padStart(2, '0');
  const s = (date.getSeconds() + '').padStart(2, '0');
  return `${year}-${month}-${day} ${h}:${m}:${s}`;
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
