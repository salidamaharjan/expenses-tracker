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

const makeLineChart = async (event) => {
  const points = chartList[0].getElementsAtEventForMode(event, 'nearest', {intersect: true}, true);
  if (points.length){
    const chartSection = chartList[0].data.labels[points[0].index];
    let response;
    if(groupOption=='categories'){
      let categoryId;
      switch (chartSection){
        case 'Food':
          categoryId=1;
          break;
        case 'Housing & Utilities':
          categoryId=2;
          break;
        case 'Transportation':
          categoryId=3;
          break;
        case 'Clothing':
          categoryId=4;
          break;
        case 'Other':
          categoryId=5;
          break;
        default:
          return;
      }
      response = await fetch('api/transactions/time-categories?categoryId='+categoryId);
    } else if(groupOption=='names'){
      console.log('names');
      const name = chartList[0].data.labels[points[0].index];
      console.log(name);
      response = await fetch('api/transactions/time-names?name='+name);
    } else {
      return;
    }
    const timedTransactions = await response.json();
    // an array of objects, looks like this: [{month: 1, total_amount: 40}, ...]
    console.log(timedTransactions);
  }
}

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

window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById('myChart0');
  if (el) {
    el.addEventListener('click', makeLineChart);
  }
});
