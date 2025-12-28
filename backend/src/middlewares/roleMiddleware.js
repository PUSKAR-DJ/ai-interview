export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin only." });
  }
};

export const isHR = (req, res, next) => {
  if (req.user && (req.user.role === "hr" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ error: "Access denied. HR only." });
  }
};

export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Students only." });
  }
};