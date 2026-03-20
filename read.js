const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { email, id } = req.query;
  if (!email || !id) return res.status(400).json({ error: 'Missing parameters' });

  const [login, domain] = email.split('@');
  try {
    const response = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read message' });
  }
};