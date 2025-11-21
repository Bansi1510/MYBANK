export const isAdminOrStaff = (req, res, next) => {
  if (req.role === "admin" || req.role === "staff") return next();
  return res.status(403).json({ status: false, message: "Access denied" });
};
