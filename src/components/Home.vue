<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <!-- <img src="../assets/logo.png" alt="" class="logo" /> -->
        <span>后台管理系统</span>
      </div>
      <div class="header-right">
        <span>
          <i class="iconfont icon-user"></i>
          &nbsp {{username}}
        </span>
        <el-divider direction="vertical"></el-divider>
        <span @click="logout">
          <i class="iconfont icon-tuichu"></i>&nbsp 退出
        </span>
      </div>

      <!-- <el-button type="info" plain @click="logout">退出</el-button> -->
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse-btn" @click="handleCollapse">
          <i class="iconfont" :class="isCollapse ? 'icon-zhankai' : 'icon-shouqi'"></i>
        </div>
        <el-menu
          background-color="#f6f5ec"
          text-color="#74787c"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          unique-opened
        >
          <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.id + ''">
            <template slot="title">
              <i :class="iconList[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item
              v-for="submenu in menu.children"
              :key="submenu.path"
              :index="`/${submenu.path}`"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ submenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-icon',
        145: 'iconfont icon-tongji',
      },
      isCollapse: false,
      username: '',
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList() {
      this.$axios.get('menus').then(({ data: res }) => {
        if (res.meta.status === 200) {
          this.menuList = res.data
        }
      })
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
  created() {
    this.username = window.sessionStorage.getItem('username')
    this.getMenuList()
  },
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #409eff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #f6f5ec;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
    }
    .header-right {
      font-size: 14px;
      &:hover {
        cursor: pointer;
      }
      .el-divider--vertical {
        margin: 0 15px;
      }
    }
  }
  .el-aside {
    background-color: #f6f5ec;
    .el-menu {
      border-right: none;
    }
    .collapse-btn {
      background-color: #f2eada;
      text-align: center;
      height: 36px;
      line-height: 36px;
      color: #74787c;
    }
  }
  .el-container {
    background-color: #f8f8f5;
  }

  .logo {
    width: 50px;
    height: 50px;
  }
}
</style>
