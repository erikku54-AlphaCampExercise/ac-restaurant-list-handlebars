
// 將用戶狀態檢查做成中介軟體型態，安插在路由中
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('warning_msg', '請先登入才能使用！');
  res.redirect('/users/login');
}
