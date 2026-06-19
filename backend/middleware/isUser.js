export const isUser = (req, res, next) => {
  console.log(req.role)
  if (req.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "Access denied. User only."
    });
  }
  next();
};