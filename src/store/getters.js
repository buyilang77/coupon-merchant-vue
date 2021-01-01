const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  access_token: state => state.user.access_token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
