<script>
import { onMounted, watch, reactive, ref } from "vue";
import { useStore } from "vuex";
import Card from "@/components/Card.vue";
import Button from "@/components/Button.vue";
import ChangePageBtn from "@/components/ChangePageBtn.vue";

export default {
  components: {
    Card,
    Button,
    ChangePageBtn,
  },
  setup() {
    const store = useStore();
    const Data = reactive({ data: [] });
    const totalDataCount = ref(0);
    const totalPageCount = ref(0);

    let currentPage = ref(1);
    let currentActive = ref(1);
    let stuffCount = ref(0);

    onMounted(() => {
      store.dispatch("getApiData", { index: 1, id: null }).then((res) => {
        Data.data = res;
        totalDataCount.value = store.state.totalCount;
        totalPageCount.value = Math.ceil(store.state.viewPoints.length / 20);

        let allButton = document.querySelector(".button");
        allButton.classList.add("active");
        loadOtherData();
      });
    });

    watch(
      () => store.state.currentData,
      async (newValue, oldValue) => {
        Data.data = store.getters.getCurrentData;
        totalDataCount.value = store.state.totalCount;

        if (store.state.viewPoints.length <= 20) {
          totalPageCount.value = 1;
        } else {
          totalPageCount.value = Math.ceil(store.state.viewPoints.length / 20);
        }

        let currentId = await getId();

        currentPage.value = 1;
        currentActive.value = 1;
        stuffCount.value = 0;

        await loadOtherData(currentId);
      },
      { deep: true }
    );

    watch(
      () => store.state.viewPoints,
      (newValue, oldValue) => {
        if (store.state.totalNum <= 20) {
          totalPageCount.value = 1;
        } else {
          totalPageCount.value = Math.ceil(store.state.viewPoints.length / 20);
          console.log(totalPageCount.value);
        }
      }
    );

    function loadOtherData(id = null) {
      for (let index = 1; index < totalDataCount.value + 1; index++) {
        store.dispatch("loadOtherApiData", { index, id });
      }
    }

    function getId() {
      return store.state.currentId;
    }

    function checkCount() {
      if (currentPage.value - 5 <= 0) {
        stuffCount.value = currentPage.value - 2;
      } else {
        stuffCount.value = 0;
      }

      if (currentPage.value + 4 >= totalPageCount.value) {
        stuffCount.value = 4 - (totalPageCount.value - currentPage.value);
      } else {
        stuffCount.value = 0;
      }
    }

    function handClick(num, e) {
      Data.data = store.getters.getData(num);

      currentPage.value = num;
      checkCount();
    }

    function addActive(num, e) {
      currentActive.value = num;
      handClick(num, e);
    }

    function addPage() {
      if (currentPage.value == totalPageCount.value) {
        console.log("最後一頁");
        return;
      }

      checkCount();

      currentPage.value++;
      Data.data = store.getters.getData(currentPage.value);
      currentActive.value++;
    }

    function reducePage() {
      if (currentPage.value == 1) {
        console.log("第一頁");
        return;
      }

      checkCount();

      currentPage.value--;
      Data.data = store.getters.getData(currentPage.value);
      currentActive.value--;
    }

    return {
      Data,
      handClick,
      addActive,
      currentPage,
      currentActive,
      stuffCount,
      addPage,
      reducePage,
      totalPageCount,
    };
  },
};
</script>
<template>
  <div class="home">
    <div class="cards">
      <Card v-for="item in Data.data" :key="item.id" :data="item" />
    </div>

    <div class="page-bar">
      <div class="prev-blk">
        <ChangePageBtn @click="addActive(1, $event)">&laquo;</ChangePageBtn>
        <ChangePageBtn @click="reducePage">&#8249;</ChangePageBtn>
      </div>
      <Button
        v-for="item in 5"
        @click="addActive(item - stuffCount + currentPage - 1, $event)"
        :class="{
          active: currentActive == item - stuffCount + currentPage - 1,
        }"
        :key="item - stuffCount + currentPage - 1"
        :num="item - stuffCount + currentPage - 1"
        v-show="
          !(item - stuffCount + currentPage - 1 > totalPageCount) &&
            !(item - stuffCount + currentPage - 1 < 1)
        "
      />
      <div class="next-blk">
        <ChangePageBtn @click="addPage">&#8250;</ChangePageBtn>
        <ChangePageBtn @click="addActive(totalPageCount, $event)"
          >&raquo;</ChangePageBtn
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.home {
  width: 100%;
  .cards {
    width: 100%;
    padding: 10%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
  }

  .page-bar {
    display: flex;
    width: 100%;
    height: 100px;
    align-items: center;
    justify-content: center;
  }
  .prev-blk,
  .next-blk {
    display: flex;
    margin: 0 5px;
  }
}
</style>
