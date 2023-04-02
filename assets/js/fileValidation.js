const fileInput = document.getElementById("photo");
const invalid = document.querySelector(".file-validation");
const validType = ["image/jpeg", "image/png", "image/jpg"];
let maxSize = 0;

fileInput.addEventListener("change", () => {
  invalid.style.color = "tomato";

  // file length check
  if (fileInput.files.length > 4) {
    invalid.innerHTML = "You can not add more than 4";
    fileInput.value = "";
  } else {
    // file type check
    for (let i = 0; i < fileInput.files.length; i++) {
      if (!validType.includes(fileInput.files[i].type)) {
        invalid.innerHTML = `You can't add ${fileInput.files[i].type},
            please add jpg,png or jpeg`;
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
      invalid.innerHTML = `Total size must be less than 5MB`;
      fileInput.value = "";
      maxSize = 0;
    } else {
      invalid.innerHTML = "";
    }
  }
});
