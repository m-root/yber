$(document).on('ready page:load', function(){

  //$('.delete-order').bind('ajax:success', function() { //WHY YOU DOESN'T WORK?????
  $('.delete-order').bind('click', function(){
    $('#sidebar-current-order').replaceWith('<div id="sidebar-empty-current-order"><h4>No one order in progress</h4></div>');
    if (($('.order-box').length == 1) && (!($("#small_map").length))){
      $('.order-box').parent().html('<div class="warn-tittle-box"><h3>Sorry but you have noone order</h3>'+
        '<h4>You can create new order for this link <a href="/dashboard"> create order >></a></h4></div>');
      return;
    }
    $(this).closest('.order-box').fadeOut();
    show_message('Order was successfully destroyed.');
  });

  $('#take_order').on('click', function (e){
    e.preventDefault();
    if (!confirm("Are you sure?")) return 0;
    var id = $('#hidden_order_id').text(),
        that = this;
    $.ajax({
      url: "/take_order/"+id,
      type: "GET",
      success: function(data){
        $(that).replaceWith('<div class="order-box-driver-info padd-top">'+
          '<span class="order-field-title">Driver:<a class="little_padding" href="#" > '+data.name+'</a></span>'+
          '<ul><li>email:<span class="little_padding">'+data.email+'</span></li>'+
          '<li>phone number:<span class="little_padding">'+data.phone+'</span></li>'+
          '<li>license_plate:<span class="little_padding">'+data.license_plate+'</span></li></ul>'+
          '<div class="col-md-12 tright">accepted at:<span class="little_padding">'+data.date+' </span></div></div>');
        change_status($('div.yellow-line'), 1);
        $('#sidebar-empty-current-order').replaceWith('<div id="sidebar-current-order"><div class="row">'+
          '<div class="col-md-3 col-sm-4 col-xs-12 head">STATUS:</div><div class="col-md-9 col-sm-8 col-xs-12">accepted</div></div>'+
          '<div class="row"><div class="col-md-3 col-sm-4 col-xs-12 head">FROM:</div><div class="col-md-9 col-sm-8 col-xs-12">'+$('#order-field-mfrom').text()+'</div></div>'+
          '<div class="row"><div class="col-md-3 col-sm-4 col-xs-12 head">TO:</div><div class="col-md-9 col-sm-8 col-xs-12">'+$('#order-field-mto').text()+'</div></div>'+
          '<div class="row"><div class="col-md-12 col-sm-12 col-xs-12"><span class="head">ADDITIONAL INFORMATION:</span><span class=little_padding">'+$('#order-field-description').text()+'</span></div>'+
          '<div class="row"><div class="col-md-3 col-sm-4 col-xs-12 tright"></div><a href="#">more..</a></div>'
          );
      }
    });
  });

  $('#complete_order').on('click', function (e){
    e.preventDefault();
    if (!confirm("Are you sure?")) return 0;
    var id = $('#hidden_order_id').text(),
        that = this;
    $.ajax({
      url: "/complete_order/"+id,
      type: "GET",
      success: function(data){
        $(that).remove();
        change_status($('div.green-line'), 2);
        $('#updated_date span:first-child').text('complited');
        $('.show-order-title').remove();
        $('#sidebar-current-order').replaceWith('<div id="sidebar-empty-current-order"><h4>No one order in progress</h4></div>');
        $('#updated_date span:last-child').text(data.date);
        show_message(data.notice);
      }
    });
  });

  // $('form#new_order').on('submit', function (e){
  //   e.preventDefault();
  //   var form   = $(e.target),
  //     action = form.attr('action'),
  //     method = form.attr('method'),
  //     params = form.serializeArray();
  //   $.ajax({
  //     method: method,
  //     url: action + '.json',
  //     data: params
  //   }).success( function(data) {
  //     $("#myModal").modal('hide');
  //     var message = "Order was created successfully.<br/> <a href='/dashboard/trips/"+data.id+"' title='link to created order' alt='link to created order'> Show created order >> </a>"
  //     show_message(message);
  //     // location.reload();
  //   }).fail( function(data) {
  //     var errors = jQuery.parseJSON(data.responseText).errors
  //     var error_message = "ERROR: Order wasn't created successfully."
  //     for (var property in errors) {
  //       error_message += '<br/>' + property;
  //       var key_errors_array = errors[property]
  //       for (var i in key_errors_array) {
  //         error_message += ': ' + key_errors_array[i];
  //       }
  //     }
  //     $("#myModal").modal('hide');
  //     show_message(error_message, 'alert');
  //   });
  // });

  function change_status(el, new_status){
    el.removeAttr("class");
    switch (new_status) {
      case 0:  //pending
        el.addClass('col-md-4 col-sm-6 col-xs-6 status yellow-line');
        el.text('pending');
        break;
      case 1:  //accepted
        el.addClass('col-md-4 col-sm-6 col-xs-6 status green-line');
        el.text('accepted');
        break;
      case 2:  //complited
        el.addClass('col-md-4 col-sm-6 col-xs-6 status grey-line');
        el.text('complited');
        break;
      default:
        console.log('ERROR: parameters are not correct');
    }
  }

  window.warn_message = function(el){
    if (el.text().replace(/\s{2,}/g, '').length != 0){
      el.fadeIn(3000).delay(3000).fadeOut(3000);
    }
  }

  window.show_message = function(mbody, type){
    if (type){
      var el = $('.alert');
    } else {
      var el = $('.notice');
    }
    el.empty();
    el.append(mbody);
    warn_message(el);
  }

  warn_message($('.notice'));
  warn_message($('.alert'));
});