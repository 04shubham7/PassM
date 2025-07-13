const Password = require('../models/Password');
const { encrypt, decrypt } = require('../utils/encryption');

// Create password entry
exports.createPassword = async (req, res) => {
  try {
    const { title, username, password } = req.body;
    const encryptedPassword = encrypt(password);
    const entry = new Password({
      user: req.user.userId,
      title,
      username,
      password: encryptedPassword,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all passwords for user
exports.getPasswords = async (req, res) => {
  try {
    const entries = await Password.find({ user: req.user.userId });
    // Do not decrypt here; only decrypt on single password view after 2FA
    res.json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get single password (for 2FA flow)
exports.getPassword = async (req, res) => {
  try {
    const entry = await Password.findOne({ _id: req.params.id, user: req.user.userId });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    if (!req.user.twofaVerified) {
      // Only return metadata, not the password value
      const { _id, title, username, createdAt, updatedAt } = entry;
      return res.json({ _id, title, username, createdAt, updatedAt, twofaRequired: true });
    }
    // Decrypt password for viewing
    const decryptedPassword = decrypt(entry.password);
    res.json({ ...entry.toObject(), password: decryptedPassword });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update password entry
exports.updatePassword = async (req, res) => {
  if (!req.user.twofaVerified) {
    return res.status(401).json({ error: '2FA required' });
  }
  try {
    const { title, username, password } = req.body;
    const update = { title, username };
    if (password) update.password = encrypt(password);
    const entry = await Password.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      update,
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete password entry
exports.deletePassword = async (req, res) => {
  if (!req.user.twofaVerified) {
    return res.status(401).json({ error: '2FA required' });
  }
  try {
    const entry = await Password.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 