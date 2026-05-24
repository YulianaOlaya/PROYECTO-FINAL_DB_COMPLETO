document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:5000';
    const postBtn = document.getElementById('postBtn');
    const resultText = document.getElementById('postSqlResult');

    postBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const name = document.getElementById('nombre').value;
        const email = document.getElementById('correo').value;
        const password = document.getElementById('contraseña').value; 

        if (!name || !email || !password) {
            resultText.innerText = "Please complete all fields.";
            resultText.style.color = "red";
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                resultText.innerText = "User registered successfully!";
                resultText.style.color = "green";
                document.getElementById('nombre').value = "";
                document.getElementById('correo').value = "";
                document.getElementById('contraseña').value = "";
            } else {
                resultText.innerText = "Error: " + (data.error || "Unable to register");
                resultText.style.color = "red";
            }
        } catch (error) {
            resultText.innerText = "Server connection error.";
            resultText.style.color = "red";
        }
    });
});