<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  addCount:{
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['update:addCount'])
const handleSub = () =>{
  if( props.addCount <= 1) return
  const newCount = props.addCount - 1
  emit('update:addCount', newCount) // 触发更新事件
}
const handleAdd = () =>{
  const newCount = props.addCount + 1
  emit('update:addCount', newCount) // 触发更新事件
}
// 输入框改变事件
const handleChange = (event) => {
  const num = +event.target.value
  // 输入了不合法的文本，回退到原来的数字
  if(isNaN(num) || num < 1 || !(num % 1 ===0)){
    event.target.value = props.addCount
    return
  }
  const newCount = Number(num)
  emit('update:addCount', newCount) // 触发更新事件
}
</script>

<template>
  <div class="count-box">
    <button @click="handleSub" class="minus">-</button>
    <input  @change="handleChange" class="inp" type="text" :value="addCount">
    <button @click="handleAdd" class="add">+</button>
  </div>
</template>

<style lang="less" scoped>
.count-box {
  width: 110px;
  display: flex;
  .add, .minus {
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    background-color: #efefef;
  }
  .inp {
    width: 40px;
    height: 30px;
    outline: none;
    border: none;
    margin: 0 5px;
    background-color: #efefef;
    text-align: center;
  }
}
</style>