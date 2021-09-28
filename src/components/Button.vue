<script>
export default {
  props: ["num"],
  setup(props) {
    const n = props.num;

    return { n };
  },
};
</script>
<template>
  <div class="button">{{ n }}</div>
</template>
<style lang="scss">
.button {
  min-width: 40px;
  min-height: 40px;
  background-color: #757575;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  &.active {
    background-color: #0079b7;
  }
}
</style>
