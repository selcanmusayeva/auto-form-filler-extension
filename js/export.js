document.addEventListener("DOMContentLoaded", () => {
    const exportButton = document.getElementById("export-button");
    const importButton = document.getElementById("import-button");
    const importFileInput = document.getElementById("import-file-input");
    const importStatus = document.getElementById("import-status");
    const emailButton = document.getElementById("email-button");
  
    exportButton.addEventListener("click", () => {
      chrome.storage.local.get(["savedAccounts", "activeAccount"], (items) => {
        const dataStr = JSON.stringify(items, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
  
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "linkedin_data.json";
        downloadLink.click();
  
        URL.revokeObjectURL(url);
      });
    });
  
    importButton.addEventListener("click", () => {
      const file = importFileInput.files && importFileInput.files[0];
      console.log("Selected file:", file);
  
      if (!file) {
        importStatus.textContent = "Please select a file to import.";
        importStatus.className = "status-message error";
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = () => {
        console.log("File read successfully");
      };
  
      reader.onerror = () => {
        console.error("FileReader error:", reader.error);
        importStatus.textContent = "Error reading file.";
        importStatus.className = "status-message error";
      };
  
      reader.readAsDataURL(file);
    });
  
    emailButton.addEventListener("click", () => {
      const mailtoLink = `mailto:?subject=LinkedIn Data`;
      window.location.href = mailtoLink;
    });
  });
  