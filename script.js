function checkParking() {
  const input = document.getElementById("imageInput");
  const resultText = document.getElementById("result");
  if (!input.files[0]) {
    resultText.textContent = "Please upload an image.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      const canvas = document.getElementById("preview");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      Tesseract.recognize(canvas, 'eng').then(({ data: { text } }) => {
        const now = new Date();
        const lowerText = text.toLowerCase();
        if (lowerText.includes("no parking")) {
          resultText.textContent = "❌ You can't park here.";
        } else if (lowerText.includes("2pm - 4pm") &&
                   now.getHours() >= 14 && now.getHours() < 16) {
          resultText.textContent = "❌ You can't park here (2–4 PM rule).";
        } else if (lowerText.includes("except sunday") && now.getDay() === 0) {
          resultText.textContent = "✅ You can park here (Sunday exception).";
        } else {
          resultText.textContent = "✅ Likely OK to park — no clear restrictions found.";
        }
      }).catch(err => {
        resultText.textContent = "Error reading image. Try a clearer photo.";
      });
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(input.files[0]);
}
