<script>
export default {};
</script>

<template>
  <transition name="fade">
    <div class="categoryitem">
      <slot></slot>
    </div>
  </transition>
</template>

<style lang="scss">
.categoryitem {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  transition: 0.5s;
  border: 0px solid #90f8ff;
  box-shadow: 0px 3px 5px 5px #90f8ff3a;
  background: #177279;
  color: white;

  h1 {
    font-size: 1.5rem;
    pointer-events: none;
  }
  img {
    pointer-events: none;
  }

  &:hover {
    background-color: #01aebb;
    border: 5px solid #90f8ff;
    color: white;
  }
  &:active {
    background-color: #2cb0b9;
  }
}
</style>
