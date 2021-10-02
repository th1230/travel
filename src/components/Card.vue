<script>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import initIndexedDB from "@/indexDB/openDB.js";

export default {
  props: ["data"],
  setup(props) {
    let { openDB, addObject, getObject, updateObject } = initIndexedDB();
    const isOpen = ref(true);
    const data = props.data;
    const store = useStore();
    const islike = ref(false);

    onMounted(() => {
      getObject("travelDataStore", 0).then((res) => {
        if (res) {
          for (let i = 0; i < res.arr.length; i++) {
            if (res.arr[i].id == data.id) {
              islike.value = true;
            }
          }
        }
      });
    });

    if (data.images.length == 0) {
      isOpen.value = false;
    }

    async function handClick(data) {
      await store.dispatch("setDetailCurrentData", data);

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

      getObject("travelDataStore", Intid).then((res) => {
        if (!res) {
          addObject("travelDataStore", {
            id: Intid,
            ...filterData,
          });
        } else {
          console.log("有資料");
        }
      });
    }

    function handLike() {
      islike.value = !islike.value;

      getObject("travelDataStore", 0).then((res) => {
        if (!res) {
          addObject("travelDataStore", {
            id: 0,
            arr: [
              {
                id: parseInt(data.id),
                data: JSON.stringify({
                  name: data.name,
                  img: data.images[0].src,
                  tel: data.tel,
                }),
              },
            ],
          });
        } else {
          console.log("有資料");

          updateObject("travelDataStore", {
            id: 0,
            arr: [
              {
                id: parseInt(data.id),
                data: JSON.stringify({
                  name: data.name,
                  img: data.images[0].src,
                  tel: data.tel,
                }),
              },
            ],
          });
        }
      });
    }

    return { data, isOpen, handClick, handLike, islike };
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

    <button class="star" @click="handLike">
      <img v-show="islike" src="@/assets/star.png" alt="" />
      <img v-show="!islike" src="@/assets/star_close.png" alt="" />
    </button>
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

  position: relative;
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

  button {
    position: absolute;
    bottom: 0;
    right: 0;
    img {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
