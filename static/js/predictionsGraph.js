var odor = odor || {};

(function () {
    var padding = 45;
    var w = $(".predictions-graph").width();
    var h = $(".predictions-graph").height();
    var chart = d3.select('.predictions-graph').append('svg')
        .attr('class', 'chart')
        .attr('width', w)
        .attr('height', h)
        .append('g')
           .attr("transform", "translate(" + padding + ",-5)");
    var yAxis = d3.svg.axis()
                      .scale(d3.scale.linear().domain([0, 0]).range([0, 0]))
                      .orient('left')
                      .ticks(5);
    chart.append('g')
        .attr('class', 'axis').call(yAxis);
    chart.append("text")
      .attr("class", "y graph-label")
      .attr("text-anchor", "end")
      .attr("y", -padding)
      .attr("x", -padding)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("prediction (q2)");


    odor.render_graph = function () {
        var data = data_container.predictions.slice(0, data_container.count);
        var x = d3.scale.linear()
                  .domain([0, data.length])
                  .range([2, w-padding]);

        var y = d3.scale.linear()
                  .domain([0, data[0].prediction])
                  .rangeRound([h, 0]);

        var rects = chart.selectAll('rect')
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
            .attr('x', function(d, i) {return x(i) - 0.5; })
            .attr('width', (w-padding-2) / data.length)
            .attr('y', function(d) {return y(d.prediction) - 0.5; })
            .attr('height', function(d) {return h - y(d.prediction > 0 ? d.prediction : 0); });
        rects.exit().remove();

        var yAxis = d3.svg.axis()
                          .scale(y)
                          .orient('left')
                          .ticks(5);
        chart.select('.axis').transition().duration(1000).call(yAxis);
        if (data_container.count > 100) {
            rects.attr('stroke-width', 0);
        } else {
            rects.attr('stroke-width', 1);
        }
    };
})();

