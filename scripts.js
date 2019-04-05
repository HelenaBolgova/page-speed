(function () {
    jQuery(function($) {

        var inputUrl,
            checkUrl,
            inputKey;

        $(window).ready(function() {
            $('#key').val(localStorage.getItem('#key'));
        });

        $('#form').submit(function( event ) {
            event.preventDefault();
            $('.js-submit').addClass('preload');
            inputKey = $('.js-addKey').val();
            localStorage.setItem('#key', inputKey);

            if(inputKey.length > 0) {
                inputKey = '&key=' + inputKey
            }

            inputUrl = $('.js-urlCollect').val().split('\n');
            for (var i = 0; i < inputUrl.length; i++) {
                checkUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + inputUrl[i] + inputKey;
                var $resultStr = $('<tr/>');
                getResult(checkUrl, $resultStr);
            }
        });

        function getResult(url, $elem) {
            $.when($.ajax({
                url: url + '&strategy=desktop'
            })

            ).then(function (data) {
                $elem.append(
                    $('<td/>', {
                        text: data.responseCode === 404 ? '(NOT FOUND) ' + data.id : data.id,
                        class: data.responseCode === 404 ? 'error' : ''
                    }),
                    $('<td/>', {
                        text: data.lighthouseResult.categories.performance.score*100
                    }),
                    $('<td/>', {
                        text: data.lighthouseResult.audits['first-contentful-paint'].displayValue
                    }),
                    $('<td/>', {
                        text: data.lighthouseResult.audits['interactive'].displayValue
                    })
                );
                $.ajax({
                    url: url + '&strategy=mobile'
                }).done(function (msg) {
                    $elem.append(
                        $('<td/>', {
                            text: msg.lighthouseResult.categories.performance.score*100
                        }),
                        $('<td/>', {
                            text: msg.lighthouseResult.audits['first-contentful-paint'].displayValue
                        }),
                        $('<td/>', {
                            text: msg.lighthouseResult.audits['interactive'].displayValue
                        })
                    ).appendTo('tbody');
                    console.table(msg.lighthouseResult.audits);
                });

            }, function (fail) {
                $('<tr/>').appendTo('tbody').append(
                    $('<td/>', {
                        text: url,
                        class: 'error'
                    }),
                    $('<td/>', {
                        text: fail.responseJSON.error.message
                    }),
                    $('<td/>', {
                        text: fail.responseJSON.error.message
                    }),
                    $('<td/>', {
                        text: fail.responseJSON.error.message
                    }),
                    $('<td/>', {
                        text: fail.responseJSON.error.message
                    }),
                    $('<td/>', {
                        text: fail.responseJSON.error.message
                    }),
                    $('<td/>', {
                        text: fail.responseJSON.error.message
                    })
                )
            });

            $(document).ajaxStop(function() {
                $('.js-submit').removeClass('preload');
            });
        }

        $('.js-btnExport').click(function(e) {
            window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('.js-tableData').html()));
            e.preventDefault();
        });

    });
})();
