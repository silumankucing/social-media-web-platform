document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Registration successful!');
        } else {
            alert('Registration failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed!');
    }
});
