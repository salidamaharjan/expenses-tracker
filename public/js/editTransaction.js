(() => {
  const updateBtn = document.querySelector('.btn-update');
  console.log(updateBtn);
  const type = document.querySelector('#transactionType');
  const transactionName = document.querySelector('.transactionName');
  const description = document.querySelector('.description');
  const amount = document.querySelector('.amount');
  const date = document.querySelector('.transactionDate');
  const categoryId = document.querySelector('.transactionCategory');

  updateBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    event.preventDefault();
    const id = event.target.dataset.transactionId;
    const data = {
      transactionType: type.value,
      name: transactionName.value,
      description: description.value,
      amount: amount.value,
      date: date.value,
      categoryId: categoryId.value,
    };
    console.log('data-->', data);
    await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    window.location.replace('/transactions');
  });
})();
