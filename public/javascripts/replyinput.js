document.addEventListener('DOMContentLoaded', function() {
    // Get all reply buttons on the page
    const replyButtons = document.querySelectorAll('.reply-btn');

    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the closest textarea to this button
            const textarea = this.nextElementSibling;

            // Toggle the 'show' class
            textarea.classList.toggle('show');
        });
    });
});