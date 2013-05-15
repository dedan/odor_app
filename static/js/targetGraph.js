
var odor = odor || {};

(function () {

  var padding = 45;
  var w = $(".target-graphs").width();
  var h = $(".target-graphs").height();
  var targetGraph = d3.select('.target-graph').append('svg')
      .attr('class', 'chart')
      .attr('width', w)
      .attr('height', h)
      .append('g')
         .attr("transform", "translate(" + padding + ",-5)");
  var yAxis = d3.svg.axis()
                    .scale(d3.scale.linear().domain([0, 0]).range([0, 0]))
                    .orient('left')
                    .ticks(5);
  targetGraph.append('g')
      .attr('class', 'axis').call(yAxis);
  targetGraph.append("text")
    .attr("class", "y graph-label")
    .attr("text-anchor", "end")
    .attr("y", -padding)
    .attr("x", -padding)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("oob prediction (q2)");

  targetGraph.append("text")
    .attr("class", "legend")
    .attr("text-anchor", "end")
    .attr("x", w - padding)
    .attr("y", padding)
    .attr("fill", "red")
    .attr("opacity", 0.5)
    .text("oob-prediction");
  targetGraph.append("text")
    .attr("class", "legend")
    .attr("text-anchor", "end")
    .attr("x", w - padding)
    .attr("y", padding - 15)
    .attr("fill", "steelblue")
    .attr("opacity", 0.5)
    .text("true target");

  odor.render_target_graph = function () {
      var data = data_container.target_data;
      data.sort(function (a, b) {return a.target - b.target;});
      data.reverse();
      var plot_data = [];
      for (var i = 0; i < data.length; i++) {
          plot_data.push([data[i], data[i]]);
      }
      var x = d3.scale.linear()
                .domain([0, data.length])
                .range([2, w-padding]);

      var y = d3.scale.linear()
                .domain([0, data[0].target])
                .rangeRound([h, 0]);

      var gs = targetGraph.selectAll('g.rects')
          .data(plot_data);
      gs.enter().append('g').attr('class', 'rects');
      gs.exit().remove()

      var rects = gs.selectAll('rect')
        .data(Object);
      rects.enter().append('rect')
          .attr('x', function(d, i, j) {return x(j) - 0.5; })
          .attr('width', (w-padding-2) / data.length)
          .attr('y', function(d) {return h - 0.5; })
          .on('mouseover', mouseover)
          .on('mouseout', mouseout);

      // update
      rects.transition()
          .duration(1000)
          .attr('x', function(d, i, j) {return x(j) - 0.5; })
          .attr('width', (w-padding-2) / data.length)
          .attr('y', function(d, i) {return i === 0 ? y(d.target) - 0.5 : y(Math.max(0, d.oob_prediction.oob_mean)) - 0.5; })
          .attr('height', function(d, i) {return i === 0 ? h - y(d.target) : h - y(Math.max(0, d.oob_prediction.oob_mean)); })
          .attr('class', function (d, i) {return (i === 1) ? 'oob-prediction' : null;});
      rects.exit().remove();

      var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient('left')
                        .ticks(5);
      targetGraph.select('.axis').transition().duration(1000).call(yAxis);
  };
})();
