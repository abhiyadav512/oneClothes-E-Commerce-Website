const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    // console.log(error);
    res.status(400).json({
      success: false,
      errors: `erro form valid :${error.errors.map((e) => e.message)}`,
    });
  }
};

module.exports = { validate };
