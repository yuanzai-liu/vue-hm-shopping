import { createApp } from 'vue'
import 'vant/lib/index.css'
import { Tabbar, TabbarItem, NavBar, 
          Toast, Search, Swipe, SwipeItem, 
          Grid, GridItem, Icon, Dialog, 
          ActionSheet, Checkbox, Tab, Tabs 
        } from 'vant'

const app = createApp()
app.use(Tabbar)
app.use(TabbarItem)
app.use(NavBar)
app.use(Toast)
app.use(Search)
app.use(Swipe)
app.use(SwipeItem)
app.use(Grid)
app.use(GridItem)
app.use(Icon)
app.use(Dialog)
app.use(ActionSheet)
app.use(Checkbox)
app.use(Tab)
app.use(Tabs)
