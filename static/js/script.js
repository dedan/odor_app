var data_container = {predictions: [], count: 0}

function reload_data() {
        url = $("select.receptor").val() + '/' + $("select.method").val()
        console.log(url)
        $("select.receptor").val() + '/' + $("select.method").val()
        $.getJSON(url, function(response) {
            data_container.predictions = response.predictions;
            data_container.count = 10
            $('#score').html(response.q2_score)
            console.log('data received');
            render_graph()
            render_table()
        });
    }

function render_table() {
    tmp_data = data_container.predictions.slice(0, data_container.count)
    var rows = d3.select("tbody").selectAll("tr").data(tmp_data)
    rows.enter().append("tr")
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

var w = 500;
var h = 300;
var chart = d3.select('#graph').append('svg')
    .attr('class', 'chart')
    .attr('width', w)
    .attr('height', h);

function render_graph() {
    var data = data_container.predictions.slice(0, data_container.count)
    var x = d3.scale.linear()
              .domain([0, data.length])
              .range([0, w]);

    var y = d3.scale.linear()
              .domain([0, data[0].pred])
              .rangeRound([0, h]);

    chart.selectAll('rect')
        .data(data)
      .enter().append('rect')
        .attr('x', function(d, i) {return x(i) - .5; })
        .attr('y', function(d) {return h - y(d.pred) - .5; })
        .attr('width', w / data.length)
        .attr('height', function(d) {return y(d.pred); })
}

$("select").change(reload_data);
$("#butti").click(function () {
    console.log('bla')
    data_container.count += 10;
    render_graph();
    render_table();
});
$(reload_data)

