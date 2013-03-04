var data = []

function reload_data() {
        url = $("select.receptor").val() + '/' + $("select.method").val()
        console.log(url)
        $("select.receptor").val() + '/' + $("select.method").val()
        $.getJSON(url, function(response) {
            data = response;
            console.log('data received');
            render_table(data.predictions.slice(0, 50))
        });
    }

function render_table(tmp_data) {
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

