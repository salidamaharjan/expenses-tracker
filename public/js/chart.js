let mychart;

const renderChart = async () => {
    if(mychart){
        mychart.destroy();
    }
    Chart.defaults.color = '#FFFFFF';
    const ctx = document.getElementById('myChart');
    const chartOptionObject = await fetch('/api/transactions/options');
    let chartOption = await chartOptionObject.json();
    chartOption = chartOption.chart_options;
    console.log(chartOption);
    let url = '/api/transactions/';
    switch(chartOption){
      case 'Categories':
        url+='grouped-transactions';
        break;
      case 'Name':
        url+='name-transactions';
        break;
      case 'Individual':
        url+='credit-transactions';
        break;
      default:
        console.error("Error getting chart options");
        return;
    }
    const response = await fetch(url);
    const groupedTransactions = await response.json();
    console.log(groupedTransactions);
    let categoryNames
    if(chartOption=='Categories'){
      categoryNames = groupedTransactions.map(
        (transaction) => transaction.category.name
      );
    } else {
      categoryNames = groupedTransactions.map(
        (transaction) => transaction.name
      );
    }
    const transactionAmounts = groupedTransactions.map(
      (transaction) => transaction.total_amount
    );
    console.log(categoryNames);
    console.log(transactionAmounts);
  
    mychart = new Chart(ctx, {
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
  }

const setCategories = async () => {
    console.log('categories');
    const response = await fetch('/api/transactions/options', {
        method: 'PUT',
        body: JSON.stringify({chartOptions:'categories'}),
        headers: { 'Content-Type': 'application/json' },
    });

    if(response.ok){
        renderChart();
    }
}
const setName = async () => {
    console.log('name');
    const response = await fetch('/api/transactions/options', {
        method: 'PUT',
        body: JSON.stringify({chartOptions:'name'}),
        headers: { 'Content-Type': 'application/json' },
    });

    if(response.ok){
        renderChart();
    }
}
const setIndividual = async () => {
    console.log('individual');
    const response = await fetch('/api/transactions/options', {
        method: 'PUT',
        body: JSON.stringify({chartOptions:'individual'}),
        headers: { 'Content-Type': 'application/json' },
    });

    if(response.ok){
        renderChart();
    }
}

document
    .querySelector('#categories')
    .addEventListener('click', setCategories);

document
    .querySelector('#name')
    .addEventListener('click', setName);

document
    .querySelector('#individual')
    .addEventListener('click', setIndividual);