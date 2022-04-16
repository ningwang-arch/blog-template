<template>
  <div>
    <div
      v-if="!state.isMobile"
      class="nav"
    >
      <div class="nav-content">
        <el-row :gutter="20">
          <el-col :span="4">
            <router-link to="/">
              <div class="logo fl">
                <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
                  <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </div>
            </router-link>
          </el-col>
          <el-col :span="12">
            <el-menu
              :router="true"
              :default-active="state.activeIndex"
              active-text-color="#409eff"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menuItem
                :route="l.path"
                :index="l.index"
                v-for="l in state.list"
                :key="l.index"
              >
                {{l.name}}
              </el-menuItem>
            </el-menu>
          </el-col>
          <el-col :span="8">
            <div class="mt-4">
              <el-input
                v-model="state.search"
                placeholder="Search"
                class="input-with-select"
                @keyup.enter="queryResult"
              >
                <template #prepend>
                  <el-button icon="el-icon-search"  @click="queryResult"/>
                </template>
              </el-input>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div
      v-else
      class="nav"
    >
      <div class="nav-mobile">
        <div class="nav-mobile-logo">
          <router-link to="/">
            <div class="logo fl">
              <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
                <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </div>
          </router-link>
        </div>
        <div class="title">{{state.title}}</div>
        <div
          class="menu"
          @click="handleMenu"
        ><i class="el-icon-menu"></i></div>
      </div>
      <div
        v-if="state.isShow"
        class="nav-mobile-content"
        :class="{'enter-slideUp': state.enterSlideUp,'leave-slideDown': state.leaveSlideDown}"
      >
        <div class="list">
          <div
            @click="handleClickMenu('')"
            class="item"
          >
            <router-link to="/">首 页</router-link>
          </div>
          <div
            @click="handleClickMenu('/articles')"
            class="item"
          >
            <router-link to="/articles">文 章</router-link>
          </div>
          <div
            @click="handleClickMenu('/project')"
            class="item"
          >
            <router-link to="/project">项 目</router-link>
          </div>
          <div
            @click="handleClickMenu('/about')"
            class="item"
          >
            <router-link to="/about">关 于</router-link>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="state.isShow"
      class="mask"
      :class="{'mask-fade-out': state.leaveSlideDown}"
      @click="handleHideMenu"
    ></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
} from "vue";
import service from "../utils/https";
import urls from "../utils/urls";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import { key } from "../store";
import { isMobileOrPc, getQueryStringByName } from "../utils/utils";
import { UserInfo, NavListItem } from "../types/index";

