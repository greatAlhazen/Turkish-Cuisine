const fileInput = document.getElementById("photo");
const invalid = document.querySelector(".file-validation");
const validType = ["image/jpeg", "image/png", "image/jpg"];
let maxSize = 0;

fileInput.addEventListener("change", () => {
  invalid.style.color = "tomato";

  // file length check
  if (fileInput.files.length > 4) {
    invalid.innerHTML = "Dörten fazla resim giremezsin";
    fileInput.value = "";
  } else {
    // file type check
    for (let i = 0; i < fileInput.files.length; i++) {
      if (!validType.includes(fileInput.files[i].type)) {
        invalid.innerHTML = `${fileInput.files[i].type} tipte değer giremezsin,
        lütfen png,jpeg veya jpg ekle`;
        fileInput.value = "";
      } else {
        invalid.innerHTML = "";
      }
      if (fileInput.files[i].size) {
        maxSize += fileInput.files[i].size;
      }
    }
    // max size check
    if (maxSize > 1024 * 1024 * 5) {
      invalid.innerHTML = `Toplam boyut 5MB tan fazla olmamalıdır`;
      fileInput.value = "";
      maxSize = 0;
    } else {
      invalid.innerHTML = "";
    }
  }
});
