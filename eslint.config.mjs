import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    // 您可以在这里添加规则的覆盖设置
    rules: {
      // 关闭对单一词组件名称的检查
      'vue/multi-word-component-names': 'off',
    },
  },
]
