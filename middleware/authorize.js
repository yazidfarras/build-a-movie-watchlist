export function authorizeModification(req, res, next) {
  const { role, id: userId } = req.user;
  const targetUserId = req.params.userId;

  // Parent bebas mengubah milik siapa saja
  if (role === 'parent') {
    return next();
  }

  // Child HANYA boleh mengubah miliknya sendiri
  if (role === 'child' && String(userId) === String(targetUserId)) {
    return next();
  }

  // Jika tidak memenuhi syarat di atas, tolak akses
  return res.status(403).json({ error: "Access denied" });
}
