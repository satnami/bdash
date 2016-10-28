import React from 'react';
import Select from 'react-select';
import Chart from './chart';

export default class QueryResultChart extends React.Component {
  get chart() {
    return Object.assign({ selectedTab: 'table', type: 'line' }, this.props.query.chart);
  }

  update(nextState) {
    this.props.dispatch('updateChart', this.props.query, nextState);
  }

  handleSelectType(option) {
    this.update({ type: option.value });
  }

  handleChangeX(option) {
    this.update({ x: option ? option.value : null });
  }

  handleChangeY(options) {
    this.update({ y: options.map(o => o.value) });
  }

  handleSelectStack(option) {
    this.update({ stack: option.value });
  }

  renderLabel(option) {
    return <span>
      <i className={`fa fa-${option.value}-chart`}></i>
      <span>{option.label}</span>
    </span>;
  }

  render() {
    let query = this.props.query;
    if (!query.fields) return null;

    let options = ['line', 'bar', 'area', 'pie'].map(value => {
      return { value, label: value[0].toUpperCase() + value.slice(1) };
    });
    let fieldOptions = query.fields.map(f => ({ value: f.name, label: f.name }));
    let stackOptions = ['disable', 'enable', 'percent'].map(o => ({ label: o, value: o }));

    return <div className="ChartBody" hidden={query.selectedTab !== 'chart'}>
      <div className="ChartEdit">
        <div className="ChartEdit-row">
          <div className="ChartEdit-label">Chart Type</div>
          <Select
            className="ChartSelect"
            value={this.chart.type}
            options={options}
            optionRenderer={this.renderLabel}
            valueRenderer={this.renderLabel}
            onChange={(o) => this.handleSelectType(o)}
            clearable={false}
            />
        </div>
        <div className="ChartEdit-row">
          <div className="ChartEdit-label">{this.chart.type === 'pie' ? 'Label Column' : 'X Column'}</div>
          <Select
            options={fieldOptions}
            value={this.chart.x}
            onChange={(o) => this.handleChangeX(o)}
            />
        </div>
        <div className="ChartEdit-row">
          <div className="ChartEdit-label">{this.chart.type === 'pie' ? 'Value Column' : 'Y Column'}</div>
          <Select
            multi={true}
            options={fieldOptions}
            value={this.chart.y}
            onChange={(o) => this.handleChangeY(o)}
            />
        </div>
        <div className="ChartEdit-row" hidden={this.chart.type !== 'bar'}>
          <div className="ChartEdit-label">Stacking</div>
          <Select
            value={this.chart.stack}
            onChange={o => this.handleSelectStack(o)}
            options={stackOptions}
            clearable={false}
            />
        </div>
      </div>
      <div className="ChartPreview">
        <Chart type={this.chart.type} x={this.chart.x} y={this.chart.y} stack={this.chart.stack} rows={query.rows} />
      </div>
    </div>;
  }
}
