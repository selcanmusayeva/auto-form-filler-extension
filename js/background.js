const getExistingAccounts = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["savedAccounts"], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(result.savedAccounts || []);
      }
    });
  });
};

const addAccount = async ({ linkedinId, name }) => {
  const newAccount = {
    linkedinId,
    name,
    data: {},
  };

  const accounts = await getExistingAccounts();
  accounts.push(newAccount);

  chrome.storage.local.set({ savedAccounts: accounts });
  return accounts;
};

const getAccountByLinkedinId = async (linkedinId) => {
  const accounts = await getExistingAccounts();
  return accounts.find((account) => account.linkedinId === linkedinId) || null;
};

const setActiveAccount = async (data, sendResponse) => {
  try {
    const account = await getAccountByLinkedinId(data.linkedinId);
    console.log(account)

    if (!account) {
      sendResponse({ success: false, error: "Account not found" });
      return;
    }

    chrome.storage.local.set({ activeAccount: account }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({
          success: false,
          error: chrome.runtime.lastError.message,
        });
      } else {
        sendResponse({ success: true });
      }
    });
  } catch (error) {
    sendResponse({ success: false, error: "An error occurred" });
  }
};

const getActiveAccount = ()=> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("activeAccount", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(result.activeAccount || null);
      }
    });
  });
};

const getAccountt = async ()=> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      "activeAccount",
      (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(result.activeAccount || null);
        }
      }
    );
  });
};


const updateActiveAccountData = async (newData) => {
  try {
    const activeAccount = await getActiveAccount();

    if (!activeAccount) {
      throw new Error("No active account found");
    }

    const updatedAccount = {
      ...activeAccount,
      data: { ...newData },
    };

    // Save the updated active account
    await new Promise((resolve, reject) => {
      chrome.storage.local.set({ activeAccount: updatedAccount }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    });

    // Update the account in savedAccounts
    const savedAccounts = await getExistingAccounts();
    const accountIndex = savedAccounts.findIndex(
      (account) => account.linkedinId === activeAccount.linkedinId
    );

    if (accountIndex !== -1) {
      savedAccounts[accountIndex] = updatedAccount;
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ savedAccounts }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve();
          }
        });
      });
    }

    return updatedAccount;
  } catch (error) {
    throw new Error(`Error updating active account: ${error}`);
  }
};

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "FETCH_ACCOUNTS") {
    getExistingAccounts().then(sendResponse);
    return true;
  }

  if (message.action === "ADD_ACCOUNT") {
    const data = message.data;
    addAccount(data).then(sendResponse);
    return true;
  }

  if (message.action === "SET_ACTIVE_ACCOUNT") {
    const data = message.data;
    setActiveAccount(data, sendResponse);
    return true;
  }

  if (message.action === "GET_ACTIVE_ACCOUNT") {
    getAccountt().then((account) => {
      sendResponse(account ?? null);
    });
    return true;
  }

  if (message.action === "UPDATE_CURRENT_DATA") {
    const data = message.data;
    updateActiveAccountData(data)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error(error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});
