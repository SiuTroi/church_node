document.addEventListener("DOMContentLoaded", function() {
    let collabrId;
    const deleteCollabrForm = document.forms['delete-collabr-form'];
    const btnDeleteCollabr = document.getElementById('btn-delete-collabr');

    $('#delete-collabr-modal').on('show.bs.modal', function(event) {
        const button = $(event.relatedTarget);
        collabrId = button.data("id");
        btnDeleteCollabr.addEventListener("click", function() {
        deleteCollabrForm.action = '/admin/tab/users/' + collabrId + '/delete?_method=DELETE';
        deleteCollabrForm.submit()
        })
    })
})