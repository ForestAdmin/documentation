# Create a Smart Chart

On the previous page, we learned how API-based charts allow you to fetch any dataset from a custom endpoint. But using the finite list of predefined charts (Single, Distribution, Time-based, etc.), you are still constrained by how that data is displayed. With **Smart Charts**, you can code exactly what data you want and how you want it displayed!

{% hint style="info" %}
You need a **Starter plan** or above to create Smart charts
{% endhint %}

### Creating a Smart Chart <a href="#creating-a-smart-chart" id="creating-a-smart-chart"></a>

To create a chart and access the _Smart Chart Editor_, click on the **Edit Smart Chart** button:

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MZlkfgDpqGO7zeIYXj4%2F-MZlmU4mrMJ1N0rGBX9\_%2Fimage.png?alt=media\&token=5d269004-8b26-42bc-9720-bf7f3d5d785b)

Next, use the _Template_, _Component,_ and _Style_ tabs to create your customized chart. At any point, you can render your chart by clicking on the **Run code** button.

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MZlcxPrcf9vT9ernMNV%2F-MZlei1DJUpTPRWKpgtA%2Fimage.png?alt=media\&token=4e0aaabb-d676-4ca2-b038-d177c836bd6a)

{% hint style="warning" %}
Don't forget to click on **Create Chart** (or **Save** if the chart is already created) once you're done!
{% endhint %}

{% hint style="info" %}
If you are creating a **record-specific** smart chart (in the record Analytics tab), the **`record`** object is directly accessible (either through `this.args.record` in the component or `@record` in the template).
{% endhint %}

### Creating a Table Chart <a href="#creating-a-table-chart" id="creating-a-table-chart"></a>

Our first Smart Chart example will be a simple table: however you may choose to make it as complex and customized as you wish.

{% code title="" %}
```markup
<BetaTable
  @columns={{array 'Username' 'Points'}}
  @rows={{this.users}}
  @alignColumnLeft={{true}}
  as |RowColumn user|
>
  <RowColumn>
    <span>{{user.username}}</span>
  </RowColumn>
  <RowColumn>
    <span>{{user.points}}</span>
  </RowColumn>
</BetaTable>
```
{% endcode %}

Using a trivial set of hardcoded data for example's sake:

{% code title="Component tab" %}
```javascript
import Component from '@glimmer/component';
import { loadExternalStyle, loadExternalJavascript } from 'client/utils/smart-view-utils';

export default class extends Component {
  users = [{
    username: 'Darth Vador',
    points: 1500000,
  }, {
    username: 'Luke Skywalker',
    points: 2,
  }]
}
```
{% endcode %}

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MZlcxPrcf9vT9ernMNV%2F-MZlfjh4XS7ZQIc32yNd%2Fimage.png?alt=media\&token=06de6b9b-bbeb-4af9-be93-5fb5ea1f171d)

To query a custom route of your Forest server as your datasource, you may use this syntax instead:

{% code title="Component tab" %}
```javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @service lianaServerFetch;

  @tracked users;

  constructor(...args) {
    super(...args);
    this.fetchData();
  }

  async fetchData() {
    const response = await this.lianaServerFetch.fetch('/forest/custom-data', {});
    this.users = await response.json();
  }
}
```
{% endcode %}

### Creating a Bar Chart <a href="#creating-a-bar-chart" id="creating-a-bar-chart"></a>

This second example shows how you can achieve any format of charts, as you can benefit from external libraries like D3js.

{% code title="Template tab" %}
```markup
<div class="c-smart-view">
    {{this.chart}}
</div>
```
{% endcode %}

{% code title="Component tab" %}
```javascript
import Component from '@glimmer/component';
import { loadExternalStyle, loadExternalJavascript } from 'client/utils/smart-view-utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
   constructor(...args) {
    super(...args);

    this.loadPlugin();
  }

  @tracked chart;
  @tracked loaded = false;

  async loadPlugin() {
    await loadExternalJavascript('https://d3js.org/d3.v6.min.js');

    this.loaded = true;
    this.renderChart()
  }

  async fetchData() {
    const response = await this.lianaServerFetch.fetch('/forest/custom-data', {});
    const data = await response.json();
    return data;
  }

  @action
  async renderChart() {
    if (!this.loaded) { return; }

    const color = 'steelblue';
    
    // Don't comment the lines below if you want to fetch data from your Forest server
    // const usersData = await this.fetchData()
    // const data = Object.assign(usersData.sort((a, b) => d3.descending(a.points, b.points)), {format: "%", y: "↑ Frequency"})
    
    // To remove if you're using data from your Forest server
    const alphabet = await d3.csv('https://static.observableusercontent.com/files/09f63bb9ff086fef80717e2ea8c974f918a996d2bfa3d8773d3ae12753942c002d0dfab833d7bee1e0c9cd358cd3578c1cd0f9435595e76901508adc3964bbdc?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27alphabet.csv', function(d) {
      return {
        name: d.letter,
        value: +d.frequency
      };
    })
    const data = Object.assign(alphabet.sort((a, b) => d3.descending(a.value, b.value)), {format: "%", y: "↑ Frequency"})


    const height = 500;
    const width = 800;
    const margin = ({top: 30, right: 0, bottom: 30, left: 40})

    const x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1)
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])

    const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(i => data[i].username).tickSizeOuter(0))

    const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, data.format))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y))

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .attr("fill", color)
          .selectAll("rect")
          .data(data)
          .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth());

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    this.chart = svg.node();
  }
}
```
{% endcode %}

