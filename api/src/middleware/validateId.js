export default function validateId(req, res, next, id) {
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }
  next();
}