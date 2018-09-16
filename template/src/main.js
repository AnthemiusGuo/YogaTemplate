// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";

import VueLocalStorage from "vue-localstorage";
Vue.use(VueLocalStorage);
//axios
import axios from "axios";
import qs from "qs";
let axiosIns = axios.create({});
if (process.env.NODE_ENV == "development") {
  axiosIns.defaults.baseURL = "/api/";
  // axiosIns.defaults.baseURL = 'http://api.anontraveler.com/'
} else {
  axiosIns.defaults.baseURL = "/api/";
}
console.log(
  "process.env.NODE_ENV",
  process.env.NODE_ENV,
  axiosIns.defaults.baseURL
);

//phpjs
// import phpjs from 'phpjs'
// Vue.prototype.$phpjs = phpjs

import router from "./basics/router";
import store from "./basics/store";
import bus from "./basics/eventBus";
import wx from "./basics/wx";
import enums from "./basics/enums";

Vue.prototype.$bus = bus;
Vue.prototype.$wx = wx;
Vue.prototype.$enums = enums;

import "./scss/main.scss";

//ajax 基础

axiosIns.defaults.responseType = "json";
axiosIns.defaults.transformRequest = [
  function(data) {
    return qs.stringify(data);
  }
];
axiosIns.defaults.validateStatus = function(status) {
  return true;
};

axiosIns.interceptors.request.use(function(config) {
  config.headers.Accept = "application/json";
  config.headers.System = "vue";
  if (instance.$store.state.isLogin) {
    config.headers.Token = instance.$store.state.userInfo.token;
  } else {
    instance.$store.commit("checkLogin");
    if (instance.$store.state.isLogin) {
      config.headers.Token = instance.$store.state.userInfo.token;
    }
  }
  return config;
});

axiosIns.interceptors.response.use(
  response => {
    let data = response.data;
    let status = response.status;

    if (status === 200 || status === 304) {
      let rstno = data.rstno;
      if (rstno > 0) {
        return data;
      } else {
        if (rstno === -401) {
          instance.$store.commit("doLogout");
          instance.$router.push({
            path: "/user/login",
            query: {
              redirect: instance.$route.fullPath
            }
          });
        }
        return Promise.reject(data);
      }
    } else {
      if (status === 412) {
        instance.$store.commit("doLogout");
        console.log(instance.$route.fullPath);
        instance.$router.push({
          path: "/user/login",
          query: {
            redirect: instance.$route.fullPath
          }
        });
      }
      instance.$emit("ajax_error", response.data);
      return Promise.reject({
        rstno: -10000,
        data: {
          msg: "网络错误",
          errInfo: response
        }
      });
    }
  },
  error => {
    return Promise.reject({
      rstno: -10000,
      data: {
        msg: "网络错误",
        errInfo: error
      }
    });
  }
);

let ajaxMethod = ["get", "post"];
let api = {};
ajaxMethod.forEach(method => {
  api[method] = function(uri, data, config) {
    return new Promise(function(resolve, reject) {
      axiosIns[method](uri, data, config)
        .then(json => {
          store.commit("setLoading", false);
          resolve(json);
        })
        .catch(response => {
          store.commit("setLoading", false);
          reject(response);
        });
    });
  };
});
api.fileUpload = function(uri, data, config) {
  return new Promise(function(resolve, reject) {
    if (!config) {
      config = { headers: {} };
    } else if (!config.headers) {
      config.headers = {};
    }
    config.headers["Content-Type"] = "multipart/form-data";
    config.transformRequest = [
      function(data) {
        return data;
      }
    ];
    // debugger;
    axiosIns
      .post(uri, data, config)
      .then(json => {
        resolve(json);
      })
      .catch(response => {
        reject(response);
      });
  });
};

Vue.prototype.$axios = api;
store.commit("setApi", api);
store.commit("checkLogin");

router.beforeEach((to, from, next) => {
  let gotoLoginPage = false;
  if (to.meta.requireLogin) {
    let isLogin = store.state.isLogin;
    if (!isLogin) {
      store.commit("checkLogin");
    }
    isLogin = store.state.isLogin;
    if (!isLogin) {
      gotoLoginPage = true;
    }
  }

  if (gotoLoginPage) {
    next({
      path: "/user/login",
      query: {
        redirect: to.fullPath
      }
    });
  } else {
    if (to.meta.noMenu) {
      store.commit("setMenu", {
        show: false
      });
    } else {
      store.commit("setMenu", {
        show: true,
        mainMenuActiveIndex: to.meta.menuIndex
      });
    }
    // 统计代码
    // _hmt.push(['_trackPageview', pageURL]) 必须是以"/"（斜杠）开头的相对路径
    if (to.path) window._hmt.push(["_trackPageview", "/#" + to.fullPath]);
    next();
  }
});

//各种 UI 库

import ElementUI from "element-ui";

Vue.use(ElementUI);

// import VueMarkdown from 'vue-markdown'
//Markdown 编辑器
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
Vue.use(mavonEditor);

// import phpjs from 'phpjs'
// Vue.prototype.$phpjs = phpjs
// import MarkdownIt from "markdown-it";
// Vue.prototype.$markdown = new MarkdownIt();
import mdFigure from "./markdown/figure";

mavonEditor.markdownIt.use(mdFigure, {
  dataType: true,
  figcaption: true,
  link: false
});

Vue.prototype.$markdown = mavonEditor.markdownIt;

Vue.use(require("vue-wechat-title"));

import App from "./App";

/* eslint-disable no-new */
let instance = new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  template: "<App/>"
});
