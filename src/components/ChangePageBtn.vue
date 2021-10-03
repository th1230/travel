<script>
export default {
  setup() {
    return {};
  },
};
</script>
<template>
  <div class="changepagebtn">
    <slot></slot>
  </div>
</template>
<style lang="scss">
.changepagebtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  font-size: 30px;
  font-weight: 600;
  border: 1px solid #00679ba4;
  margin-right: 5px;
  border-radius: 5px;
  color: #0079b7;
  transition: 0.3s;
  box-shadow: 0px 0px 5px #01466988;
  cursor: pointer;
  &:hover {
    background-color: #1289c5;
    color: white;
    transform: scale(1.05);
    box-shadow: 0px 3px 2px #01466988;
  }
}

@media screen and(max-width: 376px) {
  .changepagebtn {
    width: 35px;
    height: 35px;
  }
}
</style>
