(() => {
  const createBtn = document.querySelector('#btn-create');
  const type = document.querySelector('#transactionType');
  const transactionName = document.querySelector('#transactionName');
  const description = document.querySelector('#description');
  const amount = document.querySelector('#amount');
  const date = document.querySelector('#transactionDate');
  const categoryId = document.querySelector('#transactionCategory');

  createBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    event.preventDefault();
    const data = {
      transactionType: type.value,
      name: transactionName.value,
      description: description.value,
      amount: amount.value,
      date: date.value,
      categoryId: categoryId.value,
    };

    await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    window.location.replace('/transactions');
  });
})();
