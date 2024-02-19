(() => {
  const deleteBtn = document.querySelectorAll('#btn-delete');

  deleteBtn.forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      event.preventDefault();
      const id = event.target.dataset.transactionId;
      console.log("id", id);
        await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        window.location.reload();
        return;
    });
  });
})();
