

$("select").change(function() {
    url = $("select.receptor").val() + '/' + $("select.method").val()
    console.log(url)
    $("select.receptor").val() + '/' + $("select.method").val()
    $.get(url, function(data) {
        $('div#container').html(data);
    });
});
