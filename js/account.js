document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("accounts-dropdown");
  const statusMessage = document.getElementById("status-message");
  const form = document.getElementById("add-account-form");
  const linkedinIdInput = document.getElementById("linkedinId");
  const nameInput = document.getElementById("name");
  const proceedButton = document.getElementById("proceed-button");

  dropdown.addEventListener("change", () => {
    proceedButton.disabled = !dropdown.value;
  });

  proceedButton.addEventListener("click", function () {
    console.log(dropdown.value);
    chrome.runtime
      .sendMessage({
        action: "SET_ACTIVE_ACCOUNT",
        data: { linkedinId: dropdown.value },
      })
      .then(() => {
        window.location.href = "index.html";
      });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const linkedinValue = linkedinIdInput.value.trim();
    const name = nameInput.value.trim();

    if (linkedinValue && name) {
      chrome.runtime.sendMessage(
        {
          action: "ADD_ACCOUNT",
          data: { linkedinId: linkedinValue, name },
        },
        (response) => {
          populateDropdown(response);
        }
      );

      linkedinIdInput.value = "";
      nameInput.value = "";
      statusMessage.textContent = "Account added successfully!";
      statusMessage.style.color = "green";
    }
  });

  const populateDropdown = (accounts) => {
    dropdown.innerHTML =
      '<option value="" disabled selected>-- Select an account --</option>';
    console.log(accounts);

    accounts.forEach((account) => {
      const option = document.createElement("option");
      option.value = account.linkedinId;
      option.textContent = account.name;
      dropdown.appendChild(option);
    });
  };

  chrome.runtime
    .sendMessage({ action: "FETCH_ACCOUNTS" })
    .then(populateDropdown);
});
