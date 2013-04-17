// the data container
data_container = {predictions: [], count: 0, score: 0};
var startcount = 10;

// on load --> get data and bind events
$(reload_data);
$("select").change(reload_data);
$("#more-btn").click(function () {
    data_container.count += 10;
    odor.render_graph();
    render_table();
});
$("#less-btn").click(function () {
    if (data_container.count > 10) {
        data_container.count -= 10;
        odor.render_graph();
        render_table();
    }
});
$("#all-btn").click(function () {
    data_container.count = data_container.predictions.length;
    odor.render_graph();
    render_table();
});
$("#table_button").click(function () {
    $("#container").slideToggle('slow');
});

function reload_data() {
        url = $("select.receptor").val() + '/' + $("select.method").val();
        $.getJSON(url, function(response) {
            data_container.predictions = response.predictions;
            data_container.count = startcount;
            data_container.score = response.q2_score;
            data_container.target_data = data_container.predictions.filter(function (e) {
                return ("target" in e);
            });
            odor.render_target_graph();
            odor.render_target_graph_scatter();
            odor.render_graph();
            render_table();
            update_q2();
        });
    }

function update_q2() {
    var score_label, score_class;
    if (data_container.score > 0.4) {
        score_label = 'good';
        score_class = 'label label-success';
    } else if (data_container.score > 0.2) {
        score_label = 'low';
        score_class = 'label label-warning';
    } else {
        score_label = 'very low';
        score_class = 'label label-important';
    }
    $('#score').html(data_container.score);
    $('#score_label').html(score_label).removeClass().addClass(score_class);
}

function render_table() {
    tmp_data = data_container.predictions.slice(0, data_container.count);
    var rows = d3.select("#table-body").selectAll("tr").data(tmp_data);
    rows.enter()
      .append("tr")
      .on('mouseover', table_mouseover)
      .on('mouseout', table_mouseout);
    rows.exit().remove();

    var cells = rows.selectAll("td").data(function(d) {
        return ordered_properties(d, ['name', 'CID', 'prediction']);
    });
    cells.enter().append("td");
    cells.text(function(d) {
        return d[1];
    });
}

function ordered_properties(json, proplist) {
    var ret = [];
    for (var i in proplist) {
        ret.push([proplist[i], json[proplist[i]]]);
    }
    return ret;
}

function table_mouseover(d) {
    d3.select(this).classed('active', true);
    d3.select("svg").selectAll("rect").classed("active", function (p) {return p === d;});
}
function table_mouseout(d) {
    d3.select(this).classed('active', false);
    d3.select("svg").selectAll("rect").classed("active", false);
}

function mouseover(d) {
    d3.select(this).classed('active', true);
    $('#chemname').html(d.name);
    $('#pred').html(d.prediction);
    $('#smile').html(d.smile);
    d3.select("#table-body").selectAll("tr").classed("active", function (p) {return p === d;});
}
function mouseout(d) {
    d3.select(this).classed('active', false);
    $('#chemname').html('');
    $('#pred').html('');
    $('#CID').html('');
    $('#smile').html('');
    d3.select("#table-body").selectAll("tr").classed("active", false);
}