In the above snippet, notice how we import the **D3js** library. Of course, you can choose to use any other library of your choice.

{% hint style="info" %}
This bar chart is inspired by [this one](https://observablehq.com/@d3/bar-chart).
{% endhint %}

The resulting chart can be resized to fit your use:

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MZlj4t\_3ZRkMF\_s0vjK%2F-MZljyVpyui77zuDOBGx%2Fimage.png?alt=media\&token=3f5a6400-127c-486c-b7ad-18c989275bd1)

### Creating a density map <a href="#creating-a-density-map" id="creating-a-density-map"></a>

This last example shows how you can achieve virtually anything, since you are basically coding in a sandbox. There's no limit to what you can do with Smart charts.

{% code title="Template tab" %}
```markup
<div class="c-smart-view">
    {{this.chart}}
</div>
```
{% endcode %}

{% code title="Component tab" %}
```javascript
import Component from '@glimmer/component';
import { loadExternalStyle, loadExternalJavascript } from 'client/utils/smart-view-utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
   constructor(...args) {
    super(...args);

    this.loadPlugin();
  }
  
  @tracked chart;
  @tracked loaded = false;

  async loadPlugin() {
    await loadExternalJavascript('https://d3js.org/d3.v6.min.js');
    await loadExternalJavascript('https://unpkg.com/topojson-client@3');
    
    this.loaded = true;
    this.renderChart()
  }
  
  @action
  async renderChart() {
    if (!this.loaded) { return; }
    
    const height = 610;
    const width = 975;
    const format = d3.format(",.0f");
    const path = d3.geoPath();
    
    // This is the JSON for drawing the contours of the map
    // Ref.: https://github.com/d3/d3-fetch/blob/v2.0.0/README.md#json
    const us = await d3.json("https://static.observableusercontent.com/files/6b1776f5a0a0e76e6428805c0074a8f262e3f34b1b50944da27903e014b409958dc29b03a1c9cc331949d6a2a404c19dfd0d9d36d9c32274e6ffbc07c11350ee?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27counties-albers-10m.json")
    const features = new Map(topojson.feature(us, us.objects.counties).features.map(d => [d.id, d]))
    // Population should contain data about the dencity
    const population = await d3.json('https://static.observableusercontent.com/files/beb56a2d9534662123fa352ffff2db8472e481776fcc1608ee4adbd532ea9ccf2f1decc004d57adc76735478ee68c0fd18931ba01fc859ee4901deb1bee2ed1b?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27population.json')

    const data = population.slice(1).map(([population, state, county]) => {
      const id = state + county;
      const feature = features.get(id);
      return {
        id,
        position: feature && path.centroid(feature),
        title: feature && feature.properties.name,
        value: +population
      };
    })
    
    const radius = d3.scaleSqrt([0, d3.max(data, d => d.value)], [0, 40])

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("path")
      .datum(topojson.feature(us, us.objects.nation))
      .attr("fill", "#ddd")
      .attr("d", path);

    svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

    const legend = svg.append("g")
      .attr("fill", "#777")
      .attr("transform", "translate(915,608)")
      .attr("text-anchor", "middle")
      .style("font", "10px sans-serif")
    .selectAll("g")
      .data(radius.ticks(4).slice(1))
    .join("g");

    legend.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("cy", d => -radius(d))
      .attr("r", radius);

    legend.append("text")
      .attr("y", d => -2 * radius(d))
      .attr("dy", "1.3em")
      .text(radius.tickFormat(4, "s"));

    svg.append("g")
      .attr("fill", "brown")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
    .selectAll("circle")
    .data(data
      .filter(d => d.position)
      .sort((a, b) => d3.descending(a.value, b.value)))
    .join("circle")
      .attr("transform", d => `translate(${d.position})`)
      .attr("r", d => radius(d.value))
    .append("title")
      .text(d => `${d.title} ${format(d.value)}`);

    this.chart = svg.node();
  }
}
```
{% endcode %}

In the above snippet, notice how we import the **D3js** library. Of course, you can choose to use any other library of your choice.

