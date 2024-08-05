document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/users');
        const users = await response.json();

        const userTableBody = document.getElementById('userTableBody');
        users.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>${user.fullname}</td>
                <td>${user.email}</td>
                <td><img src="${user.avatar}" class="avatar" alt="Avatar"></td>
                <td><a href="${user.link}" target="_blank">Link</a></td>
                <td>${user.bio}</td>
            `;

            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
