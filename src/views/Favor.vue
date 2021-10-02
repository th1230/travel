<script>
import { onBeforeMount, reactive, ref } from "vue";
import initIndexedDB from "@/indexDB/openDB.js";

export default {
  setup() {
    const write = ref(true);
    const havedata = ref(false);

    const data = reactive({ val: [] });
    let { openDB, addObject, getObject, updateObject } = initIndexedDB();
    onBeforeMount(() => {
      getObject("travelDataStore", 0).then((res) => {
        if (res.arr.length != 0) {
          for (let i = 0; i < res.arr.length; i++) {
            data.val.push({
              id: res.arr[i].id,
              data: JSON.parse(res.arr[i].data),
            });

            data.val[i].data.tel = data.val[i].data.tel.split("-")[2];
          }
          havedata.value = true;
        }
      });
    });

    function changeCanORCantInput() {
      write.value = !write.value;
    }

    function deleteFavor(item) {
      console.log(item.data);
      updateObject("travelDataStore", {
        id: 0,
        arr: [
          {
            id: parseInt(item.id),
            data: JSON.stringify({}),
          },
        ],
      }).then((res) => {
        data.val.splice(0, data.val.length);
        getObject("travelDataStore", 0).then((res) => {
          if (res.arr.length != 0) {
            for (let i = 0; i < res.arr.length; i++) {
              data.val.push({
                id: res.arr[i].id,
                data: JSON.parse(res.arr[i].data),
              });
            }
            havedata.value = true;
          }
        });
      });
    }

    function sendFavorEdit(item) {
      getObject("travelDataStore", 0).then((res) => {
        updateObject("travelDataStore", {
          id: 0,
          arr: [
            {
              id: parseInt(item.id),
              data: JSON.stringify({}),
            },
          ],
        }).then((res) => {
          let input = document.querySelectorAll(`#${item.data.name}`);
          console.log(input);
          let name = input[0].value;
          let tel = input[1].value;

          updateObject("travelDataStore", {
            id: 0,
            arr: [
              {
                id: parseInt(item.id),
                data: JSON.stringify({
                  name: name,
                  img: item.data.img,
                  tel: tel,
                }),
              },
            ],
          }).then((res) => {
            data.val.splice(0, data.val.length);
            getObject("travelDataStore", 0).then((res) => {
              if (res.arr.length != 0) {
                for (let i = 0; i < res.arr.length; i++) {
                  data.val.push({
                    id: res.arr[i].id,
                    data: JSON.parse(res.arr[i].data),
                  });
                }
                havedata.value = true;
              }
            });
          });
        });
      });
    }

    return {
      data,
      changeCanORCantInput,
      write,
      deleteFavor,
      havedata,
      sendFavorEdit,
    };
  },
};
</script>

<template>
  <div class="about">
    <div class="block">目前收藏</div>
    <div class="cards" v-if="havedata">
      <div class="card" v-for="item in data.val" :key="item.id">
        <form action="">
          <img :src="item.data.img" alt="" />
          <input
            type="text"
            :value="item.data.name"
            :disabled="write"
            :class="{ modify: write }"
            :id="`${item.data.name}`"
          />
          <input
            type="tel"
            :value="`${item.data.tel}`"
            :disabled="write"
            :class="{ modify: write }"
            :id="`${item.data.name}`"
          />
          <button class="edit" @click.prevent="changeCanORCantInput">
            修改
          </button>
          <button class="remove" @click.prevent="deleteFavor(item)">
            刪除
          </button>
          <button class="update" @click.prevent="sendFavorEdit(item)">
            送出
          </button>
        </form>
      </div>
    </div>

    <div class="text" v-if="!havedata">
      <h1>目前沒有加入收藏</h1>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.about {
  width: 100%;
  padding: 5%;
  box-sizing: border-box;
  height: 100%;
  .block {
    background-color: #14c288;
    height: 70px;
    border-radius: 5px;
    padding: 0.5%;
    font-size: 3rem;
    font-weight: 700;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #006342;
  }

  .cards {
    width: 100%;
    padding: 3% 2%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    box-sizing: border-box;

    .card {
      border-bottom: 2px solid #095257a6;
      form {
        min-width: 90%;
        background-color: #fff;
        margin: 2% 0;
        transition: 0.5s;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        img {
          height: 300px;
          width: 300px;
          object-fit: cover;
          clip-path: polygon(0% 20%, 60% 20%, 100% 50%, 60% 80%, 0% 80%);

          border-radius: 50% 0% 0% 50%;
        }

        input {
          all: unset;
          border: 3px solid #1ab5c0;
          padding: 20px;
          margin: 0 5px;
          font-size: 1.5rem;
          color: #04a7b3;
          font-weight: 600;
          &:focus {
            background-color: #2f9ba383;
            border: 3px solid #1aedfca6;
            color: white;
          }

          &.modify {
            color: #04a7b38f;
            border: 3px solid rgba(95, 95, 95, 0.274);
          }
        }

        button {
          all: unset;
          border: 3px solid rgba(95, 95, 95, 0.274);
          padding: 20px;
          margin: 0 5px;
          font-size: 1.5rem;
          color: white;
          cursor: pointer;
          background-color: #009faa;
          font-weight: 600;
          transition: box-shadow 0.3s;
          &:hover {
            transition: box-shadow 0.3s;
            box-shadow: 0px 5px 3px 3px #85858544, 0px 0px 3px 3px #00000050;
          }

          &:active {
            box-shadow: none;
            color: #68f7cc;
          }

          &.remove {
            background-color: rgb(255, 230, 0);
          }

          &.remove:active {
            color: #df9801;
          }

          &.update {
            background-color: #f88191;
          }

          &.update:active {
            color: #b60101;
          }
        }
      }
    }
  }

  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 2rem;
    background-color: #80dfbf98;
  }
}
</style>
