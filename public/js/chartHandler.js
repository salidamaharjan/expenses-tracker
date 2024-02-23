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
  const date = new Date();
  const dayOfWeek = date.getDay();
  let startDate, endDate;
  switch (timeOption) {
    case 'weekly':
      //empty fields are given lowest value, so should be midnight for these days
      //automatically handles underflows/overflows to next month
      //last Sunday
      startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - dayOfWeek
      );
      //very start of next Sunday
      endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 7 - dayOfWeek
      );
      break;
    case 'biweekly':
      startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 7 - dayOfWeek
      );
      endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 7 - dayOfWeek
      );
      break;
    case 'monthly':
      // day defaults to the first of the month if not set
      startDate = new Date(date.getFullYear(), date.getMonth());
      endDate = new Date(date.getFullYear(), date.getMonth() + 1);
      break;
    default:
      console.error('Error getting time options.');
      return;
  }
  url +=
    '?startDate=' +
    startDate.toDateString() +
    '&endDate=' +
    endDate.toDateString();
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
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
    options: {
      onClick: async function (evt, item, legend) {
        // console.log('item= ', item);
        // console.log('legend=', legend);
        const index = item[0].index;
        // console.log(index);
        const selectedSegment = categoryNames[index];
        console.log('selectedSegment', selectedSegment);
        console.log('totalAmount', transactionAmounts[index]);

        let response;
        if (groupOption === 'categories') {
          response = await fetch(
            'api/transactions/time-categories?name=' +
              encodeURIComponent(selectedSegment)
          );
        } else {
          response = await fetch(
            'api/transactions/time-names?name=' +
              encodeURIComponent(selectedSegment)
          );
        }
        const timeData = await response.json();
        const months = timeData
          .map((item) => item.month)
          .map((monthNumber) => {
            switch (monthNumber) {
              case 1:
                return 'Jan';
              case 2:
                return 'Feb';
              case 3:
                return 'Mar';
              case 4:
                return 'Apr';
              case 5:
                return 'May';
              case 6:
                return 'Jun';
              case 7:
                return 'Jul';
              case 8:
                return 'Aug';
              case 9:
                return 'Sept';
              case 10:
                return 'Oct';
              case 11:
                return 'Nov';
              case 12:
                return 'Dec';
              default:
                return 'N/A';
            }
          });
        const amounts = timeData.map((item) => item.total_amount);

        const ctx = document.getElementById('lineChart');
        const lineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Expenses per month',
                data: amounts,
                borderWidth: 1,
              },
            ],
          },
        });
        const lineChartModal = new bootstrap.Modal('#lineChartModal', {});
        lineChartModal.show();
        const myModal = document.getElementById('lineChartModal');
        myModal.addEventListener('hidden.bs.modal', () => {
          lineChart.destroy();
        });
      },
    },
  });
}

// TODO: add javascript to handle adding elements to the list in chart.handlebars

document
  .getElementById('group-options')
  .addEventListener('click', groupOptions);
document.getElementById('time-options').addEventListener('click', timeOptions);
