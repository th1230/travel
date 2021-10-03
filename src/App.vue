<script>
import CategoryBar from "@/components/CategoryBar.vue";
import { useStore } from "vuex";
export default {
  components: {
    CategoryBar,
  },

  setup() {
    const store = useStore();
    async function handClick() {
      await store.dispatch("setCurrentId", null);
      store.dispatch("getApiData", { index: 1, id: null }).then((res) => {
        store.dispatch("setCurrentData", res);
      });
    }
    return { handClick };
  },
};
</script>

<template>
  <div id="nav">
    <div class="links">
      <router-link to="/" @click="handClick">HOME</router-link>
      <router-link to="/Favor">FAVOR</router-link>
    </div>
    <CategoryBar />
  </div>
  <router-view />
</template>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  #nav {
    width: 100%;
    height: 70px;
    background-color: #fff;
    border-bottom: 1px solid #0377805e;
    box-shadow: 0px 2px 3px #0377805e;
    position: relative;
    .links {
      width: 20%;
      height: 100%;
      display: inline-flex;
      justify-content: space-around;
      align-items: center;
      border-collapse: collapse;

      a {
        display: flex;
        width: 50%;
        height: 100%;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        font-size: 1.2rem;
        font-weight: 600;
        color: #01949e;
        transition: 0.2s;
        border-right: 2px solid #b6b6b6;
        &:hover {
          background-color: #01aebb;
          color: white;
          border-right: 2px solid #1aa5af;
        }
      }
    }
  }
}

@media screen and(max-width: 768px) {
  html,
  body {
    #nav {
      height: 40px;
      .links {
        width: 40%;
        a {
          font-size: 0.9rem;
        }
      }
    }
  }
}

@media screen and(max-width: 420px) {
  html,
  body {
    #nav {
      height: 40px;
      .links {
        width: 40%;
        a {
          font-size: 0.2rem;
        }
      }
    }
  }
}
</style>
