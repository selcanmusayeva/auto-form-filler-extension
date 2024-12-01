document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("button");
  
    chrome.runtime.sendMessage({ action: "GET_ACTIVE_ACCOUNT" }, (result) => {
      document.addEventListener("DOMContentLoaded", () => {
  
        button.addEventListener("click", () => {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              if (tabs.length > 0) {
                button.addEventListener("click", () => {
                  chrome.runtime.sendMessage(
                    { action: "FILL_FORM" },
                    (response) => {
                      console.log(response.status);
                    }
                  );
                });
              }
            }
          );
        });
      });
    });
  });
  