


export const ensureAuthenticated = async function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'You must be authenticated' });
  }

  next();
};


