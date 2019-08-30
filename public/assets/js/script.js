$('#form-submit').on('click', function() {
   // grab the id of the article your currently on
   const thisId = $(this).attr('data-id');

   // Do a post passing the data entered into the form
   $.ajax({
      method: 'POST',
      url: '/article/'+thisId,
      data: {
         body: $('#form-body').val(),
         commenter: $('#form-name').val()
      }
   });
});