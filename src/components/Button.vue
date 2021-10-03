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
  background-color: #757575c4;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  margin: 0 3px;
  box-shadow: 0px 0px 5px rgba(102, 102, 102, 0.452);
  transition: 0.3s;
  &.active {
    background-color: #0079b7;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 3px 2px rgba(102, 102, 102, 0.452);
  }
}

@media screen and(max-width: 376px) {
  .button {
    min-width: 30px;
    min-height: 30px;
  }
}
</style>
