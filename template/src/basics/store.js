import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    userInfo: {
      userId: 0,
      name: "",
      token: "",
      type: 0
    },
    hasMenuBar: true,
    cartCounter: 2,
    news: {},
    loading: false,
    mainMenuActiveIndex: "dashboard",
    genre_styles_cached: false,
    genre_styles: {},
    genre_structure: {},
    api: null
  },
  mutations: {
    setMenu(state, data) {
      state.hasMenuBar = data.show;
      state.mainMenuActiveIndex = data.mainMenuActiveIndex;
    },
    setApi(state, api) {
      state.api = api;
    },
    setLoading(state, data) {
      state.loading = data;
    },
    fetchCatelog(state, isForce) {
      if (!isForce) {
        let genre_styles = Vue.localStorage.get("genre_styles");
        let genre_structure = Vue.localStorage.get("genre_structure");
        if (genre_styles && genre_structure) {
          state.genre_styles_cached = true;
          state.genre_styles = JSON.parse(genre_styles);
          state.genre_structure = JSON.parse(genre_structure);
          return;
        }
      }
      state.loading = true;

      state.api
        .post("/genres/catelog")
        .then(json => {
          state.loading = false;

          state.genre_styles = {};
          state.genre_structure = {};

          state.genre_styles = json.data.styles;
          state.genre_structure = json.data.structure;
          state.genre_styles_cached = true;

          Vue.localStorage.set(
            "genre_styles",
            JSON.stringify(state.genre_styles)
          );
          Vue.localStorage.set(
            "genre_structure",
            JSON.stringify(state.genre_structure)
          );
        })
        .catch(json => {
          state.loading = false;
        });
    },
    checkLogin(state) {
      if (state.isLogin) {
        return;
      }

      if (!localStorage.getItem("user_info")) {
        state.isLogin = false;
        return;
      }
      if (!localStorage.getItem("token_info")) {
        state.isLogin = false;
        return;
      }
      let userInfo = JSON.parse(localStorage.getItem("user_info"));
      let tokenInfo = JSON.parse(localStorage.getItem("token_info"));

      if (userInfo._id == 0) {
        state.isLogin = false;
        return;
      }
      state.isLogin = true;

      state.userInfo.userId = userInfo._id;
      state.userInfo.name = userInfo.name;
      state.userInfo.token = tokenInfo.token;
      state.userInfo.type = userInfo.type;

      return;
    },
    doLoginToken(state, data) {
      state.isLogin = true;
      state.userInfo.userId = data.user_info._id;
      state.userInfo.type = data.user_info.type;
      state.userInfo.name = data.user_info.name;
      state.userInfo.token = data.token_info.token;

      localStorage.setItem("user_info", JSON.stringify(data.user_info));
      localStorage.setItem("token_info", JSON.stringify(data.token_info));
    },
    doLogout(state) {
      state.isLogin = false;

      state.userInfo.userId = 0;
      state.userInfo.name = "";
      state.userInfo.token = "";
      state.userInfo.type = 0;

      localStorage.removeItem("user_info");
      localStorage.removeItem("token_info");
    },
    getUserInfo(state) {
      let userInfo = JSON.parse(localStorage.getItem("user_info"));
      let tokenInfo = JSON.parse(localStorage.getItem("token_info"));

      state.userInfo.userId = userInfo._id;
      state.userInfo.name = userInfo.name;
      state.userInfo.token = tokenInfo.token;
      state.userInfo.type = userInfo.type;
    },
    setUserInfo(state, data) {
      for (let k in data) {
        state["userInfo"][k] = data[k];
      }
      state.isLogin = true;
    }
  }
});
