<template>
<div id="app">
	<menubar></menubar>
	<div class="body-container">
		<router-view v-wechat-title="$route.meta.title"/>
	</div>
	<div class="footer">
		Craft by Anonymous Traveler Studio
		<br/>
		沪ICP备17020691
	</div>
</div>
</template>

<script>
import Menubar from "@/widgets/Menubar.vue";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
	name: "App",
	data() {
		return {};
	},
	computed: {
		// ...mapState(["userInfo", "isLogin"])
	},
	components: {
		Menubar
	},
	methods: {
		// ...mapMutations(["doLoginToken", "doLogout"]),
		doRefreshLogin() {
			this.$axios
				.get("/user/do_refresh")
				.then(json => {
					this.$store.commit("doLoginToken", json.data);
				})
				.catch(json => {
					this.doLogout();
				});
		}
	},
	created() {
		this.$wx.wxConfig(this.$axios, {});
		this.doRefreshLogin();
	}
};
</script>
