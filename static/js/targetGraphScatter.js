var odor = odor || {};

(function () {
    var padding = 20;
    var w = $(".target-graph-scatter").width();
    var h = $(".target-graph-scatter").height();
    var r = 3;
    console.log('here');
    var chart = d3.select('.target-graph-scatter').append('svg')
        .attr('class', 'chart')
        .attr('width', w)
        .attr('height', h)
        .append('g')
           .attr("transform", "translate(" + padding + "," + -padding + ")");
    var xAxis = d3.svg.axis()
                      .scale(d3.scale.linear().domain([0, 0]).range([0, 0]))
                      .orient('left')
                      .ticks(5);
    var yAxis = d3.svg.axis()
                      .scale(d3.scale.linear().domain([0, 0]).range([0, 0]))
                      .orient('bottom')
                      .ticks(5);
    chart.append('g')
        .attr('class', 'xaxis axis').call(xAxis)
        .attr("transform", "translate(0," + (h - padding) + ")");
    chart.append('g')
        .attr('class', 'yaxis axis').call(yAxis)
        .attr("transform", "translate(" + padding + ",0)");

    function max_prop (array, prop) {
        function getDescendantProp(obj, desc) {
            var arr = desc.split(".");
            while(arr.length && (obj = obj[arr.shift()]));
            return obj;
        }
        cur_max = 0;
        for (var i = 0; i < array.length; i++) {
            if (getDescendantProp(array[i], prop) > cur_max) cur_max = getDescendantProp(array[i], prop);
        }
        return cur_max;
    }

    odor.render_target_graph_scatter = function () {
        var data = data_container.target_data;
        var x = d3.scale.linear()
                  .domain([0, max_prop(data, "target")])
                  .range([padding, w - padding - r * 2]);

        var y = d3.scale.linear()
                  .domain([0, max_prop(data, "oob_prediction.oob_mean")])
                  .rangeRound([h - padding, padding + r * 2]);

        var circles = chart.selectAll('circle')
            .data(data);

        circles.enter().append('circle')
            .attr('cx', function(d) {return x(0) - 0.5; })
            .attr('cy', function(d) {return y(0) - 0.5; })
            .attr('r', 4)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        // update
        circles.transition()
            .duration(1000)
            .attr('cx', function(d) {return x(d.target) - 0.5; })
            .attr('cy', function(d) {return y(d.oob_prediction.oob_mean) - 0.5; });
        circles.exit().remove();

        var xAxis = d3.svg.axis()
                          .scale(x)
                          .orient('bottom')
                          .ticks(5);
        chart.select('.xaxis').transition().duration(1000).call(xAxis);
        var yAxis = d3.svg.axis()
                          .scale(y)
                          .orient('left')
                          .ticks(5);
        chart.select('.yaxis').transition().duration(1000).call(yAxis);
    };
})();

