document.addEventListener("DOMContentLoaded", () => {
    const accountNameElement = document.getElementById("accountName");
  
    chrome.storage.local.get("accountName", (data) => {
      if (data.accountName) {
        accountNameElement.textContent = data.accountName;
      } else {
        accountNameElement.textContent = "Not found";
      }
    });
  });
  