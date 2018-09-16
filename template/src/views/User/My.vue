<template>
<section class="page">
	<div class="container-fluid">
		<div class="row user-lead-info">
			<div class="col-lg-12">
				<div class="container">
					<h2 class="user-name">{{info.name}} <span class="user-type">{{info.tran_type}}</span></h2>
				</div>
			</div>
		</div>
		<div class="row mt-3">
			<div class="col-lg-8">
				<atarticle class="border-bottom" :article="article_info" :full="2" v-for="article_info in articles"  :key="article_info._id">
				</atarticle>
			</div>
			<div class="col-lg-4">
				<MyRightbar>
				</MyRightbar>
			</div>
		</div>
		
	</div>
</section>
</template>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
	name: "MyPage",
	data() {
		return {
			loading: false,
			articles: [],
			info: {
				phone: "",
				name: "",
				tran_type: ""
			}
		};
	},

	computed: {
		// ...mapState(["userInfo"])
	},
	created() {
		this.refreshData();
	},
	mounted() {},

	methods: {
		resetFormValidation() {
			for (var k in this.err) {
				this.err[k] = "";
			}
		},
		refreshData() {
			this.loading = true;
			this.$axios
				.get("/user/user/" + this.userInfo.userId)
				.then(json => {
					this.loading = false;
					for (let k in json.data.info) {
						this.info[k] = json.data.info[k];
					}
				})
				.catch(json => {
					this.loading = false;
				});
		}
	},
	components: {
		MyRightbar
	}
};
</script>
