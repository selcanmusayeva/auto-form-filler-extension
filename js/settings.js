// // Populate the settings form with stored data
// chrome.storage.local.get("profileData", ({ profileData }) => {
//     if (profileData) {
//       document.getElementById("name").value = profileData.name || "";
//       document.getElementById("experience").value = profileData.experience.join("\n") || "";
//       document.getElementById("education").value = profileData.education.join("\n") || "";
//       document.getElementById("skills").value = profileData.skills.join("\n") || "";
//     }
//   });
  
//   // Save modified data back to local storage
//   document.getElementById("save-button").addEventListener("click", () => {
//     const updatedData = {
//       name: document.getElementById("name").value,
//       experience: document.getElementById("experience").value.split("\n"),
//       education: document.getElementById("education").value.split("\n"),
//       skills: document.getElementById("skills").value.split("\n"),
//     };
  
//     chrome.storage.local.set({ profileData: updatedData }, () => {
//       alert("Profile data updated successfully!");
//     });
//   });
  