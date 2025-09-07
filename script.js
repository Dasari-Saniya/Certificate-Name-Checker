document.addEventListener("DOMContentLoaded", () => {
  // Setup pdf.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

  const nameInput = document.getElementById("name");
  const pdfInput = document.getElementById("file");
  const checkBtn = document.getElementById("checkBtn");
  const output = document.getElementById("result");

  // Extract text from PDF
  async function extractText(file) {
    const pdfData = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str).join(" ");
      text += strings + " ";
    }
    return text.trim();
  }

  // Main check function
  checkBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim().toLowerCase();
    const file = pdfInput.files[0];

    if (!name || !file) {
      output.textContent = "Please enter a name and upload a PDF.";
      output.className = "invalid";
      return;
    }

    output.textContent = "Checking...";
    output.className = "";

    try {
      const text = await extractText(file);

      if (text.toLowerCase().includes(name)) {
        output.textContent = "✅ Valid Certificate: Name found!";
        output.className = "valid";
      } else {
        output.textContent = "❌ Invalid Certificate: Name not found.";
        output.className = "invalid";
      }
    } catch (err) {
      console.error(err);
      output.textContent = "Error reading PDF. Make sure it has selectable text.";
      output.className = "invalid";
    }
  });
});
