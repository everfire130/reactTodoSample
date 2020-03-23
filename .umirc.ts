import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/detail/:id', component: '@/pages/itemDetail'}
  ],
});
