export const isStaff = (req, res, next) => {
  if (req.role !== "staff") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Staff only."
    });
  }
  next();
};