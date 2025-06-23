document.addEventListener('DOMContentLoaded', function() {
    const replyButtons = document.querySelectorAll('.reply-btn');

    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textarea = this.nextElementSibling;

            textarea.classList.toggle('show');
        });
    });
});