{% hint style="info" %}
This density map chart is inspired from [this one](https://observablehq.com/@d3/bubble-map).
{% endhint %}

The resulting chart can be resized to fit your use:

![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-MZlnG8W0zyohS4OAZnN%2F-MZlntfMEVbnDWAqJPC2%2Fimage.png?alt=media\&token=609f7438-d7ae-4610-87f4-98eee5488e5c)

### Creating a Cohort Chart <a href="#creating-a-cohort-chart" id="creating-a-cohort-chart"></a>

This is another example to help you build a Cohort Chart.

{% code title="Template tab" %}
```markup
<div class="c-smart-chart">
  <div id="demo"></div>
</div>
```
{% endcode %}

{% code title="Component tab" %}
```javascript
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { loadExternalStyle, loadExternalJavascript } from 'client/utils/smart-view-utils';
function isValidHex(color){
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
}
function shadeColor(color, percent) { //#
    color = isValidHex(color) ? color : "#3f83a3"; //handling null color;
    percent = 1.0 - Math.ceil(percent / 10) / 10;
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
export default class extends Component {
  @service lianaServerFetch;
  @tracked loaging = true;
  constructor(...args) {
    super(...args);
    this.loadPlugin();
  }
  async loadPlugin() {
    await loadExternalJavascript('https://d3js.org/d3.v6.min.js');
    this.loaging = false;
    this.renderChart()
  }
  getRows(data){
    var rows = [];
    var keys = Object.keys(data);
    var days = [];
    var percentDays = [];
    for(var key in keys){
        if(data.hasOwnProperty(keys[key])) {
            days = data[keys[key]];
            percentDays.push(keys[key]);
            for(var i = 0; i < days.length; i++){
                percentDays.push(i > 0 ? Math.round((days[i]/days[0] * 100) * 100) / 100 : days[i]);
            }
            rows.push(percentDays);
            percentDays = [];
        }
      }
    return rows;
  }
  @action
  async renderChart() {
    // To fetch data from the backend
    // const data = await this.lianaServerFetch.fetch('/forest/custom-route', {});
    const options = {
      data : {
          // You can use any data format, just change the getRows logic
          "May 3, 2021" : [79, 18, 16, 12, 16, 11, 7, 5],
          "May 10, 2021" : [168, 35, 28, 30, 24, 12, 10 ],
          "May 17, 2021" : [188, 42, 32, 34, 25, 18],
          "May 24, 2021" : [191, 42, 32, 28, 12],
          "May 31, 2021" : [191, 45, 34, 30],
          "June 7, 2021" : [184, 42, 32],
          "June 14, 2021" : [182, 44],
      },
      title : "Retention rates by weeks after signup"
    };
    var graphTitle = options.title || "Retention Graph";
    var data = options.data || null;
    const container = d3.select("#demo").append("div")
        .attr("class", "box");
    var header = container.append("div")
        .attr("class", "box-header with-border");
    var title = header.append("p")
        .attr("class", "box-title")
        .text(graphTitle);
    var body = container.append("div")
        .attr("class", "box-body");
    var table = body.append("table")
        .attr("class", "table table-bordered text-center");
    var headData = ["Cohort", "New users", "1", "2", "3", "4", "5", "6", "7"];
    var tHead = table.append("thead")
        .append("tr")
        .attr("class", "retention-thead")
        .selectAll("td")
        .data(headData)
        .enter()
        .append("td")
        .attr("class", function (d, i) {
            if(i == 0)
                return "retention-date"
            else
                return "days"
        })
        .text(function (d) {
            return d;
        });
    var rowsData = this.getRows(data);
    var tBody = table.append("tbody");
    var rows = tBody.selectAll("tr")
        .data(rowsData).enter()
        .append("tr");
    var cells = rows.selectAll("td")
        .data(function (row, i) {
            return row;
        }).enter()
        .append("td")
        .attr("class", function (d, i) {
            if(i == 0)
                return "retention-date";
            else
                return "days";
        })
        .attr("style", function (d, i) {
            if(i > 1)
            return "background-color :" + shadeColor("#00c4b4", d);
        })
        .append("div")
        .attr("data-toggle", "tooltip")
        .text(function (d, i) {
            return d + (i > 1 ? "%" : "");
        });
  }
}
```
{% endcode %}

In the above snippet, notice how we import the **D3js** library. Of course, you can choose to use any other library of your choice.

{% code title="Style tab" %}
```css
.c-smart-chart {
  display: flex;
  white-space: normal;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: var(--color-beta-surface);
}
.box{
  position:relative;
  border-radius:3px;
  background:#ffffff;
  width:100%;
}
.box-body{
  max-height:500px;
  overflow:auto;
  border-top-left-radius:0;
  border-top-right-radius:0;
  border-bottom-right-radius:3px;
  border-bottom-left-radius:3px;
}
.box-header{
  color:#444;
  display:block;
  padding:10px;
  position:relative
}
.box-header .box-title{
    display:inline-block;
    font-size:18px;
    margin:0;
    line-height:1;
}
.box-title{
    display:inline-block;font-size:18px;margin:0;line-height:1
}
.retention-thead, .retention-date{
    background-color: #cfcfcf;
    font-weight: 700;
    padding: 8px;
}
.days{
  cursor: pointer;
  padding: 8px;
  text-align: center;
}
```
{% endcode %}

The resulting chart can be resized to fit your use:![](https://gblobscdn.gitbook.com/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-McF5Q19wi4K5nGRWsEw%2F-McF5ZgR\_CzOBdpKh9Xe%2FCleanShot%202021-06-15%20at%2016.36.24%402x.png?alt=media\&token=16334b60-fcf8-4e02-8a36-605a4fea4e7c)
