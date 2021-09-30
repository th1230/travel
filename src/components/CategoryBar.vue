<script>
import CategoryItem from "@/components/CategoryItem.vue";
import { useStore } from "vuex";
import { ref } from "vue";
export default {
  components: {
    CategoryItem,
  },
  setup() {
    const store = useStore();
    let isOpen = ref(false);
    const data = store.getters.getCateData;

    function handClick() {
      store.dispatch("setCategoryState");
      isOpen.value = store.getters.getCate;
    }

    async function clearData() {
      if (store.getters.getViewPoints.length != 0) {
        store.dispatch("resetViewPoints");
      }
    }

    function reGetApidata(num, id) {
      store.dispatch("getApiData", { index: num, id: id }).then((res) => {
        store.dispatch("setCurrentData", res);
      });
    }

    return { isOpen, handClick, data, reGetApidata, clearData };
  },
};
</script>

<template>
  <div class="categorybar">
    <CategoryItem @click="handClick()">
      <h1>CATEGORY</h1>
    </CategoryItem>
    <router-link to="/" @click="clearData">
      <CategoryItem
        v-show="isOpen"
        v-for="item in data"
        :key="item.id"
        @click="reGetApidata(1, item.id)"
      >
        <h1>{{ item.name }}</h1>
      </CategoryItem>
    </router-link>
  </div>
</template>

<style lang="scss">
.categorybar {
  width: 20%;
  height: 100%;
  position: absolute;
  z-index: 1000;
  right: 0;
  top: 0;
  a {
    text-decoration: none;
  }

  .fade-enter-from {
    opacity: 0;
    height: 0%;
  }

  .fade-enter-to {
    opacity: 1;
    height: 100%;
  }

  .fade-leaver-from {
    opacity: 1;
    height: 100%;
  }

  .fade-leave-to {
    opacity: 0;
    height: 0%;
  }

  .fade-enter-active {
    transition: opacity 0.5s ease, height 0.5s;
  }

  .fade-leave-active {
    transition: opacity 0.5s ease, height 0.5s;
  }
}
</style>
