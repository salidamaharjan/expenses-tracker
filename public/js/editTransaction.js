(() => {
  const editBtn = document.querySelectorAll('.btn-edit');

  editBtn.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const id = event.target.dataset.transactionId;
      console.log(id);
      event.stopPropagation();
      event.preventDefault();
      //   await fetch(`api/transactions/${id}`, {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   });
    });
  });
})();
