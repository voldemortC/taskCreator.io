var typingTimer;
var doneTypingInterval = 5000;
$('#projectName').keyup(function(){
    clearTimeout(typingTimer);
    if ($('#projectName').val()) {
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});
function doneTyping(){
  // $('#projectName').attr('readonly','readonly');
}

const getCurrentDate = (dateObj) => {
  let monthNames = ["January", "February", "March", 
    "April", "May","June","July", "August", "September", "October", "November","December"];
  return `${dateObj.getUTCDate()}-${monthNames[dateObj.getUTCMonth()]}-${dateObj.getUTCFullYear()}`
};
const createTodayUpdate = () => {
  const projectName = $('#projectName').val();
  let data = []
  $('input[name="task"]').each(function(i) { 
    if ($(this).val()) {
      data.push({ value: $(this).val(), status: ($(this).siblings().children().children().not(':checked').length > 0)? "In Progress": "Done" });
    }
  });
  let tasks= ``;
  if (data) {
    data.forEach((task) => {
      tasks += `&nbsp; &nbsp; - ${task.value} : ${task.status} <br/>`;
    })
  }
  $("#todayUpdate").html(``);
  let xhtml = "";
  xhtml = `
    Today's Update <br/>
    Dated : ${getCurrentDate(new Date())} <br/>
    ${(projectName)?'Project Name :'+projectName+',': ''} <br/>
    Tasks: <br/>
      ${tasks}
    JIRA Updated : ${($('#jiraUpdated').not(':checked').length > 0)? "No": "Yes"} <br/>
    Code Committed : ${($('#codeCommited').not(':checked').length > 0)? "No": "Yes"}
  `;
  if (tasks) {
    if (!projectName) {
      $("#todayUpdate").html(`<p class="text-danger h4">*Project Name is required!</p>`);
    } else {
      $("#todayUpdate").html(xhtml);
    }
  } else {
    $("#todayUpdate").html(`<p class="text-danger h4">*Please enter alteast one task!</p>`);
  }
};
const preventFromTyping = (e) => {
  e.preventDefault();
  return false;
};
$('#task').on('keypress', function(e) {
  if (e.keyCode == 13) {
    if ($('#task').val().trim()) 
      addTaskFields();
  } else {
    if (e.keyCode == 49) {
      $(this).siblings().children().children().prop('checked', true);
      preventFromTyping(e);
    } else if (e.keyCode == 50) {
      $(this).siblings().children().children().prop('checked', false);
      preventFromTyping(e);
    }
  }
});
const addTaskFields = () => {
  if ($('#task').val().trim()) {
    let checkedStatus = $('#task').siblings().children().children().not(':checked').length;
    checkedStatus     = (checkedStatus == 0)? 'checked': '';
    $("#fieldsContainer").append(`
      <div class="row mt-2">
        <div class="col-md-11">
          <div class="input-group mb-3">
            <input type="text" class="form-control text-light bg-secondary" placeholder="Task" name="task" aria-describedby="basic-addon1" value="${$('#task').val()}">
            <span class="input-group-text ${(checkedStatus == 'checked')? 'bg-checked-color': 'bg-warning'}" id="basic-addon1">
              <div class="form-check">
                <input class="form-check-input ${(checkedStatus == 'checked')? '': 'd-none'}" type="checkbox" ${checkedStatus}>
              </div>
            </span>
          </div>
        </div>
        <div class="col-md-1">
          <button type="button" class="btn btn-danger" onclick="removeTaskFields(this)">x</button>
        </div>
      </div>
    `);
    $('#task').val(null);
    $('#task').siblings().children().children().prop('checked', false);
  }
};
const removeTaskFields = (element) => {
  $(element).parent().parent().remove()
};