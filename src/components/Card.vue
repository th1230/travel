<script>
import { ref } from "vue";
export default {
  props: ["data"],
  setup(props) {
    const isOpen = ref(true);
    const data = props.data;

    if (data.images.length == 0) {
      isOpen.value = false;
    }

    return { data, isOpen };
  },
};
</script>
<template>
  <div class="card">
    <!-- <img :src="data.images[0].src" alt="" /> -->
    <div
      v-if="isOpen"
      class="bg"
      :style="{ backgroundImage: 'url(' + data.images[0].src + ')' }"
    ></div>

    <div v-if="!isOpen" class="bg noImg"></div>
    <div class="text">
      <h1>{{ data.name }}</h1>
      <p></p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  width: 20%;
  height: 400px;
  margin-bottom: 30px;
  border: 1px solid #000;
  border-radius: 8px;
  overflow: hidden;
  .bg {
    width: 100%;
    height: 50%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    background-color: rgb(179, 179, 179);
  }

  .text {
    height: 50%;
    h1 {
      font-size: 25px;
      margin-left: 5%;
    }
  }
}
</style>
