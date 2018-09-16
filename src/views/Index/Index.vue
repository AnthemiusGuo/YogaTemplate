<template>
<section class="page">
	<div class="container-fluid">
		<div class="row">
		</div>
	</div>
</section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
	data() {
		return {
			loading: true,
			loadings: {
				articles: false,
				medias: false
			}
		};
	},
	created() {
		this.$store.state.hasMenuBar = true;
		this.refreshData();
	},
	beforeDestroy() {
		if (this.handlerTimeout) {
			window.clearTimeout(this.handlerTimeout);
		}
	},
	methods: {
		refreshData() {
			this.loadings.articles = true;
			this.$axios
				.post("/index/index/", { page: this.pagination.pageNow })
				.then(json => {
					this.loadings.articles = false;
					this.articles = [];
					for (let k in json.data.articles) {
						this.articles.push(json.data.articles[k]);
					}
					this.pagination.total = json.data.pages.total;
				})
				.catch(json => {
					this.loadings.articles = false;
				});
		}
	},
	computed: {
		// ...mapState(["userInfo", "isLogin"])
	},
	watch: {},
	components: {}
};
</script>
<style lang="scss" scoped>
</style>
