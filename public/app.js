$(document).ready(function() {
    const $taskForm = $('#task-form');
    const $taskList = $('#task-list');
    const $titleInput = $('#title');
    const $descriptionInput = $('#description');

    $taskForm.on('submit', function(e) {
        e.preventDefault();
        const title = $titleInput.val();
        const description = $descriptionInput.val();
        
        $.ajax({
            url: '/api/tasks',
            method: 'POST',
            data: JSON.stringify({ title, description }),
            contentType: 'application/json',
            success: function(response) {
                addTaskToList(response);
                $taskForm[0].reset();
            },
            error: function(xhr, status, error) {
                console.error('Error adding task:', error);
            }
        });
    });

    $taskList.on('click', '.toggle-complete', function() {
        const $button = $(this);
        const $taskItem = $button.closest('.task-item');
        const taskId = $taskItem.data('id');
        const completed = !$button.data('completed');

        $.ajax({
            url: `/api/tasks/${taskId}`,
            method: 'PUT',
            data: JSON.stringify({ completed }),
            contentType: 'application/json',
            success: function() {
                $button.text(completed ? 'Mark Incomplete' : 'Mark Complete');
                $button.data('completed', completed);
                $taskItem.toggleClass('completed', completed);
                if (completed) {
                                    $('.toggle-complete').css('background-color','green');
                                } else {
                                    $('.toggle-complete').css('background-color','#3498db');
                                }
            },
            error: function(xhr, status, error) {
                console.error('Error updating task:', error);
            }
        });
    });

    $taskList.on('click', '.delete-task', function() {
        const $taskItem = $(this).closest('.task-item');
        const taskId = $taskItem.data('id');

        $.ajax({
            url: `/api/tasks/${taskId}`,
            method: 'DELETE',
            success: function() {
                $taskItem.remove();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting task:', error);
            }
        });
    });

    function addTaskToList(task) {
        const $li = $(`
            <li class="task-item" data-id="${task.id}">
                <div class="task-content">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                </div>
                <div class="task-actions">
                    <button class="toggle-complete" data-completed="${task.completed}">
                        ${task.completed ? 'Mark Incomplete' : 'Mark Complete'};
                        
                    </button>
                    <button class="delete-task">Delete</button>
                </div>
            </li>
        `);
        $taskList.append($li);
    }
});