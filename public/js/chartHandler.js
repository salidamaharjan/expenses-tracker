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
  const date = new Date();
  const dayOfWeek = date.getDay();
  let startDate, endDate;
  switch (timeOption) {
    case 'weekly':
      //empty fields are given lowest value, so should be midnight for these days
      //automatically handles underflows/overflows to next month
      //last Sunday
      startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-dayOfWeek);
      //very start of next Sunday
      endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+7-dayOfWeek);
      break;
    case 'biweekly':
      startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-7-dayOfWeek);
      endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+7-dayOfWeek);
      break;
    case 'monthly':
      // day defaults to the first of the month if not set
      startDate = new Date(date.getFullYear(), date.getMonth());
      endDate = new Date(date.getFullYear(), date.getMonth()+1);
      break;
    default:
      console.error('Error getting time options.');
      return;
  }
  url+="?startDate="+startDate.toDateString()+"&endDate="+endDate.toDateString();
  const response = await fetch(url);
  const groupedTransactions = await response.json();
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
  const labels = categoryNames;
  const data = transactionAmounts;
  chartList[chartNumber] = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Total Expenses',
          data: data,
          borderWidth: 1,
        },
      ],
    },
    options: {
      // scales: {
      //   y: {
      //     beginAtZero: true,
      //   },
      // },
      onClick: function (evt, item, legend) {
        // console.log('item= ', item);
        // console.log('legend=', legend);
        const index = item[0].index;
        // console.log(index);
        const selectedSegment = labels[index];
        console.log('selectedSegment', selectedSegment);
        console.log('totalAmount', data[index]);
        window.location.replace('/lineGraph');
      },
    },
  });
}

// TODO: add javascript to handle adding elements to the list in chart.handlebars

document
  .getElementById('group-options')
  .addEventListener('click', groupOptions);
document.getElementById('time-options').addEventListener('click', timeOptions);
