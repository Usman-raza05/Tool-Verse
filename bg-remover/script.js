
        const API_KEY = "YgPHh9MiipWhXz4oR9c7iLFL";
        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        const processButton = document.getElementById('processButton');
        const processedImage = document.getElementById('processedImage');
        const downloadButton = document.getElementById('downloadButton');
        const loadingText = document.querySelector('.loading');
        const resetButton = document.getElementById('resetButton');

        imageInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });

        processButton.addEventListener('click', async function () {
            const file = imageInput.files[0];
            if (!file) {
                alert('Please upload an image first.');
                return;
            }

            loadingText.classList.remove('hidden');
            processButton.disabled = true;

            const formData = new FormData();
            formData.append("image_file", file);
            formData.append("size", "auto");

            try {
                const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                    method: "POST",
                    headers: { 'X-Api-Key': 'YgPHh9MiipWhXz4oR9c7iLFL', },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("Failed to process image");
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                processedImage.src = imageUrl;
                processedImage.style.display = 'block';
                downloadButton.href = imageUrl;
                downloadButton.classList.remove('hidden');
                resetButton.classList.remove('hidden');
            } catch (error) {
                alert(error.message);
            } finally {
                loadingText.classList.add('hidden');
                processButton.disabled = false;
            }
        });

        resetButton.addEventListener('click', function () {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
            processedImage.src = '';
            processedImage.style.display = 'none';
            downloadButton.classList.add('hidden');
            resetButton.classList.add('hidden');
            imageInput.value = '';
        });