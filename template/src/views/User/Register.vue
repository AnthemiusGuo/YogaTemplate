<template>
<section class="page">
	<div class="container">
		<div class="row">
			<div class="col-md-6 offset-md-3 bg-white">
				<div class="pd-3">
					<ul class="nav nav-line mt-3">
						<li class="nav-item">
							<router-link class="nav-link" :to="{ path: '/user/login' }">登录</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link active" :to="{ path: '/user/register' }">注册</router-link>
						</li>
					</ul>
					<el-form ref="form" class="mt-3" :rules="rules" :model="form" label-width="80px" v-loading="loading">
						<el-form-item label="手机号" :error="err.phone" prop="phone">
							<el-input v-model="form.phone"></el-input>
						</el-form-item>
						<el-form-item label="显示名字" :error="err.name"  prop="name">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="密码" :error="err.pwd"  prop="pwd">
							<el-input type="password" v-model="form.pwd"></el-input>
						</el-form-item>
						<el-form-item label="重输密码" :error="err.pwd2"  prop="pwd2">
							<el-input type="password" v-model="form.pwd2"></el-input>
						</el-form-item>
						<el-form-item label="邀请码" :error="err.invite_code"  prop="invite_code">
							<el-input v-model="form.invite_code"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="doRegister">注册</el-button>
							<el-button>取消</el-button>
						</el-form-item>
					</el-form>
					<div class="intro">
						邀请码：任何一位编辑都有一定数量的邀请码，请自行联系任何一位编辑。
					</div>
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
				pwd: "",
				pwd2: "",
				name: "",
				invite_code: ""
			},
			err: {
				phone: "",
				pwd: "",
				pwd2: "",
				name: "",
				invite_code: ""
			},
			rules: {
				name: [
					{ required: true, message: "请输入", trigger: "change" }
				],
				phone: [
					{ required: true, message: "电话格式", trigger: "blur" },
					{
						min: 11,
						max: 11,
						message: "长度在 11 个字符",
						trigger: "blur"
					}
				],
				pwd: [
					{
						min: 6,
						message: "长度在 6 个字符以上",
						trigger: "change"
					}
				],
				pwd2: [
					{
						min: 6,
						message: "长度在 6 个字符以上",
						trigger: "change"
					}
				],
				invite_code: [
					{
						required: true,
						message: "目前只开放邀请注册",
						trigger: "change"
					}
				]
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
		doRegister() {
			this.resetFormValidation();
			this.$refs["form"].validate(valid => {
				if (valid) {
					if (this.form.pwd != this.form.pwd2) {
						this.err["pwd2"] = "两次输入的密码不同";
						this.loading = false;
						return;
					}
					this.loading = true;

					this.$axios
						.post("/user/doReg", this.form)
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
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		}
	},
	components: {}
};
</script>
