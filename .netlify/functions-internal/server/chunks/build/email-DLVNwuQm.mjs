function normalizeEmail(email) {
  if (!email) return null;
  return email.toLowerCase().trim() || null;
}
function compareEmails(email1, email2) {
  const normalized1 = normalizeEmail(email1);
  const normalized2 = normalizeEmail(email2);
  if (!normalized1 || !normalized2) return false;
  return normalized1 === normalized2;
}

export { compareEmails as c };
//# sourceMappingURL=email-DLVNwuQm.mjs.map
