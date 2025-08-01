
async function convertCurrency() {
  const apiKey = '8dd515216a9ba455ab55a7ec';
  const from = document.getElementById('fromCurrency').value;
  const to = document.getElementById('toCurrency').value;
  const amount = parseFloat(document.getElementById('amount').value.trim());

  const output = document.getElementById('output');

  if (!from || !to || isNaN(amount)) {
    output.textContent = 'Please select your currencies and enter a valid amount.';
    return;
  }

  if (from === to) {
    output.textContent = 'Please choose two different currencies.';
    return;
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.result !== "success") {
      output.textContent = `API Error: ${data['error-type'] || 'Unknown error'}`;
      return;
    }

    output.innerHTML = `
      <strong>Exchange Rate:</strong><br>
      1 ${from} = ${data.conversion_rate} ${to}<br><br>
      <strong>Converted Amount:</strong><br>
      ${amount} ${from} = ${data.conversion_result.toFixed(2)} ${to}
    `;
  } catch (err) {
    console.error(err);
    output.textContent = 'Failed to retrieve data. Please try again.';
  }
}