export default defineComponent({
  name: "Nav",
  components: {
  },
  computed: {
    userInfo(): UserInfo {
      let userInfo: UserInfo = {
        _id: "",
        name: "",
        avatar: "",
      };
      if (window.sessionStorage.userInfo) {
        userInfo = JSON.parse(window.sessionStorage.userInfo);
        (this as any).$store.commit("SAVE_USER", {
          userInfo,
        });
      }
      if ((this as any).$store.state.user.userInfo) {
        userInfo = (this as any).$store.state.user.userInfo;
      }
      return userInfo;
    },
  },
  watch: {
    $route: {
      handler(val: any, oldVal: any) {
        this.routeChange(val, oldVal);
      },
      immediate: true,
    },
  },
  mounted() {
    // 授权登录的，有 code 参数
    this.routeChange(this.$route, this.$route);
    const code: string = getQueryStringByName("code");
    if (code) {
      this.getUser(code);
    }
  },
  setup(props, context) {
    const store = useStore(key);
    const router = useRouter();
    const state = reactive({
      visible: false,
      handleFlag: "",
      search: "",
      title: "首页",
      list: [
        {
          index: "1",
          path: "/",
          name: "首页",
        },
        {
          index: "2",
          path: "/articles",
          name: "文章",
        },
        {
          index: "3",
          path: "/project",
          name: "项目",
        },
        {
          index: "4",
          path: "/about",
          name: "关于",
        },
      ] as Array<NavListItem>,
      activeIndex: "0",
      enterSlideUp: false,
      leaveSlideDown: false,
      isShow: false,
      isMobile: isMobileOrPc(),
    });

    const routeChange = (val: any, oldVal: any) => {
      for (let i = 0; i < state.list.length; i++) {
        const l: NavListItem = state.list[i];
        if (l.path === val.path) {
          state.activeIndex = i + 1 + "";
          state.title = l.name;
          break;
        }
      }
    };

    const handleSelect = (val: string, oldVal: string): void => {
      state.activeIndex = val;
    };

    const handleOk = (value: boolean): void => {
      state.visible = value;
    };

    const handleCancel = (value: boolean): void => {
      state.visible = value;
    };

    const handleClick = (value: string): void => {
      state.handleFlag = value;
      state.visible = true;
    };

    const handleLogout = (): void => {
      window.sessionStorage.userInfo = "";
      store.commit("SAVE_USER", {
        userInfo: {
          _id: "",
          name: "",
          avatar: "",
        },
      });
    };


    const handleMenu = (): void => {
      state.isShow = true;
      state.enterSlideUp = true;
    };

    const getUser = async (code: string): Promise<void> => {
      const loading: any = ElLoading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });
      const data: UserInfo = await service.post(
        urls.getUser,
        { code },
        { withCredentials: true }
      );
      loading.close();

      const userInfo: UserInfo = {
        _id: data._id,
        name: data.name,
        avatar: data.avatar,
      };
      store.commit("SAVE_USER", {
        userInfo,
      });
      window.sessionStorage.userInfo = JSON.stringify(userInfo);
      ElMessage({
        message: "操作成功",
        type: "success",
      });
      let preventHistory = JSON.parse(window.sessionStorage.preventHistory);
      if (preventHistory) {
        router.push({
          path: preventHistory.name,
          query: preventHistory.query,
        });
      }
    };

    const handleHideMenu = (): void => {
      state.enterSlideUp = false;
      state.leaveSlideDown = true;
      setTimeout(() => {
        state.leaveSlideDown = false;
        state.isShow = false;
      }, 300);
    };

    const queryResult=(): void=> {
      const search: string = state.search;
      if (search) {
        router.push({
          path: "/articles",
          query: {
            search,
          },
        });
        console.log(search);
      }
    }

    return {
      state,
      handleCancel,
      handleOk,
      handleClick,
      handleLogout,
      handleMenu,
      getUser,
      handleSelect,
      queryResult,
      routeChange,
      handleHideMenu
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nav-mobile {
  display: flex;
  line-height: 60px;
  .nav-mobile-logo {
    flex: 1;
    margin-top: 5px;
    margin-left: 10px;
  }
  .title {
    flex: 3;
    font-size: 24px;
  }
  .menu {
    flex: 1;
    font-size: 34px;
    color: #409eff;
  }
}
.nav-mobile-content {
  font-size: 0.3rem;
  height: 7.3rem;
  width: 100%;
  background-color: #fff;
  .list {
    .item {
      line-height: 0.8rem;
      color: #303133;
      border-bottom: 1px solid #eee;
      a {
        display: block;
        width: 100%;
        color: #409eff;
        text-decoration-line: none;
      }
    }
  }
}
.nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  .nav-content {
    width: 1200px;
    margin: 0 auto;

    .mt-4{
      padding-top: 10px;
    }
  }
  .logo {
    height: 50px;
    margin: 0;
    border-radius: 50%;
    margin-top: 10px;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .el-menu--horizontal > .el-menu-item {
    cursor: pointer;
    color: #333;
  }
  .nav-right {
    position: relative;
    padding-top: 15px;
    text-align: right;
    .el-dropdown {
      cursor: pointer;
      padding-right: 60px;
    }
    .user-img {
      position: absolute;
      top: -15px;
      right: 0;
      width: 50px;
      border-radius: 50%;
    }
  }
}

.enter-slideUp,
.leave-slideDown {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1010;
}

.enter-slideUp {
  overflow: auto;
  visibility: visible;
  z-index: 1001;
  animation: slideUp 0.3s forwards;
}
.leave-slideDown {
  visibility: visible;
  z-index: 1001;
  animation: slideDown 0.3s forwards;
}
@keyframes slideUp {
  from {
    transform: translate3d(0, 100%, 0);
    opacity: 0.1;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes slideDown {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
}
.mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
}
.mask-fade-out {
  animation: maskFadeOut 0.4s forwards;
}
@keyframes maskFadeOut {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 0;
  }
}
</style>
