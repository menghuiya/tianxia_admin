import Vue from 'vue';
import saMenuList from './../sa-menu-list.js'; // 菜单集合
import sa_admin_code_util from './admin-util.js'; // admin代码util
import { swiper, swiperSlide } from 'vue-awesome-swiper'; // 组件 swiper
import saLogin from './../com-view/sa-login.vue'; // 组件 login
import sa403 from './../com-view/sa-403.vue'; // 组件 403
import sa404 from './../com-view/sa-404.vue'; // 组件 404
import sa500 from './../com-view/sa-500.vue'; // 组件 500
// sa_admin对象
export default {
  components: {
    swiper,
    swiperSlide,
    saLogin,
    sa403,
    sa404,
    sa500,
  },
  data: function() {
    // 首页
    var homeTab = {
      id: 'home', // 唯一标识
      name: '首页',
      view: () => import('./../com-view/sa-home.vue'),
      hide_close: true, // 隐藏关闭键
      is_rend: true,
    };

    return {
      version: 'v1.0.3', // 当前版本
      update_time: '2020-03-05', // 更新日期
      title: '', //'甜虾🦐后台管理',				// 页面标题
      logo_url: '', // logo地址
      icon_url: '', // icon地址
      github_url: 'https://github.com/click33/sa-vue-admin', // github地址
      default_active: '0', // 默认的高亮菜单id
      default_openeds: [], // 默认的打开数组
      unique_opened: true, // 是否保持只打开一个
      menuList: [], // 菜单集合
      homeTab: homeTab, // 主页tab
      nativeTab: homeTab, // 当前正显示的Tab
      tabList: [homeTab], // 页面集合
      atTitle: '', // 添加窗口时: 标题
      atUrl: '', // 添加窗口时: 地址
      scrollX: 0, // 滚动条位置
      // rightMaxHeight: 0,	// 右键菜单的最高高度 (控制是否展开)
      // rightZB: {x: 0, y: 0}	,// 右键菜单坐标
      rightTab: null, // 右键正在操作的tab
      rightShow: false, // 右键菜单是否正在显示
      rightStyle: {
        // 卡片标题右键菜单的样式
        left: '0px', // 坐标x
        top: '0px', // 坐标y
        maxHeight: '0px', // 右键菜单的最高高度 (控制是否展开)
      },
      is_drag: false, // 当前是否正在拖拽
      dragTab: null, // 当前正在拖拽的tab
      is_fold: false, // 菜单是否折叠
      is_fold_right: false, // 右边是否折叠（将右边盒子折叠与菜单折叠分开，这样可以减少动画的卡顿现象）
      is_full_screen: false, // 是否全屏
      user: null, // user信息
      now_time: '加载中...', // 当前时间
      switchV: localStorage.getItem('switchV') || 'fade', // 切换效果
      switchList: [
        // 切换动画数组
        { name: '淡入', value: 'fade' },
        { name: '滑动', value: 'slide' },
        { name: '方块', value: 'cube' },
        { name: '3D流', value: 'coverflow' },
        { name: '3D翻转', value: 'flip' },
      ],
      themeV: localStorage.getItem('themeV') || '1', // 当前主题值
      themeList: [
        // 主题数组
        { name: '蓝色', value: '1', show_all: false },
        { name: '绿色', value: '2', show_all: false },
        { name: '白色', value: '3', show_all: false },
        { name: '灰色', value: '4', show_all: false },
        { name: '灰色-展开', value: '5', show_all: true },
        { name: 'pro钛合金', value: '6', show_all: false },
        { name: '沉淀式黑蓝', value: '7', show_all: false },
        { name: '简约式灰蓝', value: '8', show_all: false },
      ],
      themeToggling: false, // 主题是否正在切换
      dropList: [], // 头像处下拉列表菜单
      mySwiper: null, // swiper相关
      is_show_tabbar: true, // 是否显示tab栏
      breMenuList: [homeTab], // 面包屑导航栏的tab数据
      is_reme_open: true, // 是否记住上一次最后打开的窗口
      // swiper配置
      swiperOption: {
        autoplay: false, // 自动切换
        effect: localStorage.getItem('switchV') || 'fade', // 切换效果
      },
      dialogTab: null, // dialogTab信息
    };
  },
  watch: {
    // 监听全屏动作
    is_full_screen: function(newValue) {
      if (newValue) {
        sa_admin_code_util.fullScreen();
      } else {
        sa_admin_code_util.fullScreenNormal();
      }
    },
    // 监听title改变时, 页面title也跟着切换
    title: function(newValue) {
      document.querySelector('title').innerHTML = newValue;
    },
    // 监听 icon_url 网页图标
    icon_url: function(newValue) {
      var icon_url = newValue;
      var icon_target = document.querySelector('.admin-icon');
      if (icon_target) {
        icon_target.setAttribute('href', icon_url);
      }
    },
  },
  computed: {},
  methods: {
    // ------------------- 初始化相关 --------------------
    // 初始化模板, 此方法只可调用一次
    init: function(option) {
      // 如果不填写
      option = option || {};

      // 一些属性
      this.is_show_tabbar =
        option.is_show_tabbar === undefined
          ? this.is_show_tabbar
          : option.is_show_tabbar; // 是否显示tabbar栏
      this.is_reme_open =
        option.is_reme_open === undefined
          ? this.is_reme_open
          : option.is_reme_open; // 是否记住上一次最后打开的窗口

      // 初始化swiper对象
      this.initSwiper();

      // 打印版本等信息
      if (option.printVesion !== false) {
        this.printVesion();
      }

      // 开始一些初始化动作
      this.showTabByHash(); // 打开上次最后的一个窗口
      window.onresize(); // 手动触发一下窗口变动监听
    },
    // ------------------- 对外预留接口 --------------------
    // show_list 为指定显示的id集合(注意是id的集合)，为空时代表显示所有
    initMenu: function(show_list) {
      this.setMenuList(saMenuList, show_list);
    },
    // 写入菜单，可以是一个一维数组(指定好parent_id)，也可以是一个已经渲染好的tree数组
    // show_list 为指定显示的id集合(注意是id的集合)，为空时代表显示所有
    setMenuList: function(menu_list, show_list) {
      // 转化为string 便于比较
      if (show_list) {
        for (var i = 0; i < show_list.length; i++) {
          show_list[i] = show_list[i] + '';
        }
      }
      menu_list = this.arrayToTree(menu_list);
      menu_list = this.refMenuList(menu_list, show_list);
      this.menuList = menu_list;
    },
    // 将一维平面数组转换为 Tree 菜单 (根据其指定的parent_id添加到其父菜单的childList)
    arrayToTree: function(menu_list) {
      for (var i = 0; i < menu_list.length; i++) {
        var menu = menu_list[i];
        // 添加到其指定的父菜单的childList
        if (menu.parent_id) {
          var parent_menu = this.getMenuById(menu_list, menu.parent_id);
          if (parent_menu) {
            parent_menu.childList = parent_menu.childList || [];
            parent_menu.childList.push(menu);
            menu_list.splice(i, 1); // 从一维中删除
            i--;
          }
        }
      }
      return menu_list;
    },
    // 将 menu_list 处理一下
    refMenuList: function(menu_list, show_list, parent_id) {
      for (var i = 0; i < menu_list.length; i++) {
        var menu = menu_list[i];
        menu.is_show = menu.is_show === false ? false : true;
        menu.parent_id = menu.parent_id || parent_id || 0;
        // 隐藏的给去掉
        // if(menu.is_show === false) {
        // 	sa_admin_code_util.arrayDelete(menu_list, menu);
        // 	i--;
        // 	continue;
        // }
        // 如果指定了 show_list，并且 menu.id 不在 show_list 里，划掉
        if (show_list && show_list.indexOf(menu.id) == -1) {
          // sa_admin_code_util.arrayDelete(menu_list, menu);
          // i--;
          // continue;
          menu.is_show = false;
        }
        // 有子项的递归处理
        if (menu.childList && menu.childList.length > 0) {
          this.refMenuList(menu.childList, show_list, menu.id); // 递归处理
        }
      }
      return menu_list;
    },

    // ------------------- 对外预留 end --------------------
    // 打开所有菜单的折叠
    show_all_menu: function() {
      var default_openeds = [];
      for (var i = 0; i < this.menuList.length; i++) {
        default_openeds.push(this.menuList[i].id);
        if (this.menuList[i].childList) {
          for (var j = 0; j < this.menuList[i].childList.length; j++) {
            default_openeds.push(this.menuList[i].childList[j].id);
          }
        }
      }
      this.default_openeds = default_openeds;
    },
    // 切换主题
    toggleTheme: function(command) {
      // 调整动画，避免卡顿
      this.themeToggling = true;
      setTimeout(
        function() {
          this.themeToggling = false;
        }.bind(this),
        1000
      );

      // 开始切换
      this.themeV = command + '';
      localStorage.setItem('themeV', command);
      for (var i = 0; i < this.themeList.length; i++) {
        if (this.themeList[i].value + '' == command + '') {
          if (this.themeList[i].show_all) {
            this.show_all_menu();
            this.unique_opened = false;
          } else {
            this.default_openeds = [];
            this.unique_opened = true;
          }
          // 给个提示
          if (window.dsadasdwdwawd) {
            this.$message('切换成功，' + this.themeList[i].name);
          }
          window.dsadasdwdwawd = true;
        }
      }
    },
    // 切换翻页方式
    toggleSwitch: function(command) {
      this.switchV = command + '';
      localStorage.setItem('switchV', command);

      this.$confirm('此动画效果将在您刷新页面之后生效，是否立即刷新？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function() {
          location.reload();
        })
        .catch(function() {});
    },
    // 处理userinfo的下拉点击
    handleCommand: function(command) {
      this.dropList.forEach(function(drop) {
        if (drop.name == command) {
          drop.click();
        }
      });
    },
    // 退出登录
    login_out: function() {
      console.log('退出登录');
    },
    // 折叠菜单
    fold_start: function() {
      this.is_fold_right = true;
      this.updateSlideSize(100); // swipre重新计算大小
      // 如果打开的 iframe 在五个以内  浏览器压力很小 就立刻展开菜单，
      // 如果打开 iframe 超过5个，浏览器就比较有压力， 此时会卡顿短暂时间，此时延时折叠菜单，让动画显得没那么卡
      if (this.tabList.length <= 5) {
        this.is_fold = true;
      } else {
        setTimeout(
          function() {
            this.is_fold = true;
          }.bind(this),
          100
        );
      }
    },
    // 展开菜单
    fold_end: function() {
      this.is_fold = false;
      // 延时200ms执行，让它没那么卡
      setTimeout(
        function() {
          this.is_fold_right = false;
          this.updateSlideSize(); // swipre重新计算大小
        }.bind(this),
        200
      );
    },
    // 刷新一下面包屑导航栏
    f5_breMenuList: function() {
      // 如果非单窗口模式, 则不刷新了,  节省cpu
      if (this.is_show_tabbar) {
        return;
      }
      //
      var menu = this.getMenuById(this.menuList, this.nativeTab.id);
      if (menu == null) {
        // 自定义tab这里会取不到值, 就造个假tab就好了
        this.breMenuList = [{ name: this.nativeTab.name }];
      } else {
        var breMenuList = [menu];
        for (var i = 0; i < breMenuList.length; i += 0) {
          var parent_id = breMenuList[0].parent_id;
          if (parent_id == 0 || parent_id == undefined) {
            break;
          }
          let menu = this.getMenuById(this.menuList, parent_id);
          breMenuList.unshift(menu);
        }
        this.breMenuList = breMenuList;
      }
    },
    // ------------------- tab 右键菜单相关 --------------------
    // 显示右键菜单
    right_showMenu: function(tab, event) {
      this.rightTab = tab; // 绑定操作tab
      var e = event || window.event;
      this.rightStyle.left = e.clientX + 1 + 'px'; // 设置给坐标x
      this.rightStyle.top = e.clientY + 'px'; // 设置给坐标y
      this.rightShow = true; // 显示右键菜单
      this.$nextTick(function() {
        var foxHeight = document.querySelector('.right-box-2').offsetHeight; // 应该展开多高
        this.rightStyle.maxHeight = foxHeight + 'px'; // 展开
        document.querySelector('.right-box').focus(); // 获得焦点,以被捕获失去焦点事件
      });
    },
    // 关闭右键菜单 - 立即关闭
    right_closeMenu: function() {
      this.rightStyle.maxHeight = '0px';
      this.rightShow = false;
    },
    // 关闭右键菜单 - 带动画折叠关闭 (失去焦点和点击取消时调用, 为什么不全部调用这个? 因为其它时候调用这个都太卡了)
    right_closeMenu2: function() {
      this.rightStyle.maxHeight = '0px';
      // this.rightShow = false;
    },
    // 右键 刷新
    right_f5: function() {
      this.showTab(this.rightTab); // 先转到
      this.rightTab.is_rend = false;
      this.$forceUpdate(); // 必须强制更新一下
      this.$nextTick(function() {
        this.rightTab.is_rend = true;
      });
    },
    // 右键 复制
    right_copy: function() {
      var tab = {
        id: new Date().getTime(),
        name: this.rightTab.name,
        view: this.rightTab.view,
      };
      this.showTab(tab);
    },
    // 右键 悬浮
    right_xf: function() {
      if (this.rightTab.id == this.homeTab.id + '') {
        this.$message({
          message: '这个不能全屏哦，换个卡片试试吧',
          type: 'warning',
        });
        return;
      }
      // 先关闭
      this.closeTab(
        this.rightTab,
        function() {
          this.f5_breMenuList();
        }.bind(this)
      );
      // 再打开
      this.dialogTabShow(
        this.rightTab.name,
        this.rightTab.view,
        this.rightTab.params,
        2
      );
    },
    // 右键 - 关闭
    right_close: function() {
      if (this.rightTab.id == this.homeTab.id + '') {
        this.$message({
          message: '这个不能关闭哦',
          type: 'warning',
        });
        return; // 隐藏右菜单
      }
      this.closeTab(
        this.rightTab,
        function() {
          this.f5_breMenuList();
        }.bind(this)
      );
    },
    // 右键 - 关闭其它
    right_close_other: function() {
      // 先滑到最左边
      this.scrollX = 0;
      // 递归删除
      var i = 0;
      var deleteFn = function() {
        // 如果已经遍历全部
        if (i >= this.tabList.length) {
          return;
        }
        // 如果在白名单,i++继续遍历, 如果不是,递归删除
        var tab = this.tabList[i];
        if (
          tab.id + '' == this.homeTab.id + '' ||
          tab.id + '' == this.rightTab.id
        ) {
          i++;
          deleteFn();
        } else {
          this.closeTab(tab, function() {
            deleteFn();
          });
        }
      }.bind(this);
      deleteFn();
    },
    // 右键 - 关闭所有
    right_close_all: function() {
      // 先滑到最左边
      this.scrollX = 0;
      // 递归删除
      var i = 0;
      var deleteFn = function() {
        // 如果已经遍历全部
        if (i >= this.tabList.length) {
          this.f5_breMenuList();
          return;
        }
        // 如果在白名单,i++继续遍历, 如果不是,递归删除
        var tab = this.tabList[i];
        if (tab.id + '' == this.homeTab.id + '') {
          i++;
          deleteFn();
        } else {
          this.closeTab(tab, function() {
            deleteFn();
          });
        }
      }.bind(this);
      deleteFn();
    },
    // 右键 - 全屏打开
    right_full: function() {
      // 先关闭
      if (this.rightTab.id != this.homeTab.id + '') {
        // 主页就不关了
        this.closeTab(
          this.rightTab,
          function() {
            this.f5_breMenuList();
          }.bind(this)
        );
      }
      // 再打开
      this.dialogTabShow(
        this.rightTab.name,
        this.rightTab.view,
        this.rightTab.params,
        1
      );
    },
    // 右键 - 新窗口打开
    right_window_open: function() {
      // 先关闭
      if (this.rightTab.id != this.homeTab.id + '') {
        // 主页就不关了
        this.closeTab(
          this.rightTab,
          function() {
            this.f5_breMenuList();
          }.bind(this)
        );
      }
      open(this.rightTab.url);
    },
    // 获取指定tab所代表iframe的url地址 (同域下可获取最新地址, 跨域时只能获取初始化时的地址)
    getTabUrl: function(tab) {
      this.sss(tab);
      // var cs = '#iframe-' + tab.id;
      // var iframe = document.querySelector(cs);
      // try{
      // 	return iframe.contentWindow.location.href;
      // }catch(e){
      // 	return iframe.getAttribute('src');
      // }
    },

    // ------------------- menu 相关 --------------------
    // 点击子菜单时的回调,
    // 参数: 点击菜单index标识（不是下标）, 所有已经打开的菜单 index
    selectMenu: function(index) {
      var menu = this.getMenuById(this.menuList, index);
      if (menu != null) {
        // 如果是click函数
        if (menu.click) {
          return menu.click(this, this.sa);
        }
        // 如果是外部链接
        if (menu.is_blank) {
          return open(menu.url);
        }
        this.showTab(menu);
      }
    },
    // js显示某个菜单
    showMenuById: function(id) {
      var menu = this.getMenuById(this.menuList, id);
      if (menu) {
        this.showTab(menu);
      }
    },
    // 返回指定 index 的menu
    getMenuById: function(menuList, id) {
      for (var i = 0; i < menuList.length; i++) {
        var menu = menuList[i];
        if (menu.id + '' == id + '') {
          return menu;
        }
        // 如果是二级或多级
        if (menu.childList) {
          var menu2 = this.getMenuById(menu.childList, id);
          if (menu2 != null) {
            return menu2;
          }
        }
      }
      return null;
    },
    // 显示homeTab
    showHome: function() {
      this.showTab(this.homeTab);
    },

    // ------------------- tab title 相关 --------------------
    // 在一个tab上, 初始化 view
    initTabView: function(tab) {
      // 如果已经初始化过了
      if (tab.is_init_view) {
        return;
      }
      // 开始初始化
      tab.params = tab.params || {}; // 给参数一个默认值
      tab.is_rend = true; // 是否显示, 利用此来强制刷新子组件

      // 如果是一个.html页面
      if (tab.url) {
        let template =
          '<div class="iframe-view-box"><iframe class="iframe-view" src="' +
          tab.url +
          '"></iframe></div>';
        tab.view = { template: template };
        return (tab.is_init_view = true);
      }

      // 如果是

      return (tab.is_init_view = true);
    },
    // 关闭tab - 无动画版本
    closeTab_not_an: function(tab) {
      this.sss(tab);
      // 根据没有地方调用这个方法, 所以先不写了嘻嘻
    },
    // 关闭页面
    closeTab: function(tab, callFn) {
      // 执行关闭动画
      var div = document.querySelector('#tab-' + tab.id);
      div.style.width = div.offsetWidth + 'px';
      setTimeout(function() {
        div.style.width = '0px';
      }, 0);

      // 等待动画结束
      setTimeout(
        function() {
          // 如果tab为当前正在显示的tab, 则先不让它显示
          if (tab == this.nativeTab) {
            var index = this.tabList.indexOf(tab);
            var preTab = this.tabList[index - 1];
            this.showTab(preTab);
          }
          // 开始从集合中移除
          sa_admin_code_util.arrayDelete(this.tabList, tab);
          // this.deleteSlide(tab.id);
          // 如果有回调
          if (callFn) {
            this.$nextTick(function() {
              callFn();
            });
          }
        }.bind(this),
        150
      );
    },
    // js关闭某个tab, 根据id
    closeTabById: function(id, callFn) {
      var tab = this.getTabById(id);
      if (tab) {
        this.closeTab(tab, callFn);
      }
    },
    // 添加一个Tab  {id,name,url}
    addTab: function(tab) {
      tab.is_have_en = this.is_have_en(tab.name); // 有英文字母的不能加字体加粗动画, 因为会影响tab选项卡的width尺寸, 造成动画混乱
      // tab.view = () => import('@/sa-view/HelloWorld.vue');
      this.initTabView(tab);
      this.tabList.push(tab);
      // this.addSlide(tab);
    },
    // 显示某个页面  (如果不存在, 则先添加)
    showTab: function(tab) {
      // 如果是当前正在显示的tab , 则直接 返回
      if (tab == this.nativeTab && tab != this.homeTab) {
        return;
      }
      // 如果没有先添加
      if (this.getTabById(tab.id) == null) {
        this.addTab(tab);
      }
      // 然后显示
      this.$nextTick(function() {
        this.gotoSlide(tab.id);
        // 如果是无tabbar模式
        if (!this.is_show_tabbar) {
          this.rightTab = tab;
          this.right_close_other();
          this.f5_breMenuList();
        }
        this.f5HashByNativeTab();
      });

      this.nativeTab = tab;
      this.default_active = tab.id + ''; // 左边自动关联, 如果左边没有，则无效果

      // 归位一下
      this.$nextTick(
        function() {
          this.scrollToAuto();
        }.bind(this)
      );
    },
    // 显示一个选项卡, 根据 id , 不存在则不显示
    showTabById: function(id) {
      var tab = this.getTabById(id);
      if (tab) {
        this.showTab(tab);
      }
    },
    // 获取 Tab 根据 id
    getTabById: function(id) {
      for (var i = 0; i < this.tabList.length; i++) {
        if (this.tabList[i].id + '' == id + '') {
          return this.tabList[i];
        }
      }
      return null;
    },
    // 双击tab栏空白处, 打开弹窗添加窗口
    atOpen: function() {
      window.r_layer_12345 = this.layer.open({
        type: 1,
        shade: 0.5,
        title: '添加新窗口', //不显示标题
        content: $('.at-form-dom'), //捕获的元素
        cancel: function() {},
      });
    },
    // 根据表单添加新窗口
    atOk: function() {
      if (this.atTitle == '' || this.atUrl == '') {
        return;
      }
      // 创建tab
      var tab = {
        id: new Date().getTime(),
        name: this.atTitle,
        url: this.atUrl,
      };
      // 打开tab
      this.showTab(tab);
      // 关闭并清空
      this.layer.close(window.r_layer_12345);
      this.atTitle = '';
      this.atUrl = '';
    },
    // 返回一个字符串中是否有英文字母
    is_have_en: function(str) {
      var reg = /[a-z]/i;
      return reg.test(str); //true,说明有英文字母
    },
    // ------------------- tab左右滑动  --------------------
    // 视角向左滑动一段距离
    scrollToLeft: function() {
      var width = document.querySelector('.nav-right-2').clientWidth; // 视角宽度
      this.scrollX += width / 2; // 视角向左滑动一段距离
      // 越界检查
      setTimeout(
        function() {
          if (this.scrollX > 0) {
            this.scrollX = 0;
          }
        }.bind(this),
        200
      );
    },
    // 视角向右滑动一段距离
    scrollToRight: function() {
      var width = document.querySelector('.nav-right-2').clientWidth; // 视角宽度
      var tabListWidth = document.querySelector('.tab-title-box').clientWidth; // title总盒子宽度
      var rightLimit = 0 - tabListWidth + width / 2; // 右滑的极限
      this.scrollX -= width / 2; // 视角向右滑动一段距离
      // 越界检查
      setTimeout(
        function() {
          if (this.scrollX < rightLimit) {
            this.scrollX = rightLimit;
          }
          // 同时防止左边越界
          if (this.scrollX > 0) {
            this.scrollX = 0;
          }
        }.bind(this),
        200
      );
    },
    // 自动归位
    scrollToAuto: function() {
      // console.log('自动归位=========');
      try {
        // 最后一个不用归位了
        // if(this.nativeTab == this.tabList[this.tabList.length - 1]){
        // 	return;
        // }
        var width = document.querySelector('.nav-right-2').clientWidth; // 视角宽度
        var left = document.querySelector('.tab-native').lastChild.offsetLeft; // 当前native-tilte下一个距离左边的距离
        // console.log(width, left, this.scrollX);
        // 如果在视图右边越界
        if (left + this.scrollX > width - 100) {
          return this.scrollToRight();
        }
        // 如果在视图左边越界
        if (left + this.scrollX < 0) {
          return this.scrollToLeft();
        }
      } catch (e) {
        // throw e;
      }
    },
    // ------------------- tab拖拽相关 --------------------
    // 在 某个tab上被松开  -->  重新排序   ( 函数未完成 )
    tab_ondrop: function(tab) {
      this.sss(tab);
      /**
       * 写到一半发现,这看似简单的一个功能, 实则复杂无比
       * 首先tab卡交换顺序, 算法就已经比较复杂, 同时为了不显着生硬,还要加上:
       * tab被悬浮提示,
       * tab卡交换动画,
       * 避开在v-for下操作dom带来的一系列坑
       * 其次, 下面的iframe, 也要按照相应顺序进行交换,
       * 而swiper本身没有提供这样的api, 又要用js操作dom
       * 交换dom顺序, 同时又要保持iframe不被销毁(因为用户肯定不想看到交换一下tab 页面竟然初始化了)
       * 同时一些列操作后, 又要保证不和swiper本身产生冲突...
       * 脑供血不足了...... 让我缓缓...
       * 求前端大神提交pr, 跪谢!!!
       */

      // // 如果没有交换
      // if(tab == this.dragTab)  {
      // 	return;
      // }
      // // 删除这个
      // var dragIndex = this.tabList.indexOf(this.dragTab);
      // this.tabList.splice(dragIndex, 1);
      // // 重新添加到这个位置
      // this.$nextTick(function() {
      // 	var tabIndex = this.tabList.indexOf(tab);
      // 	this.tabList.splice(tabIndex + 1, 0, this.dragTab);
      // })
    },
    // ------------------- 锚链接路由相关 --------------------
    // 根据锚链接, 打开窗口
    showTabByHash: function() {
      // 如果非记住模式
      if (this.is_reme_open == false) {
        return;
      }
      // 获取锚链接中的id
      var hash = location.hash;
      var id = hash.replace('#', '');

      if (id == '') {
        this.showHome();
        return;
      }
      // 如果已经存在与tabbar中
      var tab = this.getTabById(id);
      if (tab != null) {
        return this.showTab(tab);
      }
      // 否则从菜单中打开
      if (id == this.homeTab.id) {
        this.showHome();
      } else {
        this.showMenuById(id);
      }
      // 此时, 仍有一种tab打不开, 那就是自定义tab然后还已经关闭的,
      // 预设 解决方案: 在localStor里存储所有打开过的tab,
      // 以后如果有强需求这个功能时, 再实现
    },
    // 根据当前tab刷新一下锚链接
    f5HashByNativeTab: function() {
      // 如果非记住模式
      if (this.is_reme_open == false) {
        return;
      }
      location.hash = this.nativeTab.id;
    },
    // ------------------- swiper相关 --------------------
    // 初始化swiper
    initSwiper: function(switchV) {
      this.sss(switchV);
      this.mySwiper = this.$refs.mySwiper.swiper;
      // this.mySwiper = new Swiper('.swiper-container', {
      // 	autoplay: false,		// 可选选项，自动滑动
      // 	effect: switchV
      // })
    },
    // 获取指定slide的索引, 根据id
    getSlideIndexById: function(id) {
      var tab = this.getTabById(id);
      return this.tabList.indexOf(tab);
    },
    // 删除slide,  根据指定iframe的id
    deleteSlide: function(id) {
      this.sss(id);
      // var slideIndex = this.getSlideIndexById(id);
      // if(slideIndex != -1) {
      // 	this.mySwiper.removeSlide(slideIndex);
      // }
    },
    // 切换到指定的slide, 根据id
    gotoSlide: function(id) {
      var slideIndex = this.getSlideIndexById(id);
      if (slideIndex != -1) {
        this.mySwiper.slideTo(slideIndex, 300);
      }
    },
    // 更正slide大小 ms = 延时毫秒数
    updateSlideSize: function(ms) {
      ms = ms || 1;
      setTimeout(
        function() {
          this.mySwiper.update(); // swipre重新计算大小
        }.bind(this),
        ms
      );
    },
    // ------------------- 登录 与鉴权 --------------------
    // 打开登录页面
    openLogin: function() {
      this.$refs['sa-login'].isShow = true;
    },
    // 关闭login页面
    closeLogin: function() {
      this.$refs['sa-login'].isShow = false;
    },
    // 打开403页面
    open403: function() {
      this.$refs['sa403'].isShow = true;
    },
    // 打开404页面
    open404: function() {
      this.$refs['sa404'].isShow = true;
    },
    // 打开500页面
    open500: function() {
      this.$refs['sa500'].isShow = true;
    },

    // ------------------- 杂七杂八 --------------------
    // 什么也不做, 帮助一下不太规范的语法逃避检查
    sss: function() {},
    // 获取指定视图的对象，用来跨视图通信
    getView: function(id) {
      var com = this.$refs['view-' + id];
      if (com) {
        return com[0];
      }
    },
    // 悬浮或者, 全屏显示tab
    // title=标题,  view=要显示的组件, params=参数 ,way= 方式(1=全屏,2=悬浮打开)
    dialogTabShow: function(title, view, params, way) {
      this.dialogTab = {
        // dialog信息
        isShow: true, // 是否显示
        isShow2: true, // 是否显示视图(先关闭视图,在关闭dialog,解决dialog关闭时视图重复刷新的莫名bug)
        title: title || '信息', // 标题
        view: view || { template: '<div>加载中</div>' }, // 显示的组件
        params: params || {}, // 参数
        way: way || 1,
        beforeClose: function(done) {
          this.dialogTab.isShow2 = false;
          done();
        }.bind(this),
      };
    },
    closeDialog: function() {
      this.dialogTab.isShow = false;
    },
    // 打开便签
    openNote: function() {
      var w = document.body.clientWidth * 0.4 + 'px';
      var h = document.body.clientHeight * 0.6 + 'px';
      var default_content =
        '一个简单的小便签, 关闭浏览器后再次打开仍然可以加载到上一次的记录, 你可以用它来记录一些临时资料';
      var value = localStorage.getItem('sa_admin_note') || default_content;
      var index = this.layer.prompt(
        {
          title: '一个小便签',
          value: value,
          formType: 2,
          area: [w, h],
          btn: ['保存'],
          maxlength: 99999999,
        },
        function(pass, index) {
          this.layer.close(index);
        }.bind(this)
      );
      var se = '#layui-layer' + index + ' .layui-layer-input';
      var d = document.querySelector(se);
      d.oninput = function() {
        localStorage.setItem('sa_admin_note', this.value);
      };
    },
    // 弹窗
    msg: function(msg) {
      this.layer.msg(msg);
    },
    // 打印版本
    printVesion: function() {
      console.log(
        '欢迎使用sa-admin(vue单页版)，当前版本：' +
          this.version +
          '，更新于：' +
          this.update_time
      );
    },
    // 初始化window相关配置
    initWindow: function() {
      // sa-admin对象
      var sa_admin = this;

      // 挂在到原型
      Vue.prototype.sa_admin = sa_admin;

      // 监听窗口大小变动
      window.onresize = function() {
        if (document.body.clientWidth < 800) {
          sa_admin.fold_start();
        } else {
          sa_admin.fold_end();
        }
      };

      // 监听锚链接变动
      window.onhashchange = function() {
        // console.log('锚链接变动了');
        this.showTabByHash();
      }.bind(this);

      // 一直更新时间
      if (window.abcdefghijklmn) {
        clearInterval(window.abcdefghijklmn);
      }
      window.abcdefghijklmn = setInterval(function() {
        var da = new Date();
        var Y = da.getFullYear(); //年
        var M = da.getMonth() + 1; //月
        var D = da.getDate(); //日
        var h = da.getHours(); //小时
        var sx = '凌晨';
        if (h >= 6) {
          sx = '上午';
        }
        if (h >= 12) {
          sx = '下午';
          if (h >= 18) {
            sx = '晚上';
          }
          h -= 12;
        }
        var m = da.getMinutes(); //分
        var s = da.getSeconds(); //秒
        var z = ['日', '一', '二', '三', '四', '五', '六'][da.getDay()]; //周几
        // z = z == 0 ? '日' : z;
        var zong = '';

        zong +=
          Y +
          '-' +
          M +
          '-' +
          D +
          ' ' +
          sx +
          ' ' +
          h +
          ':' +
          m +
          ':' +
          s +
          ' 周' +
          z;
        sa_admin.now_time = zong;
      }, 1000);
    },
  },
  mounted: function() {
    this.initWindow();
    this.SaAdminInIt(this.sa_admin, this.sa);
    let userdata = sessionStorage.getItem('userInfo');
    if (!userdata) {
      this.sa_admin.openLogin(); // 打开登录页面
    } else {
      this.$store.commit('initData', userdata);
    }
  },
};
