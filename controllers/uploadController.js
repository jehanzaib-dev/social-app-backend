export const uploadImage = (req, res) => {
  try {
    res.status(200).json({
      filename: req.file.filename,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};