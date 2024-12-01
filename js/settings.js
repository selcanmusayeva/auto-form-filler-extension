const scrapeButton = document.getElementById("scrapeButton");
const experienceContainer = document.getElementById("experience-accordion");

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("scrapeButton")?.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "SCRAPE_DATA" },
                    (response) => {
                        console.log("Response from content script:", response);
                    }
                );
            }
        });
    });
});

function fillExperienceAccordion(experiences) {
    if (experienceContainer) {
        experienceContainer.innerHTML = "";
    }

    experiences.forEach((experience, index) => {
        const item = document.createElement("div");
        item.classList.add("accordion-item");

        const header = document.createElement("button");
        header.classList.add("accordion-header");
        header.innerText = `${experience.title} at ${experience.company}`;
        header.addEventListener("click", () => {
            details.classList.toggle("hidden");
        });

        const details = document.createElement("div");
        details.classList.add("accordion-details", "hidden");

        details.innerHTML = `
        <label>
          Company: <input type="text" value="${experience.company
            }" id="company-${index}" />
        </label>
        <label>
          Title: <input type="text" value="${experience.title
            }" id="title-${index}" />
        </label>
        <label>
          Employment Type: <input type="text" value="${experience.employmentType
            }" id="employmentType-${index}" />
        </label>
        <label>
          Start Date: 
          <input type="text" value="${experience.startDateMonth
            }" id="startDateMonth-${index}" />
          <input type="text" value="${experience.startDateYear
            }" id="startDateYear-${index}" />
        </label>
        <label>
          End Date: 
          <input type="text" value="${experience.endDateMonth || ""
            }" id="endDateMonth-${index}" />
          <input type="text" value="${experience.endDateYear || ""
            }" id="endDateYear-${index}" />
        </label>
        <label>
          Duration: <input type="text" value="${experience.duration
            }" id="duration-${index}" />
        </label>
        <label>
          Location: <input type="text" value="${experience.location || ""
            }" id="location-${index}" />
        </label>
        <label>
          Description: <textarea id="description-${index}">${experience.description || ""
            }</textarea>
        </label>
      `;

        // Add a save button to allow updates
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", () => {
            const updatedExperience = {
                company: document.getElementById(`company-${index}`)?.value,
                title: document.getElementById(`title-${index}`)?.value,
                employmentType: document.getElementById(`employmentType-${index}`)
                    ?.value,
                startDateMonth: document.getElementById(`startDateMonth-${index}`)
                    ?.value,
                startDateYear: document.getElementById(`startDateYear-${index}`)?.value,
                endDateMonth:
                    document.getElementById(`endDateMonth-${index}`)?.value || null,
                endDateYear:
                    document.getElementById(`endDateYear-${index}`)?.value || null,
                duration: document.getElementById(`duration-${index}`)?.value,
                location: document.getElementById(`location-${index}`)?.value || null,
                description:
                    document.getElementById(`description-${index}`)?.value || null,
            };
            console.log("Updated Experience:", updatedExperience);

        });

        details.appendChild(saveButton);

        item.appendChild(header);
        item.appendChild(details);
        container.appendChild(item);
    });
}
