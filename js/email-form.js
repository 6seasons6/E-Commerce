// Function to handle form submission via AJAX
function sendEmail(event) {
    event.preventDefault();  // Prevent the default form submission

    // Clear previous error messages
    document.getElementById('responseMessage').innerHTML = '';
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach((el) => {
        el.innerHTML = '';
    });

    // Get the form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    let isValid = true;

    // Validation: Check if any field is empty
    if (!formData.name) {
        document.getElementById('nameError').innerHTML = 'Name is required';
        isValid = false;
    }

    if (!formData.email) {
        document.getElementById('emailError').innerHTML = 'Email is required';
        isValid = false;
    }

    if (!formData.subject) {
        document.getElementById('subjectError').innerHTML = 'Subject is required';
        isValid = false;
    }

    if (!formData.message) {
        document.getElementById('messageError').innerHTML = 'Message is required';
        isValid = false;
    }

    // If any field is empty, stop the form submission
    if (!isValid) {
        return;
    }

    // Send data via AJAX if all fields are valid
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/send-message',  // Ensure this URL matches your backend
        data: JSON.stringify(formData),  // Convert the data to JSON format
        contentType: 'application/json',  // Ensure the server expects JSON
        success: function(response) {
            // On success, show a success message
            document.getElementById('responseMessage').innerHTML = '<p>Message sent successfully!</p>';
            document.getElementById('responseMessage').style.color = 'green';
        },
        error: function(error) {
            // On error, show an error message
            document.getElementById('responseMessage').innerHTML = '<p>There was an error. Please try again later.</p>';
            document.getElementById('responseMessage').style.color = 'red';

            // Log the error for debugging purposes
            console.error('Error:', error);
        }
    });
}
