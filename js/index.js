const getAccount = async () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("activeAccount", (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(result.activeAccount || "");
        }
      });
    });
  };
  
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const activeAccount = await getAccount();
  
      if (!activeAccount) {
        window.location.href = "account.html";
      } else {
        const accountNameElement = document.querySelector("#account-name");
        if (accountNameElement) {
          accountNameElement.textContent = activeAccount.name;
        }
        console.log("Active Account:", activeAccount);
      }
    } catch (error) {
      console.error("Error checking active account:", error);
    }
  });
  