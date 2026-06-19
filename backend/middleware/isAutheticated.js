import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    console.log("this is middleware ", token)
    if (!token) {
      return res.status(401).json({
        message: "You are not authenticated",
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.id = decoded.id;
    req.role = decoded.role;
    console.log(req.id);
    next();

  } catch (error) {
    console.log("is autheticated error ", error)
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false
    });
  }
};
