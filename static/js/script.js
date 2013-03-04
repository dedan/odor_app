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
            render_table()
        });
    }

function render_table() {
    tmp_data = data_container.predictions.slice(0, data_container.count)
    var rows = d3.select("tbody").selectAll("tr").data(tmp_data)
    rows.enter().append("tr")
    rows.exit().remove()

    var cells = rows.selectAll("td").data(function(d) {
        return jsonToArray(d);
    });
    cells.enter().append("td")
    cells.text(function(d) {
        return d[1];
    });
}

function jsonKeyValueToArray(k, v) {
    return [k, v];
}

function jsonToArray(json) {
    var ret = new Array();
    var key;
    for (key in json) {
        if (json.hasOwnProperty(key)) {
            ret.push(jsonKeyValueToArray(key, json[key]));
        }
    }
    return ret;
}

$("select").change(reload_data);
$(reload_data)

