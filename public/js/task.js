$(document).ready(function() {
	$('#example-getting-started').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true
	});
	$(".delete").click( e => {
		let _id = $(e.currentTarget).attr("_id")
		$.post('task/delete', {_id: _id}).done(_ => {
			$("#" + _id).remove()
		}).fail(_ => {
			console.log("error")
		});
	})
})