
var odor = odor || {};

(function () {

  var padding = 30;
  var w = $(".target-graph").width();
  var h = $(".target-graph").height();
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

    console.log('add render target');
  odor.render_target_graph = function () {
      var data = data_container.target_data;
      data.sort(function (a, b) {return a.target - b.target;});
      data.reverse();
      var x = d3.scale.linear()
                .domain([0, data.length])
                .range([2, w-padding]);

      var y = d3.scale.linear()
                .domain([0, data[0].target])
                .rangeRound([h, 0]);

      var rects = targetGraph.selectAll('rect')
          .data(data);

      rects.enter().append('rect')
          .attr('x', function(d, i) {return x(i) - 0.5; })
          .attr('width', (w-padding-2) / data.length)
          .attr('y', function(d) {return h - 0.5; })
          .on('mouseover', mouseover)
          .on('mouseout', mouseout);

      // update
      rects.transition()
          .duration(1000)
          .attr('y', function(d) {return y(d.target) - 0.5; })
          .attr('height', function(d) {return h - y(d.target); });
      rects.exit().remove();

      var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient('left')
                        .ticks(5);
      targetGraph.select('.axis').transition().duration(1000).call(yAxis);
  };
})();
