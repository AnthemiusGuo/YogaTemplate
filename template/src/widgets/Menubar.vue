<template>
	<div class="d-print-none" :class="scrollClass">
		<div class="top-menu">
			<div class="logo">
			</div>
			<div class="navbar navbar-expand-lg navbar-light main-menu">
				<ul class="navbar-nav m-auto">
					<li class="nav-item" :class="{active:mainMenuActiveIndex=='index'}">
						<router-link class="nav-link" :to="{ name: 'Index' }">广场</router-link>
					</li>
					<li class="nav-item"  :class="{active:mainMenuActiveIndex=='rank'}">
						<router-link class="nav-link" :to="{ path: '/rank' }">榜单</router-link>
					</li>
					<li class="nav-item" :class="{active:mainMenuActiveIndex=='genre'}">
						<router-link class="nav-link" :to="{ path: '/genres' }">风格图书馆</router-link>
					</li>
					<li class="nav-item" v-if="!isLogin">
						<router-link class="nav-link" :to="{ path: '/user/login' }">登录/注册</router-link>
					</li>
					<li class="nav-item" v-if="isLogin">
						<router-link class="nav-link" :to="{ path: '/user/my' }">我的</router-link>
					</li>
				</ul>
			</div>
		</div>
		<div class="top-menu-space">
		</div>
		
	</div>
</template>
<script type="text/javascript">
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
	name: "Menu-bar",
	data() {
		return {
			scrollClass: ""
		};
	},

	computed: {
		...mapState(["mainMenuActiveIndex", "hasMenuBar", "isLogin"])
	},
	created() {},
	mounted() {
		this.$nextTick(function() {
			window.addEventListener("scroll", this.onScroll);
		});
	},

	methods: {
		handleSelect(key, keyPath) {
			// console.log(key, keyPath);
		},
		onScroll() {
			let scrolled =
				document.documentElement.scrollTop || document.body.scrollTop;
			if (scrolled > 55) {
				this.scrollClass = "is_scroll_higher";
			} else {
				this.scrollClass = "";
			}
		}
	},
	components: {}
};
</script>
