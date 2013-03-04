
reload_data = function() {
    url = $("select.receptor").val() + '/' + $("select.method").val()
    console.log(url)
    $("select.receptor").val() + '/' + $("select.method").val()
    $.get(url, function(data) {
        $('div#container').html(data);
    });
}

$("select").change(reload_data);
$(reload_data)