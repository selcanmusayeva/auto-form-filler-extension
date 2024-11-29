document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.getElementById("accounts-dropdown");
    const proceedButton = document.getElementById("proceed-button");
    const form = document.getElementById("add-account-form");
    const statusMessage = document.getElementById("status-message");
  
    const enableProceedButton = () => {
      proceedButton.disabled = !dropdown.value;
    };
  
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
  
    const populateDropdown = (accounts) => {
      dropdown.innerHTML =
        '<option value="" disabled selected>-- Select an account --</option>';
      accounts.forEach((account) => {
        const option = document.createElement("option");
        option.value = account.linkedinId;
        option.textContent = account.name;
        dropdown.appendChild(option);
      });
    };
  
    const addAccount = async (event) => {
      event.preventDefault();
      const linkedinIdInput = document.getElementById("linkedinId");
      const nameInput = document.getElementById("name");
      const newAccount = {
        linkedinId: linkedinIdInput.value.trim(),
        name: nameInput.value.trim(),
      };
  
      const accounts = await getExistingAccounts();
      accounts.push(newAccount);
  
      chrome.storage.local.set({ savedAccounts: accounts }, () => {
        populateDropdown(accounts);
      });
  
      linkedinIdInput.value = "";
      nameInput.value = "";
      statusMessage.textContent = "Account added successfully!";
      statusMessage.style.color = "green";
    };
  
    const setActiveAccount = (linkedinId) => {
      chrome.storage.local.set({ activeAccount: linkedinId }, () => {
        statusMessage.textContent = "Active account set successfully!";
        statusMessage.style.color = "green";
  
        window.location.href = "index.html";
      });
    };
  
    const handleProceed = () => {
      const selectedAccountId = dropdown.value;
      if (selectedAccountId) {
        setActiveAccount(selectedAccountId);
      }
    };
  
    // Event listeners
    dropdown.addEventListener("change", enableProceedButton);
    proceedButton.addEventListener("click", handleProceed);
    form.addEventListener("submit", addAccount);
  
    // Initialize dropdown
    getExistingAccounts()
      .then(populateDropdown)
      .catch((error) => console.error("Error fetching accounts:", error));
  });
  