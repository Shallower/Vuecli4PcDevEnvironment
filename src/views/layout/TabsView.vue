<!--
 * @Descripttion: 历史视图
 * @version: 
 * @Author: Hevin
 * @Date: 2020-05-20 18:04:54
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 18:25:38
--> 
<template>
  <div class="tabs-view-container">
    <template v-for="tag in Array.from(visitedViews)">
      <router-link class="tabs-view"
        v-if="!$utils.isEmpty(tag.meta.title)"
        :to="tag.fullPath || tag.path"
        :key="tag.fullPath || tag.path">
        <el-tag :closable="true"
          :type="isActive(tag.fullPath || tag.path)?'primary':''"
          @close="closeViewTabs(tag,$event)">
          {{ tag.meta.title }}
        </el-tag>
      </router-link>
    </template>

  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  computed: {
    visitedViews() {
      return this.$store.getters.visitedViews.slice(-6);
    }
  },
  methods: {
    closeViewTabs(view, $event) {
      this.delVisitedViews(view).then(views => {
        if (this.isActive(view.fullPath || view.path)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView.fullPath || latestView.path);
          } else {
            this.$router.push("/");
          }
        }
      });
      $event.preventDefault();
    },
    generateRoute() {
      let match = this.$route.matched[this.$route.matched.length - 1];
      let lastMatch = {
        ...match,
        meta: { ...match.meta }
      };
      lastMatch.meta.title =
        lastMatch.meta.title || lastMatch.parent.meta.title;
      if (lastMatch.meta.title) {
        lastMatch.fullPath = this.$route.fullPath;
        return lastMatch;
      }
      this.$route.matched[0].path = "/";
      return this.$route.matched[0];
    },
    addViewTabs() {
      this.addVisitedViews(this.generateRoute());
    },
    isActive(path) {
      return path === this.$route.path || path === this.$route.fullPath;
    },
    ...mapActions(["addVisitedViews", "delVisitedViews"])
  },
  watch: {
    $route() {
      setTimeout(() => {
        this.addViewTabs();
      }, 0);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs-view-container {
  background-color: white;
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
  .tabs-view {
    margin-left: 10px;
    .el-tag {
      background-color: rgba(64, 149, 222, 0.1);
      color: #4095de;
      border-color: rgba(64, 149, 222, 0.5);
    }
    .el-tag--primary {
      border-color: #4095de;
    }
  }
}
</style>
