<script>
import { onBeforeMount, reactive, ref } from "vue";
import initIndexedDB from "@/indexDB/openDB.js";
import { Field, Form, ErrorMessage } from "vee-validate";

export default {
  components: {
    Field,
    Form,
    ErrorMessage,
  },
  setup() {
    const write = ref(true);
    const havedata = ref(false);
    const sendDataError = ref(true);

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
          }
          havedata.value = true;
        }
      });
    });

    function changeCanORCantInput() {
      write.value = !write.value;
    }

    function deleteFavor(item) {
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

    function sendFavorEdit(item, uid) {
      if (sendDataError.value) {
        let InputItem = data.val[uid].data;
        console.log(data.val);
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
            let name = InputItem.name;
            let tel = InputItem.tel;
            let img = InputItem.img;

            updateObject("travelDataStore", {
              id: 0,
              arr: [
                {
                  id: parseInt(item.id),
                  data: JSON.stringify({
                    name,
                    img,
                    tel,
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
      } else {
        alert("輸入錯誤請修改內容");
      }
    }

    function nameValidate(value) {
      if (value.length == 0) {
        sendDataError.value = false;
        return "不可為空";
      } else if (value.length > 20) {
        sendDataError.value = false;
        return "名稱過長";
      } else if (typeof value !== "string") {
        sendDataError.value = false;
        return "名稱必須為字串";
      } else {
        sendDataError.value = true;
        return "";
      }
    }

    function telValidate(value) {
      if (value.length == 0) {
        sendDataError.value = false;
        return "不可為空";
      } else if (typeof parseInt(value) !== "number") {
        sendDataError.value = false;
        return "名稱必須為數字";
      } else if (
        !value.match(
          /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm
        )
      ) {
        sendDataError.value = false;
        return "格式錯誤";
      } else {
        sendDataError.value = true;
        return "";
      }
    }

    return {
      data,
      changeCanORCantInput,
      write,
      deleteFavor,
      havedata,
      sendFavorEdit,
      nameValidate,
      telValidate,
    };
  },
};
</script>

<template>
  <div class="about">
    <div class="block">目前收藏</div>
    <div class="cards" v-if="havedata">
      <div class="card" v-for="(item, uid) in data.val" :key="item.id">
        <img :src="item.data.img" alt="" />
        <Form>
          <div class="inputBox">
            <label for="">名稱:</label>
            <Field
              type="text"
              v-model="item.data.name"
              :disabled="write"
              :class="{ modify: write }"
              name="field"
              :rules="nameValidate"
            />
            <ErrorMessage name="field" />
          </div>
          <div class="inputBox">
            <label for="">電話:</label>
            <Field
              type="tel"
              v-model="item.data.tel"
              :disabled="write"
              :class="{ modify: write }"
              name="tel"
              :rules="telValidate"
            />
            <ErrorMessage name="tel" />
          </div>
        </Form>

        <div class="btns">
          <button class="edit" @click.prevent="changeCanORCantInput">
            修改
          </button>
          <button class="remove" @click.prevent="deleteFavor(item)">
            刪除
          </button>
          <button class="update" @click="sendFavorEdit(item, uid)">
            送出
          </button>
        </div>
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
    background-color: #b3ecd9;

    .card {
      width: 70%;
      box-sizing: border-box;
      border-bottom: 2px solid #095257a6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        height: 40%;
        width: 70%;
        object-fit: cover;
        border-radius: 5px;
      }
      form {
        padding: 10px 0;
        flex-direction: column;
        width: 100%;
        background-color: #2ddaa0;
        margin: 2% 0;
        transition: 0.5s;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-radius: 5px;

        .inputBox {
          width: 90%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          label {
            color: #006342;
            font-size: 1.5em;
            font-weight: 600;
            margin-left: 5px;
          }

          input {
            all: unset;
            width: 40%;
            border-bottom: 1px solid #04a7b381;
            padding: 10px 0;
            margin: 0 10px;

            text-align: left;
            font-size: 1.5em;
            color: #006342;
            font-weight: 600;
            &:focus {
              background-color: #2f9ba383;
              border: 3px solid #1aedfca6;
              color: white;
            }

            &.modify {
              border-bottom: none;
              font-size: 1.8rem;
              color: #04a7b38f;
            }
          }

          span {
            font-size: 1.2rem;
            font-weight: 600;
            color: red;
          }
        }
      }

      .btns {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        button {
          all: unset;
          border: 3px solid rgba(95, 95, 95, 0.274);
          padding: 20px;
          margin: 0 5%;
          margin-bottom: 2%;
          font-size: 1.3rem;
          text-align: center;
          width: 20%;
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

@media screen and (max-width: 1025px) {
  .about {
    .block {
      font-size: 2em;
    }
    .cards {
      .card {
        width: 85%;
        form {
          label {
            font-size: 1.2em;
          }

          input {
            font-size: 1.2em;
            &.modify {
              font-size: 1.5rem;
            }
          }
        }

        .btns {
          button {
            width: 20%;
            padding: 10px;
            font-size: 1em;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .about {
    padding: 4.5%;
    .block {
      font-size: 1.8em;
    }
    .cards {
      .card {
        width: 95%;
        form {
          label {
            font-size: 0.6em;
          }

          input {
            font-size: 0.6em;
            &.modify {
              font-size: 0.9rem;
            }
          }
        }

        .btns {
          button {
            width: 20%;
            padding: 10px;
            font-size: 0.8em;
          }
        }
      }
    }
  }
}
</style>
