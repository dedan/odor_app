var data_container = {predictions: [], count: 0, score: 0}
var startcount = 10

$(reload_data)
$("select").change(reload_data);
$("#more-btn").click(function () {
    data_container.count += 10;
    render_graph();
    render_table();
});
$("#all-btn").click(function () {
    data_container.count = data_container.predictions.length;
    render_graph();
    render_table();
});
$("#table_button").click(function () {
    $("#container").slideToggle('slow')
})

function reload_data() {
        url = $("select.receptor").val() + '/' + $("select.method").val()
        $("select.receptor").val() + '/' + $("select.method").val()
        $.getJSON(url, function(response) {
            data_container.predictions = response.predictions;
            data_container.count = startcount
            data_container.score = response.q2_score
            render_graph()
            render_table()
            update_q2()
        });
    }

function update_q2() {
    if (data_container.score > 0.4) {
        var score_label = 'good'
        var score_class = 'label label-success'
    } else if (data_container.score > 0.2) {
        var score_label = 'low'
        var score_class = 'label label-warning'
    } else {
        var score_label = 'very low'
        var score_class = 'label label-important'
    }
    $('#score').html(data_container.score)
    $('#score_label').html(score_label).removeClass().addClass(score_class)
}

function render_table() {
    tmp_data = data_container.predictions.slice(0, data_container.count)
    var rows = d3.select("#table-body").selectAll("tr").data(tmp_data)
    rows.enter()
      .append("tr")
      .on('mouseover', table_mouseover)
      .on('mouseout', table_mouseout)
    rows.exit().remove()

    var cells = rows.selectAll("td").data(function(d) {
        return ordered_properties(d, ['name', 'CID', 'pred']);
    });
    cells.enter().append("td")
    cells.text(function(d) {
        return d[1];
    });
}

function ordered_properties(json, proplist) {
    var ret = new Array();
    for (i in proplist) {
        ret.push([proplist[i], json[proplist[i]]]);
    }
    return ret;
}

var padding = 30
var w = $("#graph").width();
var h = $("#graph").height();
var chart = d3.select('#graph').append('svg')
    .attr('class', 'chart')
    .attr('width', w)
    .attr('height', h)
    .append('g')
       .attr("transform", "translate(" + padding + ",-5)")
var yAxis = d3.svg.axis()
                  .scale(d3.scale.linear().domain([0, 0]).range([0, 0]))
                  .orient('left')
                  .ticks(5)
chart.append('g')
    .attr('class', 'axis').call(yAxis)

function table_mouseover(d) {
    d3.select(this).classed('active', true)
    d3.select("svg").selectAll("rect").classed("active", function (p) {return p === d;})
}
function table_mouseout(d) {
    d3.select(this).classed('active', false)
    d3.select("svg").selectAll("rect").classed("active", false)
}

function mouseover(d) {
    d3.select(this).classed('active', true)
    $('#chemname').html(d.name)
    $('#pred').html(d.pred)
    $('#CID').html(d.CID)
    d3.select("tbody").selectAll("tr").classed("active", function (p) {return p === d;})
}
function mouseout(d) {
    d3.select(this).classed('active', false)
    $('#chemname').html('')
    $('#pred').html('')
    $('#CID').html('')
    d3.select("tbody").selectAll("tr").classed("active", false)
}
function render_graph() {
    var data = data_container.predictions.slice(0, data_container.count)
    var x = d3.scale.linear()
              .domain([0, data.length])
              .range([2, w-padding]);

    var y = d3.scale.linear()
              .domain([0, data[0].pred])
              .rangeRound([h, 0]);

    var rects = chart.selectAll('rect')
        .data(data)

    rects.enter().append('rect')
        .attr('x', function(d, i) {return x(i) - .5; })
        .attr('width', (w-padding-2) / data.length)
        .attr('y', function(d) {return h - .5; })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)


    // update
    rects.transition()
        .duration(1000)
        .attr('x', function(d, i) {return x(i) - .5; })
        .attr('width', (w-padding-2) / data.length)
        .attr('y', function(d) {return y(d.pred) - .5; })
        .attr('height', function(d) {return h - y(d.pred); })
    rects.exit().remove()

    if (data_container.count == startcount) {
        var yAxis = d3.svg.axis()
                          .scale(y)
                          .orient('left')
                          .ticks(5)
        chart.select('.axis').transition().duration(1000).call(yAxis)
    }
    if (data_container.count > 100) {
        rects.attr('stroke-width', 0)
    }
}


