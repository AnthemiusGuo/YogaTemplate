<template>
<section class="page">
	<div class="container">
		<div class="row">
			
			<div class="col-md-6 offset-md-3 bg-white">
				<div class="pd-3">
					<ul class="nav nav-line mt-3">
						<li class="nav-item">
							<router-link class="nav-link active" :to="{ path: '/user/login' }">登录</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" :to="{ path: '/user/register' }">注册</router-link>
						</li>
					</ul>
					<el-form ref="form" class="mt-3" :model="form" label-width="80px" v-loading="loading">
							<el-form-item label="手机号" :error="err.phone">
								<el-input v-model="form.phone"></el-input>
							</el-form-item>
							<el-form-item label="密码" :error="err.pwd">
								<el-input type="password" v-model="form.pwd"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="doLogin">登录</el-button>
								<el-button>取消</el-button>
							</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
	name: "User-Login",
	data() {
		return {
			loading: false,
			form: {
				phone: "",
				pwd: ""
			},
			err: {
				phone: "",
				pwd: ""
			}
		};
	},

	computed: {},
	created() {},
	mounted() {},

	methods: {
		// ...mapMutations(["doLoginToken"]),
		resetFormValidation() {
			for (var k in this.err) {
				this.err[k] = "";
			}
		},
		doLogin() {
			this.resetFormValidation();
			this.loading = true;
			this.$axios
				.post("/user/doLogin", this.form)
				.then(json => {
					this.loading = false;

					this.$store.commit("doLoginToken", json.data);
					let path = "/";
					if (this.$route.query.redirect) {
						path = this.$route.query.redirect;
					}
					this.$router.replace({
						path: "/"
					});
					this.$message({
						message: "登录成功",
						type: "success"
					});
				})
				.catch(json => {
					this.loading = false;

					for (var k in json.data) {
						this.err[k] = json.data[k];
					}
				});
		}
	},
	components: {}
};
</script>
