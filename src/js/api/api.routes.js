export const apiRoutes = {
  auth: "/api/auth/login",
  currentUser: "/api/users/current",
  order: "/api/order",
  qrCode: '/api/order/get-qrcode',
  bikes: "/api/catalog/:pointId",
  bike: "/api/catalog/bike/:bikeId",
  bikeImage: "/api/catalog/bike/:bikeId/img",
  points: "/api/point",
  point: "/api/point/:pointId",
};
