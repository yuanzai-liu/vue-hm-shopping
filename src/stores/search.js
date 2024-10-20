import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('hm_history_list',
  () => {
    const history = ref(['手机', '电脑', '白酒', '平板', '笔记本'])
    const setHistoryList = () => {
      history.value =[]
    }
    return{
      history,
      setHistoryList
    }
  },{
    persist: true
  }
)