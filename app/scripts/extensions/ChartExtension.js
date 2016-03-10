'use strict'
/*eslint no-unused-vars: [2, { "varsIgnorePattern": "ChartExtension" }]*/

/**
 * @class ChartExtension
 * @memberOf hhStat
 * @description Represents chart object
 * @param {Boolean} isMainChart     Is it main chart or demo
 * @param {Object}  chartType       Chart type
 * @param {Object}  valueType       Value type
 * @param {Object}  currency        Currency
 * @param {hhStat.CurrencyService}  currencyService Instance of CurrencyService
 */
function ChartExtension(isMainChart, chartType, valueType, currency, currencyService) {
  var self = this;

  this.isMainChart = isMainChart;
  this.valueType = valueType;
  this.currency = currency;

  this.updateSeries = updateSeries;
  this.refresh = refresh;

  var currencyName = (self.currency ? self.currency.name : null);

  this.config = {
    options: {
      chart: {
        type: chartType.id,
        animation: false,
        backgroundColor: '#ededea'
      },
      legend: {
        enabled: isMainChart
      },
      tooltip: {
        enabled: isMainChart,
        formatter: tooltipFormatter
      },
      exporting: {
        buttons: {
          contextButton: {
            enabled: isMainChart,
            symbolFill: '#ededea',
            symbol: 'menu',
            symbolSize: 14,
            symbolStroke: '#666',
            symbolStrokeWidth: 1
          }
        }
      },
      navigation: {
        buttonOptions: {
          enabled: isMainChart,
          symbolFill: '#ededea'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: isMainChart
        }
      },
      credits: {
        enabled: true,
        href: 'http://job.bocharovf.ru',
        text: 'http://job.bocharovf.ru'
      },
      loading: {
        showDuration: 0,
        hideDuration: 0
      }
    },
    series: [],
    title: {
      text: valueType.title
    },
    xAxis: {
      title: {
        text: null
      }
    },
    yAxis: {
      title: {
        text: currencyName
      }
    }

  };

  // special case for polar chart
  if (chartType.id === 'polar') {
    this.config.options.chart.type = 'line';
    this.config.options.chart.polar = true;

    this.config.xAxis.tickmarkPlacement = 'on';
    this.config.xAxis.lineWidth = 0;

    this.config.yAxis.gridLineInterpolation = 'polygon';
    this.config.yAxis.lineWidth = 0;
    this.config.yAxis.min = 0;
  }

  /****************** Functions ***************/

  /**
   * @function
   * @memberOf hhStat.ChartExtension
   * @description Apply changes of chart settings
   */
  function refresh() {
    self.config.title.text = (self.isMainChart ? self.valueType.title : null);

    if (self.isMainChart) {
      if (self.valueType.id === 'avgSalary')
        self.config.yAxis.title.text = (self.currency ? self.currency.name : null)
      else if (self.valueType.id === 'amountTotal')
        self.config.yAxis.title.text = 'Вакансии, шт.';
    }

    self.config.options.legend.enabled = self.isMainChart;
    self.config.options.tooltip.enabled = self.isMainChart;
    self.config.options.exporting.buttons.contextButton.enabled = self.isMainChart;
    self.config.options.navigation.buttonOptions.enabled = self.isMainChart;
    self.config.options.plotOptions.pie.showInLegend = self.isMainChart;
  }

  /**
   * @function
   * @memberOf hhStat.ChartExtension
   * @private
   * @description Apply changes in data source
   * @param {hhStat.SearchResult[]} results Data source of chart
   */
  function updateSeries(results) {
    refresh();

    var colors = Highcharts.getOptions().colors;

    var categories = Object.keys(results).sort();
    var data = categories.map(function(token, i) {
      return {
        y: getComparisonValue(results[token]),
        color: colors[i],
        name: token
      };
    });

    var serie = {
      name: null,
      data: data,
      size: '100%',
      showInLegend: false,
      dataLabels: {
        formatter: function() {
          return this.point.name;
        },
        color: '#ffffff',
        distance: -30
      }
    };

    if (chartType.id === 'pie')
      serie.showInLegend = true;

    if (chartType.id === 'polar')
      serie.pointPlacement = 'on';

    this.config.series[0] = serie;
    this.config.xAxis.categories = categories;
  }

  /**
   * @function
   * @memberOf hhStat.ChartExtension
   * @private
   * @description Produce tooltip for different value type
   * @return {String} Tolltip for chart point
   */
  function tooltipFormatter() {
    if (self.valueType.id === 'avgSalary') {
      return self.valueType.name +
        ' <b>' + Math.round(this.y, 0) + ' ' + self.currency.abbr + '</b>';
    } else if (self.valueType.id === 'amountTotal') {
      return self.valueType.name +
        ' <b>' + Math.round(this.y, 0) + '</b>';
    }

  }

  /**
   * @function
   * @memberOf hhStat.ChartExtension
   * @private
   * @description Retrieve value to display on chart from data point
   * @param {Object} result Data of chart point
   * @return {Number} Value of point
   */
  function getComparisonValue(result) {
    if (self.valueType.id === 'avgSalary') {
      return currencyService.convert(result.salary.avg, 'RUR', self.currency.code);
    } else if (self.valueType.id === 'amountTotal') {
      return result.amount.total;
    }
  }

}