import type { LocationQuery } from "vue-router";
import { isExternal } from "@/utils";

export interface TagView {
  name: string;
  title: string;
  path: string;
  fullPath: string;
  icon?: string;
  affix?: boolean;
  keepAlive?: boolean;
  query?: LocationQuery;
}

export interface TagsViewResult {
  visitedViews: TagView[];
  cachedViews: string[];
}

export interface DirectionalTagsViewResult {
  visitedViews: TagView[];
}

export const useTagsViewStore = defineStore("tagsView", () => {
  const visitedViews = ref<TagView[]>([]);
  const cachedViews = ref<string[]>([]);
  const router = useRouter();
  const route = useRoute();

  /**
   * 新增已訪問檢視到已訪問檢視列表中
   */
  function addVisitedView(view: TagView) {
    // 如果已經存在於已訪問的檢視列表中或者是重定向地址，則不再新增
    if (view.path.startsWith("/redirect") || isExternal(view.path) || isExternal(view.fullPath)) {
      return;
    }
    if (visitedViews.value.some((v) => v.path === view.path)) {
      return;
    }
    // 如果檢視是固定的（affix），則在已訪問的檢視列表的開頭新增
    if (view.affix) {
      visitedViews.value.unshift(view);
    } else {
      // 如果檢視不是固定的，則在已訪問的檢視列表的末尾新增
      visitedViews.value.push(view);
    }
  }

  /**
   * 新增快取檢視到快取檢視列表中
   */
  function addCachedView({ fullPath, keepAlive }: TagView) {
    // 如果快取檢視名稱已經存在於快取檢視列表中，則不再新增
    if (cachedViews.value.includes(fullPath)) {
      return;
    }

    // 如果檢視需要快取（keepAlive），則將其路由名稱新增到快取檢視列表中
    if (keepAlive) {
      cachedViews.value.push(fullPath);
    }
  }

  /**
   * 從已訪問檢視列表中刪除指定的檢視
   */
  function delVisitedView(view: TagView) {
    return new Promise((resolve) => {
      for (const [i, v] of visitedViews.value.entries()) {
        // 找到與指定檢視路徑匹配的檢視，在已訪問檢視列表中刪除該檢視
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1);
          break;
        }
      }
      resolve([...visitedViews.value]);
    });
  }

  function delCachedView(view: TagView) {
    const { fullPath } = view;
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(fullPath);
      if (index > -1) {
        cachedViews.value.splice(index, 1);
      }
      resolve([...cachedViews.value]);
    });
  }
  function delOtherVisitedViews(view: TagView) {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((v) => {
        return v?.affix || v.path === view.path;
      });
      resolve([...visitedViews.value]);
    });
  }

  function delOtherCachedViews(view: TagView) {
    const { fullPath } = view;
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(fullPath);
      if (index > -1) {
        cachedViews.value = cachedViews.value.slice(index, index + 1);
      } else {
        // if index = -1, there is no cached tags
        cachedViews.value = [];
      }
      resolve([...cachedViews.value]);
    });
  }

  function updateVisitedView(view: TagView) {
    for (const v of visitedViews.value) {
      if (v.path === view.path) {
        Object.assign(v, view);
        break;
      }
    }
  }

  /**
   * 根據路徑更新標籤名稱
   * @param fullPath 路徑
   * @param title 標籤名稱
   */
  function updateTagName(fullPath: string, title: string) {
    const tag = visitedViews.value.find((tag: TagView) => tag.fullPath === fullPath);

    if (tag) {
      tag.title = title;
    }
  }

  function addView(view: TagView) {
    addVisitedView(view);
    addCachedView(view);
  }

  function delView(view: TagView): Promise<TagsViewResult> {
    return new Promise((resolve) => {
      delVisitedView(view);
      delCachedView(view);
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delOtherViews(view: TagView): Promise<TagsViewResult> {
    return new Promise((resolve) => {
      delOtherVisitedViews(view);
      delOtherCachedViews(view);
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delLeftViews(view: TagView): Promise<DirectionalTagsViewResult> {
    return new Promise((resolve) => {
      const currIndex = visitedViews.value.findIndex((v) => v.path === view.path);
      if (currIndex === -1) {
        resolve({
          visitedViews: [...visitedViews.value],
        });
        return;
      }
      visitedViews.value = visitedViews.value.filter((item, index) => {
        if (index >= currIndex || item?.affix) {
          return true;
        }

        const cacheIndex = cachedViews.value.indexOf(item.fullPath);
        if (cacheIndex > -1) {
          cachedViews.value.splice(cacheIndex, 1);
        }
        return false;
      });
      resolve({
        visitedViews: [...visitedViews.value],
      });
    });
  }

  function delRightViews(view: TagView): Promise<DirectionalTagsViewResult> {
    return new Promise((resolve) => {
      const currIndex = visitedViews.value.findIndex((v) => v.path === view.path);
      if (currIndex === -1) {
        resolve({
          visitedViews: [...visitedViews.value],
        });
        return;
      }
      visitedViews.value = visitedViews.value.filter((item, index) => {
        if (index <= currIndex || item?.affix) {
          return true;
        }
        const cacheIndex = cachedViews.value.indexOf(item.fullPath);
        if (cacheIndex > -1) {
          cachedViews.value.splice(cacheIndex, 1);
        }
        return false;
      });
      resolve({
        visitedViews: [...visitedViews.value],
      });
    });
  }

  function delAllViews(): Promise<TagsViewResult> {
    return new Promise((resolve) => {
      const affixTags = visitedViews.value.filter((tag) => tag?.affix);
      visitedViews.value = affixTags;
      cachedViews.value = [];
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delAllVisitedViews() {
    return new Promise((resolve) => {
      const affixTags = visitedViews.value.filter((tag) => tag?.affix);
      visitedViews.value = affixTags;
      resolve([...visitedViews.value]);
    });
  }

  function delAllCachedViews() {
    return new Promise((resolve) => {
      cachedViews.value = [];
      resolve([...cachedViews.value]);
    });
  }

  /**
   * 關閉當前tagView
   */
  function closeCurrentView() {
    const tags: TagView = {
      name: route.name as string,
      title: route.meta.title as string,
      path: route.path,
      fullPath: route.fullPath,
      icon: route.meta?.icon as string | undefined,
      affix: route.meta?.affix,
      keepAlive: route.meta?.keepAlive,
      query: route.query,
    };
    delView(tags).then((res) => {
      if (isActive(tags)) {
        toLastView(res.visitedViews, tags);
      }
    });
  }

  function isActive(tag: TagView) {
    return tag.path === route.path;
  }

  function toLastView(visitedViews: TagView[], view?: TagView) {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView && latestView.fullPath) {
      router.push(latestView.fullPath);
    } else {
      if (view?.name === "Dashboard") {
        // to reload home page
        router.replace("/redirect" + view.fullPath);
      } else {
        router.push("/");
      }
    }
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOtherVisitedViews,
    delOtherCachedViews,
    updateVisitedView,
    addView,
    delView,
    delOtherViews,
    delLeftViews,
    delRightViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    closeCurrentView,
    isActive,
    toLastView,
    updateTagName,
  };
});
