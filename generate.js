const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
    const data = await response.json();
    res.status(200).json({ email: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate email' });
  }
};