chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log(tabs[0])
  });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "SET_ACCOUNT_NAME") {

      chrome.storage.local.set({ accountName: message.accountName }, () => {
        console.log("Account name saved:", message.accountName);
      });
    }
  });
  