(async () => {
  const ctx = document.getElementById('myChart');
  const response = await fetch('/api/transactions/grouped-transactions');
  const groupedTransactions = await response.json();
  console.log(groupedTransactions);
  const categoryNames = groupedTransactions.map(
    (transaction) => transaction.category.name
  );
  const transactionAmounts = groupedTransactions.map(
    (transaction) => transaction.total_amount
  );
  console.log(categoryNames);
  console.log(transactionAmounts);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categoryNames,
      datasets: [
        {
          label: 'Total Expenses',
          data: transactionAmounts,
          borderWidth: 1,
        },
      ],
    },
  });
})();
