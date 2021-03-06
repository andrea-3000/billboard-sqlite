function initBar(config) {
  var svgContainer = d3.select("#artist-bar");

  // Create an object to export our methods on the config
  config.bar = {};

  // Start building our svg bar chart
  var svg = svgContainer.append("svg");
  var chart = svg.append("g");

  svg.attr('width', '100%').attr('height', '75vh');

  // Get the width and height of the element containing our svg element
  var boundingRect = svgContainer.node().getBoundingClientRect();

  var margin = {top: 40, right: 20, bottom: 30, left: 50};
  // Hang on to the width and height values to use when generating the graph
  var width = boundingRect.width - (margin.left + margin.right);
  var height = boundingRect.height - (margin.top + margin.bottom);

  // Position the chart with the margin accounted for
  chart.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Render re-renders the bar chart
  config.bar.render = function () {
    var artists = JSON.parse(config.data);
    var artist_names = [];
    var weeks_on_chart = [];
    // console.log(artists[0]);
    artists.sort((a,b) => d3.descending(a.fields.weeks_on_chart, b.fields.weeks_on_chart));
    artists.forEach(function(artist) {
      artist_names.push(artist.fields.name);
      weeks_on_chart.push(artist.fields.weeks_on_chart);
    });

    var nameScale = d3.scaleBand() // band scale
      .domain(artist_names)            // of country names
      .range([0, width])         // ranging from 0 to the width of our container
      .paddingInner(0.1);        // with padding between the bands

    // Get the highest value from the winners data
    var maxWeeks_On_Chart = d3.max(weeks_on_chart);

    // Create our winner count scale
    var weeks_on_chartScale = d3.scaleLinear() // linear scale
      .domain([0, maxWeeks_On_Chart])        // of a domain
      .range([height, 0])            // ranging from the height down to 0
      .nice();                       // rounding to a nice even number

    // Get the width of the bands from the scale
    var bandwidth = nameScale.bandwidth();

    // Remove the graph if it exists
    chart.selectAll("g").remove();

    // Create a group to hold our graph
    var graph = chart.append("g");

    // Create a group for our bars
    var bars = graph.append("g")
      .classed("bars", true);

    function renderGradients(svg) {
      let gradient = svg.append("svg:defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "0%")
        .attr("spreadMethod", "pad");

      gradient.append("svg:stop")
        .attr("class", "begin")
        .attr("offset", "0%");

      gradient.append("svg:stop")
        .attr("class", "end")
        .attr("offset", "100%");
    }

    // For tints, calculate (255 - previous value), multiply that by 1/4, 1/2, 3/4, etc.
    //  (the greater the factor, the lighter the tint), and add that to the previous value.
    var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .text("a simple tooltip");


    var r = 128
    var g = 22;
    var b = 22;
    var mult = 0.02;
    // Draw the bars
    bars.selectAll('rect.bar')
      .data(artists)
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', bandwidth-2)
      .attr('height', function(d) {
        return height - weeks_on_chartScale(d.fields.weeks_on_chart);
      })
      .attr('x', function(d) {
        return nameScale(d.fields.name);
      })
      .attr('y', function(d) {
        return weeks_on_chartScale(d.fields.weeks_on_chart);
      })
      .attr('fill', function(d) {
        var newColor = d3.rgb(r, g, g);
        r = r + ((255-r)*mult);
        g = g + ((255-g)*mult);
        return newColor
      }).on("mouseover", function(d){
        tooltip.text(d.fields.name + ": " + d.fields.weeks_on_chart);
        return tooltip.style("visibility", "visible");
      }).on("mousemove", function() {
        return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      }).on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      });

    // Create a Y axis on the left side from our winner scale
    // If the largest value is greater than 10 only draw 10 tick marks
    // but if the value is less than 10, e.g. 3, only draw 3 tick marks
    var yAxis = d3.axisLeft(weeks_on_chartScale)
      .ticks(Math.min(10, maxWeeks_On_Chart));

    graph.append("g")
      .classed("y axis", true)
      .call(yAxis)

    // Create an X axis on the bottom to show the country names
    var xAxis = d3.axisBottom(nameScale)
      .tickSizeOuter(0);

    graph.append("g")
      .classed("x axis", true)
      .call(xAxis)
      .attr('transform', 'translate(0,' + height + ')')
      .attr("font-size","6px")
      .selectAll("text")
      .attr('transform', 'rotate(-65)')
      .style('text-anchor', 'end')
      .attr('dx', '-1em')
      .attr('dy', '.15em')

    graph.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .text('Weeks On Chart');
  }

}
