//* Refresh Article list
$('#refresh-articles').on('click', function() {
   // Do a POST method and pass the data to the route
   $.ajax({
      method: 'GET',
      url: '/scrape',
   })
   .then(() => {
      location.reload();
   });
});

//* Submit comment to DB
$('#form-submit').on('click', function() {
   // Grab the ID of the article your currently on
   const thisId = $(this).attr('data-id');

   // Do a POST method and pass the data to the route
   $.ajax({
      method: 'POST',
      url: '/article/' + thisId,
      data: {
         body: $('#form-body').val(),
         commenter: $('#form-name').val()
      }
   })
   .then(() => {
      location.reload();
   });
});

//* Delete comment from DB
$('.comment-delete').on('click', function() {
   // Grab the ID of the comment
   const thisId = $(this).attr('data-id');

   // DO a DELETE method with the id added at the end of the url
   $.ajax({
      method: 'DELETE',
      url: '/delete/' + thisId
   })
   .then(() => {
      location.reload();
   });
});