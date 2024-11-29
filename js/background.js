const getExistingAccounts = async ()=> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(
        ["savedAccounts"],
        (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve(result.savedAccounts || []);
          }
        }
      );
    });
  };
  
  const addAccount = async (event) => {
    event.preventDefault();
    const linkedinIdInput = document.getElementById(
      "linkedinId"
    ) 
    const nameInput = document.getElementById("name")
    const newAccount= {
      linkedinId: linkedinIdInput.value.trim(),
      name: nameInput.value.trim(),
    };
  
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action == "fetchAccounts") {
        getExistingAccounts().then(sendResponse);
        return true;
      }
  
      if (message.action == "addAccount") {
        const data = message.data;
        addAccount(data);
        return true;
      }
    });
  };
  