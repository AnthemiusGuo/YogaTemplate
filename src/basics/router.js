import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export default new Router({
	mode: "history",
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return {
				selector: to.hash
			};
		} else {
			return {
				x: 0,
				y: 0
			};
		}
	},
	routes: [
		{
			path: "/",
			name: "Index",
			component: resolve => require(["@/views/Index/Index"], resolve),
			meta: {
				requireLogin: false,
				menuIndex: "index"
			}
		},
		{
			path: "/user/login",
			name: "Login",
			component: resolve => require(["@/views/User/Login"], resolve),
			meta: {
				requireLogin: false,
				noMenu: true
			}
		},
		{
			path: "/user/register",
			name: "Register",
			component: resolve => require(["@/views/User/Register"], resolve),
			meta: {
				requireLogin: false,
				noMenu: true
			}
		},
		{
			path: "/user/my",
			name: "My",
			component: resolve => require(["@/views/User/My"], resolve),
			meta: {
				requireLogin: true,
				noMenu: true
			}
		}
	]
});
