<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import Card from "@/components/Card.vue";
import Button from "@/components/Button.vue";

export default {
  components: {
    Card,
    Button,
  },
  setup() {
    const store = useStore();
    const Data = reactive({ data: [] });
    const totalCount = ref(0);
    const onePageCount = ref(0);
    const displayPageNum = ref(10);

    onMounted(() => {
      store.dispatch("getApiData", 1).then((res) => {
        Data.data = res;
        totalCount.value = store.state.totalCount;
        onePageCount.value = Math.round(store.state.totalNum / 20) - 1;

        let allButton = document.querySelector(".button");
        allButton.classList.add("active");

        for (let i = 2; i < totalCount.value; i++) {
          store.dispatch("loadOtherApiData", i);
        }
      });
    });

    function handClick(num, e) {
      Data.data = store.getters.getData(num);
      let allButton = document.querySelectorAll(".button");
      allButton.forEach((item) => item.classList.remove("active"));
      e.target.classList.add("active");
    }

    return { Data, onePageCount, handClick, displayPageNum };
  },
};
</script>
<template>
  <div class="home">
    <div class="cards">
      <Card v-for="item in Data.data" :key="item.id" :data="item" />
    </div>

    <div class="buttons">
      <Button
        v-for="item in displayPageNum"
        @click="handClick(item, $event)"
        :key="item"
        :num="item"
      />
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
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
  }

  .buttons {
    display: flex;
    margin: auto;
    width: 500px;
    height: 100px;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
