<script>
import { ref } from "vue";
import { useStore } from "vuex";
import initIndexedDB from "@/indexDB/openDB.js";

export default {
  props: ["data"],
  setup(props) {
    const isOpen = ref(true);
    const data = props.data;
    const store = useStore();
    if (data.images.length == 0) {
      isOpen.value = false;
    }

    async function handClick(data) {
      await store.dispatch("setDetailCurrentData", data);
      let { openDB, addObject } = initIndexedDB();

      let filterData = {};

      for (let i in data) {
        if (!Array.isArray(data[i]) && i != "id") {
          filterData[i] = data[i];
        }
      }
      let Intid = parseInt(data["id"]);

      filterData["category"] = JSON.parse(JSON.stringify({ ...data.category }));
      filterData["images"] = JSON.parse(JSON.stringify({ ...data.images }));
      filterData["service"] = JSON.parse(JSON.stringify({ ...data.service }));
      filterData["target"] = JSON.parse(JSON.stringify({ ...data.target }));

      addObject("travelDataStore", {
        id: Intid,
        ...filterData,
      });
    }

    return { data, isOpen, handClick };
  },
};
</script>
<template>
  <div class="card">
    <!-- <img :src="data.images[0].src" alt="" /> -->

    <router-link :to="`/detail/${data.id}`" @click="handClick(data)">
      <div
        v-if="isOpen"
        class="bg"
        :style="{ backgroundImage: 'url(' + data.images[0].src + ')' }"
      ></div>
    </router-link>

    <div v-if="!isOpen" class="bg noImg"></div>
    <div class="text">
      <h1>{{ data.name }}</h1>
      <p></p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  height: 400px;
  margin-bottom: 30px;
  border: 2px solid rgba(128, 128, 128, 0.452);
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
  margin-right: 5%;
  flex-basis: 20%;
  transition: 0.3s;
  cursor: pointer;
  box-shadow: 0px 0px 3px 5px rgba(68, 66, 66, 0.11),
    0px 0px 5px 10px rgba(128, 128, 128, 0.137);
  &:hover {
    transform: perspective(300px) translateZ(10px);
    box-shadow: 0px 0px 20px 30px rgba(128, 128, 128, 0.137);
  }

  .bg {
    width: 100%;
    height: 50%;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    position: relative;
    background-color: rgb(179, 179, 179);
  }

  .text {
    height: 50%;
    h1 {
      font-size: 20px;
      margin-left: 5%;
    }
  }
}
</style>
