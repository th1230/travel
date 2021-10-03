<script>
import { reactive, ref, onBeforeMount, watch, onUpdated, onMounted } from "vue";
import { useStore } from "vuex";
import initIndexedDB from "@/indexDB/openDB.js";
import { useRoute } from "vue-router";

export default {
  setup() {
    const store = useStore();
    let data = reactive({ md: [] });
    const isOpen = ref(false);
    const haveData = ref(false);
    const { getObject } = initIndexedDB();
    const route = useRoute();

    let intro = reactive({ text: [] });

    window.onload = () => {
      let id = parseInt(route.params.id);
      getObject("travelDataStore", id).then((res) => {
        data.md = res;
        console.log(data.md);
        haveData.value = true;
        textSet();
      });
    };

    watch(
      () => store.state.detailCurrentData,
      (newValue) => {
        if (newValue.length != 0) {
          console.log(newValue);
          data.md = newValue;
          haveData.value = true;
          textSet();
        } else {
          haveData.value = false;
        }
      },
      { immediate: true }
    );

    function textSet() {
      intro.text = data.md.introduction.split("。");
      intro.text.forEach((item) => item + "。");
    }

    function handClick() {
      isOpen.value = !isOpen.value;
    }

    return { data, isOpen, handClick, haveData, intro };
  },
};
</script>
<template>
  <div class="detail" v-if="haveData">
    <div class="main">
      <div class="title">
        <h1>{{ data.md.name }}</h1>
      </div>

      <div class="image">
        <img :src="data.md.images[0].src" alt="" />
      </div>

      <div :class="['intro', { displayAll: isOpen }]">
        <h1>簡介:</h1>

        <div v-if="intro != []">
          <p v-for="text in intro.text" :key="text" v-html="text"></p>
        </div>
      </div>

      <button @click="handClick">
        <p v-if="!isOpen">展開</p>
        <p v-if="isOpen">收合</p>
      </button>
    </div>

    <div class="aside">
      <div class="contact">
        <h1>相關資料</h1>
        <div class="text">
          <h1>Address:</h1>
          <p>{{ data.md.address }}</p>
        </div>

        <div class="text">
          <h1>Email:</h1>
          <p>{{ data.md.email }}</p>
        </div>

        <div class="text">
          <h1>FaceBook:</h1>
          <a :href="data.md.facebook">{{ data.md.facebook }}</a>
        </div>

        <div class="text">
          <h1>telephone:</h1>
          <p>{{ data.tel }}</p>
        </div>
      </div>

      <div class="tags">
        <div class="tag" v-for="tag in data.md.category" :key="tag">
          <p>{{ tag.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.detail {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  box-sizing: border-box;
  background-color: #f7f7f7;
  padding: 5% 0%;

  .main {
    padding: 2% 2.5%;
    background-color: #fff;
    box-shadow: 0px 0px 5px 5px rgba(156, 156, 156, 0.308);
    width: 50%;
    .image {
      img {
        width: 100%;
      }
    }

    .intro {
      overflow: hidden;
      height: 300px;
      position: relative;
      &.displayAll {
        height: auto;
      }
      h1 {
        font-size: 1.8rem;
      }
      &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 10%;
        background-image: linear-gradient(
          0deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 255, 255, 0.3) 100%
        );
        bottom: 0;
      }
    }

    button {
      border: none;
      width: 100px;
      height: 50px;
      margin: 0;
      padding: 0;
      background-color: rgba(0, 0, 0, 0);
      cursor: pointer;
      border: 1px solid #01afbb5b;
      position: relative;
      z-index: 10;
      margin-top: 10px;
      color: #01afbbd8;

      overflow: hidden;

      &:before {
        content: "";
        background-color: #01aebb;
        width: 0;
        height: 120%;
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-10%, -10%);
        z-index: -1;
        transition: 0.5s;
      }

      &:hover:before {
        width: 120%;
      }
      p {
        padding: 0;
        margin: 0;
        font-weight: 600;
        font-size: 1.2em;
        letter-spacing: 0.5rem;
        text-align: center;
        display: inline-block;
        width: 100%;
      }

      &:hover p {
        color: white;
      }
    }
  }
  .aside {
    width: 30%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 2% 2.5%;
    box-shadow: 0px 0px 5px 5px rgba(156, 156, 156, 0.308);
    .contact {
      .text {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        h1 {
          font-size: 1rem;
          padding: 0;
          margin: 0;
          display: inline-block;
        }
        p,
        a {
          color: black;
          font-weight: 600;
          text-decoration: none;
          margin: 0;
          margin-left: 5px;
          padding: 0;
          font-size: 0.8rem;
          vertical-align: top;
          display: inline-block;
        }
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-top: 5%;
      .tag {
        min-width: 30%;
        text-align: center;
        background-color: #01afbbd8;

        margin-right: 5%;
        margin-bottom: 10px;
        padding: 0 5%;
        p {
          font-weight: 600;
          color: white;
          letter-spacing: 0.2rem;
        }
      }
    }
  }
}

@media screen and(max-width: 1024px) {
  .detail {
    flex-direction: column;
    align-items: center;
    .main {
      width: 70%;
    }
    .aside {
      margin: 5% 0;
      width: 70%;
    }
  }
}
</style>
