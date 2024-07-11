document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generate');
    const passwordSpan = document.getElementById('password');
    const passwordContainer = document.getElementById('password_container');
    const sizeInput = document.getElementById('size');
    const copyButton = document.getElementById('copy');

    const apiKey = '8qXKc3A0y+YsXHFDwLKqjg==L4spbvnoEygTek0G';  

    async function updateProcess() {
        const processName = "password";
        try {
            const response = await fetch(
                `http://localhost:4000/process/${processName}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    generateButton.addEventListener('click', async function () {
        const length = sizeInput.value || 16; // Default to 16 if no value is set
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/passwordgenerator?length=' + length,
            headers: { 'X-Api-Key': apiKey },
            contentType: 'application/json',
            success: async function (result) {
                if (result.password) {
                    passwordSpan.textContent = result.password;
                    passwordContainer.classList.add('show');
                    await updateProcess();
                }
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });

    copyButton.addEventListener('click', function () {
        const password = passwordSpan.textContent;
        navigator.clipboard.writeText(password).then(function () {
            Toastify({
                text: "Password copied to clipboard",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
        }, function () {
            console.error('Failed to copy the password');
        });
    });
});
