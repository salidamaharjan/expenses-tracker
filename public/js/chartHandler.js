let groupOption;
let timeOption;
let chartList = [];

const getOptions = async () => {
  const chartOptionObject = await fetch('/api/transactions/options');
  let chartOption = await chartOptionObject.json();
  groupOption = chartOption.group_options;
  document
    .getElementById('group-options-' + groupOption)
    .setAttribute('checked', 'checked');
  timeOption = chartOption.time_options;
  document
    .getElementById('time-options-' + timeOption)
    .setAttribute('checked', 'checked');
};

const groupOptions = async (event) => {
  if (event.target && event.target.matches("input[type='radio']")) {
    if (!(event.target.id == 'group-options-' + groupOption)) {
      const updatedValue = event.target.id.split('-')[2];
      console.log(updatedValue);
      const response = await fetch('/api/transactions/options', {
        method: 'PUT',
        body: JSON.stringify({ groupOptions: updatedValue }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        groupOption = updatedValue;
        renderCharts();
      }
    }
  }
};

const timeOptions = async (event) => {
  if (event.target && event.target.matches("input[type='radio']")) {
    if (!(event.target.id == 'time-options-' + timeOption)) {
      const updatedValue = event.target.id.split('-')[2];
      console.log(updatedValue);
      const response = await fetch('/api/transactions/options', {
        method: 'PUT',
        body: JSON.stringify({ timeOptions: updatedValue }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        timeOption = updatedValue;
        renderCharts();
      }
    }
  }
};

async function renderChart(chartNumber) {
  //if the list is not long enough, add blank entries to it
  for (let i = chartList.length; i < chartNumber; i++) {
    chartList.push(0);
  }
  if (chartList[chartNumber]) {
    chartList[chartNumber].destroy();
  }
  const ctx = document.getElementById('myChart' + chartNumber);
  let url = '/api/transactions/';
  switch (groupOption) {
    case 'categories':
      url += 'grouped-transactions';
      break;
    case 'names':
      url += 'name-transactions';
      break;
    case 'individuals':
      url += 'credit-transactions';
      break;
    default:
      console.error('Error getting chart options');
      return;
  }
  // TODO: add request body that specifies the time range
  const response = await fetch(url);
  const groupedTransactions = await response.json();
  console.log(groupedTransactions);
  let categoryNames;
  if (groupOption == 'categories') {
    categoryNames = groupedTransactions.map(
      (transaction) => transaction.category.name
    );
  } else {
    categoryNames = groupedTransactions.map((transaction) => transaction.name);
  }
  const transactionAmounts = groupedTransactions.map(
    (transaction) => transaction.total_amount
  );
  console.log(categoryNames);
  console.log(transactionAmounts);

  chartList[chartNumber] = new Chart(ctx, {
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

// TODO: add javascript to handle adding elements to the list in chart.handlebars

document
  .getElementById('group-options')
  .addEventListener('click', groupOptions);
document.getElementById('time-options').addEventListener('click', timeOptions);
