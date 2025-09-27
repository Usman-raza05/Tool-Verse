const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        const themeToggle = document.getElementById('theme-toggle');
        const convertBtn = document.getElementById('convertBtn');
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalClose = document.getElementsByClassName('modal-close')[0];
        const toggleHandle = document.querySelector('.toggle-handle');
        let images = [];

        imageInput.addEventListener('change', function(event) {
            images = [];
            imagePreview.innerHTML = '';
            const files = event.target.files;

            if (files.length === 0) {
                imagePreview.innerHTML = '<p class="placeholder-text">Selected images will appear here.</p>';
                return;
            }

            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';

                    const img = new Image();
                    img.src = e.target.result;
                    img.alt = file.name;
                    img.onclick = () => {
                        imageModal.style.display = 'flex';
                        modalImage.src = e.target.result;
                    };
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-btn';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.onclick = (e) => {
                        e.stopPropagation();
                        images.splice(index, 1);
                        previewItem.remove();
                        if (imagePreview.children.length === 0) {
                            imagePreview.innerHTML = '<p class="placeholder-text">Selected images will appear here.</p>';
                        }
                    };

                    previewItem.appendChild(img);
                    previewItem.appendChild(removeBtn);
                    imagePreview.appendChild(previewItem);
                    images.push({ src: e.target.result, name: file.name });
                };
                reader.readAsDataURL(file);
            });
        });

        convertBtn.addEventListener('click', function() {
            convertBtn.disabled = true;
            convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin loading-icon"></i> Converting...';

            const { jsPDF } = window.jspdf;

            if (images.length === 0) {
                alert('Please select at least one image!');
                convertBtn.disabled = false;
                convertBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Convert to PDF';
                return;
            }

            const pdf = new jsPDF();
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            let imagesProcessed = 0;
            const processImage = (index) => {
                if (index >= images.length) {
                    pdf.save('images-to-pdf.pdf');
                    convertBtn.disabled = false;
                    convertBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Convert to PDF';
                    return;
                }

                const image = images[index];
                const img = new Image();
                img.onload = () => {
                    const imgProps = pdf.getImageProperties(img);
                    const imgWidth = imgProps.width;
                    const imgHeight = imgProps.height;
                    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

                    const width = imgWidth * ratio;
                    const height = imgHeight * ratio;
                    const x = (pdfWidth - width) / 2;
                    const y = (pdfHeight - height) / 2;

                    if (index > 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(image.src, 'JPEG', x, y, width, height);

                    processImage(index + 1);
                };
                img.src = image.src;
            };

            processImage(0);
        });

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            if (isDarkMode) {
                toggleHandle.innerHTML = '<i class="fas fa-moon toggle-icon moon-icon"></i>';
            } else {
                toggleHandle.innerHTML = '<i class="fas fa-sun toggle-icon sun-icon"></i>';
            }
        });

        modalClose.onclick = () => {
            imageModal.style.display = 'none';
        };

        imageModal.onclick = (e) => {
            if (e.target.id === 'imageModal') {
                imageModal.style.display = 'none';
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageModal.style.display === 'flex') {
                imageModal.style.display = 'none';
            }
        });