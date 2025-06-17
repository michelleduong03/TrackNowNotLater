export async function updatePaymentOnServer(payment) {
  console.log('Updating payment on server with:', payment);

  const response = await fetch(`http://localhost:5001/api/payments/${payment._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update failed:', errorText);
    throw new Error('Failed to update payment');
  }

  const data = await response.json();
  console.log('Update successful:', data);
  return data;
}

