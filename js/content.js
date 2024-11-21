// const nameDiv = document.querySelector(".npiJhzMllNjLdTFwgmXZfuEGFbcQxAxMiJE");
// const nameh1 = nameDiv.querySelector("h1");
// console.log(nameh1.textContent);

// if (nameh1) {
//   const accountName = nameh1.textContent.trim();
//   console.log(accountName);

//   chrome.runtime.sendMessage({ action: "SET_ACCOUNT_NAME", accountName });
// } else {
//   console.error(
//     "Account name not found. Make sure this is a LinkedIn profile page."
//   );
// }

// Function to extract data from LinkedIn profile

// ).map((exp) => exp.innerText);
// profileData.education = Array.from(
//   document.querySelectorAll(".education-section li")
// ).map((edu) => edu.innerText);
// profileData.skills = Array.from(
//   document.querySelectorAll(".pv-skill-category-entity__name-text")
// ).map((skill) => skill.innerText);
console.log("Contnet");

// const observeDOM = (callback) => {
//   const observer = new MutationObserver((mutations, obs) => {
window.onload = function () {
  setTimeout(() => {
    const profileName = document.querySelector("h1").textContent;

    const experienceContainer = document.querySelectorAll(
      "section[data-view-name=profile-card]"
    )[3].lastElementChild.firstElementChild;
    console.log(profileName);
    console.log(experienceContainer);
  }, 3000);
};
