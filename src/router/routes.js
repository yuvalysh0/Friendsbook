
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: '/addPicture', component: () => import('pages/Camera.vue') },
      { path: '/auth', component: () => import('pages/Auth.vue') },
      { path: '/profile', component: () => import('pages/Profile.vue') },
      { path: '/profile/help', component: () => import('pages/Help.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
