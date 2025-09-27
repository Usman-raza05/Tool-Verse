const preview = document.getElementById("preview");
    const htmlFile = document.getElementById("htmlFile");

    htmlFile.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file && file.name.endsWith(".html")) {
        const text = await file.text();
        // Strip outer tags
        const stripped = text
          .replace(/<\s*head[^>]*>[\s\S]*?<\s*\/\s*head\s*>/gi, "")
          .replace(/<\s*html[^>]*>/gi, "")
          .replace(/<\s*\/\s*html\s*>/gi, "")
          .replace(/<\s*body[^>]*>/gi, "")
          .replace(/<\s*\/\s*body\s*>/gi, "");
        preview.innerHTML = stripped;
      }
    });

    function convertToImage() {
      html2canvas(preview).then(canvas => {
        const result = document.getElementById("result");
        result.innerHTML = "";
        result.appendChild(canvas);

        const link = document.createElement("a");
        link.download = "converted.png";
        link.href = canvas.toDataURL();
        link.textContent = "Download Image";
        result.appendChild(link);
      });
    }
