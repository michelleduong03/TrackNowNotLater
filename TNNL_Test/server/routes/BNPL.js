router.get('/bnpl/:email', async (req, res) => {
  const userEmail = req.params.email;
  try {
    const data = await Payment.find({ userEmail });
    res.json(data);
  } catch (err) {
    console.error('Failed to fetch BNPL data:', err);
    res.status(500).send('Server error');
  }
});
