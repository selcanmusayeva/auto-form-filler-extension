const successMessage = document.querySelector(
  "#success-message"
)
const failMessage = document.querySelector("#fail-message")

document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage(
    { action: "GET_ACTIVE_ACCOUNT" },
    function (result) {
      if (result && result.data) {
        const data = result.data;
        fillName(data.fullName || "");
        fillPersonalSummary(data.personalSummary || "");
        fillSkills(data.skills || []);
        fillExperienceAccordion(data.experience || []);
        fillEducationAccordion(data.education || []);
        fillCertificatesAccordion(data.certificates || []);
        fillPortfolioLinksAccordion(data.portfolioLinks || []);
      }
    }
  );

  document.getElementById("scrapeButton")?.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "SCRAPE_DATA" },
          (response) => {
            const successs = response.success ?? false;
            if (successs) {
              const data = response.data;
              fillName(data.fullName || "");
              fillPersonalSummary(data.personalSummary || "");
              fillSkills(data.skills || []);
              fillExperienceAccordion(data.experience || []);
              fillEducationAccordion(data.education || []);
            }
          }
        );
      }
    });
  });

  document
    .getElementById("add-experience-button")
    ?.addEventListener("click", () => {
      addExperienceAccordionItem();
    });

  document
    .getElementById("add-education-button")
    ?.addEventListener("click", () => {
      addEducationAccordionItem();
    });

  document
    .getElementById("add-certificate-button")
    ?.addEventListener("click", () => {
      addCertificateAccordionItem();
    });

  document
    .getElementById("add-portfolio-link-button")
    ?.addEventListener("click", () => {
      addPortfolioLinkAccordionItem();
    });

  document
    .getElementById("profile-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      // Collect data from form fields
      const nameInput = document.getElementById("name");
      const personalSummaryInput = document.getElementById(
        "personal-summary"
      ) ;
      const skillsInput = document.getElementById(
        "skills"
      ) 

      const fullName = nameInput.value;
      const personalSummary = personalSummaryInput.value;
      const skills = skillsInput.value.split(",").map((s) => s.trim());

      const experiences = collectExperienceData();
      const educations = collectEducationData();
      const certificates = collectCertificatesData();
      const portfolioLinks = collectPortfolioLinksData();

      const data = {
        fullName,
        personalSummary,
        skills,
        experience: experiences,
        education: educations,
        certificates,
        portfolioLinks,
      };

      // Send data to background script to save
      chrome.runtime.sendMessage(
        { action: "UPDATE_CURRENT_DATA", data },
        (response) => {
          if (response && response.success) {
            if (successMessage) {
              successMessage.classList.remove("hidden");
              setTimeout(() => {
                successMessage.classList.add("hidden");
              }, 3000);
            }
          } else {
            if (failMessage) {
              failMessage.classList.remove("hidden");
              setTimeout(() => {
                failMessage.classList.add("hidden");
              }, 3000);
            }
          }
        }
      );
    });
});

// Fill functions
function fillName(name) {
  const nameInput = document.getElementById("name")
  if (nameInput) {
    nameInput.value = name;
  }
}

function fillPersonalSummary(summary) {
  const summaryInput = document.getElementById(
    "personal-summary"
  )
  if (summaryInput) {
    summaryInput.value = summary;
  }
}

function fillSkills(skillsArray) {
  const skillsInput = document.getElementById("skills") 
  if (skillsInput) {
    skillsInput.value = skillsArray.join(", ");
  }
}

function fillExperienceAccordion(experienceArray) {
  const container = document.getElementById("experience-accordion");
  if (container) {
    container.innerHTML = "";
    experienceArray.forEach((experience, index) => {
      const item = createExperienceAccordionItem(experience, index);
      container.appendChild(item);
    });
  }
}

function fillEducationAccordion(educationArray) {
  const container = document.getElementById("education-accordion");
  if (container) {
    container.innerHTML = "";
    educationArray.forEach((education, index) => {
      const item = createEducationAccordionItem(education, index);
      container.appendChild(item);
    });
  }
}

function fillCertificatesAccordion(certificatesArray) {
  const container = document.getElementById("certificates-accordion");
  if (container) {
    container.innerHTML = "";
    certificatesArray.forEach((certificate, index) => {
      const item = createCertificateAccordionItem(certificate, index);
      container.appendChild(item);
    });
  }
}

function fillPortfolioLinksAccordion(portfolioLinksArray) {
  const container = document.getElementById("portfolio-links-accordion");
  if (container) {
    container.innerHTML = "";
    portfolioLinksArray.forEach((portfolioLink, index) => {
      const item = createPortfolioLinkAccordionItem(portfolioLink, index);
      container.appendChild(item);
    });
  }
}

function createExperienceAccordionItem(experience, index ) {
  const item = document.createElement("div");
  item.classList.add("accordion-item");

  const header = document.createElement("div");
  header.classList.add("accordion-header");
  header.textContent = experience.title || `Experience ${index + 1}`;
  header.addEventListener("click", () => {
    content.classList.toggle("active");
  });

  const content = document.createElement("div");
  content.classList.add("accordion-content");

  const fields = [
    { label: "Company:", name: "company", value: experience.company },
    { label: "Title:", name: "title", value: experience.title },
    {
      label: "Employment Type:",
      name: "employmentType",
      value: experience.employmentType,
    },
    {
      label: "Start Date Month:",
      name: "startDateMonth",
      value: experience.startDateMonth,
    },
    {
      label: "Start Date Year:",
      name: "startDateYear",
      value: experience.startDateYear,
    },
    {
      label: "End Date Month:",
      name: "endDateMonth",
      value: experience.endDateMonth,
    },
    {
      label: "End Date Year:",
      name: "endDateYear",
      value: experience.endDateYear,
    },
    { label: "Duration:", name: "duration", value: experience.duration },
    { label: "Location:", name: "location", value: experience.location },
    {
      label: "Location Type:",
      name: "locationType",
      value: experience.locationType,
    },
    {
      label: "Description:",
      name: "description",
      value: experience.description,
    },
  ];

  fields.forEach((field) => {
    if (field.name === "description") {
      const textAreaField = createTextArea(
        field.label,
        field.name,
        field.value || ""
      );
      content.appendChild(textAreaField);
    } else {
      const inputField = createInputField(
        field.label,
        field.name,
        field.value || ""
      );
      content.appendChild(inputField);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    item.remove();
  });

  content.appendChild(deleteButton);

  item.appendChild(header);
  item.appendChild(content);
  return item;
}

function createEducationAccordionItem(education, index) {
  const item = document.createElement("div");
  item.classList.add("accordion-item");

  const header = document.createElement("div");
  header.classList.add("accordion-header");
  header.textContent = education.school || `Education ${index + 1}`;
  header.addEventListener("click", () => {
    content.classList.toggle("active");
  });

  const content = document.createElement("div");
  content.classList.add("accordion-content");

  const fields = [
    { label: "School:", name: "school", value: education.school },
    { label: "Degree:", name: "degree", value: education.degree },
    {
      label: "Field of Study:",
      name: "fieldOfStudy",
      value: education.fieldOfStudy,
    },
    {
      label: "Start Date Month:",
      name: "startDateMonth",
      value: education.startDateMonth,
    },
    {
      label: "Start Date Year:",
      name: "startDateYear",
      value: education.startDateYear,
    },
    {
      label: "End Date Month:",
      name: "endDateMonth",
      value: education.endDateMonth,
    },
    {
      label: "End Date Year:",
      name: "endDateYear",
      value: education.endDateYear,
    },
    { label: "Grade:", name: "grade", value: education.grade },
    {
      label: "Description:",
      name: "description",
      value: education.description,
    },
  ];

  fields.forEach((field) => {
    if (field.name === "description") {
      const textAreaField = createTextArea(
        field.label,
        field.name,
        field.value || ""
      );
      content.appendChild(textAreaField);
    } else {
      const inputField = createInputField(
        field.label,
        field.name,
        field.value || ""
      );
      content.appendChild(inputField);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    item.remove();
  });

  content.appendChild(deleteButton);

  item.appendChild(header);
  item.appendChild(content);
  return item;
}

function createCertificateAccordionItem(
  certificate,
  index
) {
  const item = document.createElement("div");
  item.classList.add("accordion-item");

  const header = document.createElement("div");
  header.classList.add("accordion-header");
  header.textContent = certificate.name || `Certificate ${index + 1}`;
  header.addEventListener("click", () => {
    content.classList.toggle("active");
  });

  const content = document.createElement("div");
  content.classList.add("accordion-content");

  const fields = [
    { label: "Name:", name: "name", value: certificate.name },
    { label: "Issuer:", name: "issuer", value: certificate.issuer },
    { label: "Date:", name: "date", value: certificate.date },
    {
      label: "Description:",
      name: "description",
      value: certificate.description,
    },
  ];

  fields.forEach((field) => {
    if (field.name === "description") {
      const textAreaField = createTextArea(
        field.label,
        field.name,
        field.value || ""
      );
      content.appendChild(textAreaField);
    } else {
      const inputField = createInputField(
        field.label,
        field.name,
        field.value || ""
      );
      content.appendChild(inputField);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    item.remove();
  });

  content.appendChild(deleteButton);

  item.appendChild(header);
  item.appendChild(content);
  return item;
}

function createPortfolioLinkAccordionItem(
  portfolioLink,
  index
) {
  const item = document.createElement("div");
  item.classList.add("accordion-item");

  const header = document.createElement("div");
  header.classList.add("accordion-header");
  header.textContent = portfolioLink.title || `Portfolio Link ${index + 1}`;
  header.addEventListener("click", () => {
    content.classList.toggle("active");
  });

  const content = document.createElement("div");
  content.classList.add("accordion-content");

  const fields = [
    { label: "Title:", name: "title", value: portfolioLink.title },
    { label: "URL:", name: "url", value: portfolioLink.url },
    {
      label: "Description:",
      name: "description",
      value: portfolioLink.description,
    },
  ];

  fields.forEach((field) => {
    if (field.name === "description") {
      const textAreaField = createTextArea(
        field.label,
        field.name,
        field.value || ""
      );
      content.appendChild(textAreaField);
    } else {
      const inputField = createInputField(
        field.label,
        field.name,
        field.value || ""
      );
      content.appendChild(inputField);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    item.remove();
  });

  content.appendChild(deleteButton);

  item.appendChild(header);
  item.appendChild(content);
  return item;
}

function addExperienceAccordionItem() {
  const container = document.getElementById("experience-accordion");
  console.log(container);
  if (container) {
    const index = container.querySelectorAll(".accordion-item").length;
    const experience = {
      company: "",
      title: "",
      employmentType: "",
      startDateMonth: "",
      startDateYear: "",
      duration: "",
      description: "",
      endDateMonth: "",
      endDateYear: "",
      location: "",
      locationType: "",
    };
    if (experience) {
      console.log(experience);
      const item = createExperienceAccordionItem(experience, index);
      container.appendChild(item);
    }
  }
}

function addEducationAccordionItem() {
  const container = document.getElementById("education-accordion");
  if (container) {
    const index = container.querySelectorAll(".accordion-item").length;
    const education = {
      school: "",
      degree: "",
      description: "",
      endDateMonth: "",
      endDateYear: "",
      fieldOfStudy: "",
      grade: "",
      startDateMonth: "",
      startDateYear: "",
    };
    if (education) {
      const item = createEducationAccordionItem(education || {}, index);
      container.appendChild(item);
    }
  }
}

function addCertificateAccordionItem() {
  const container = document.getElementById("certificates-accordion");
  if (container) {
    const index = container.querySelectorAll(".accordion-item").length;
    const certificate = {
      name: "",
      date: "",
      description: "",
      issuer: "",
    };
    if (certificate) {
      const item = createCertificateAccordionItem(certificate || {}, index);
      container.appendChild(item);
    }
  }
}

function addPortfolioLinkAccordionItem() {
  const container = document.getElementById("portfolio-links-accordion");
  if (container) {
    const index = container.querySelectorAll(".accordion-item").length;
    const portfolioLink = {
      title: "",
      url: "",
      description: "",
    };
    if (portfolioLink) {
      const item = createPortfolioLinkAccordionItem(portfolioLink || {}, index);
      container.appendChild(item);
    }
  }
}

// Create input fields
function createInputField(
  labelText,
  inputName,
  inputValue
) {
  const container = document.createElement("div");
  container.style.width = "100%";

  const label = document.createElement("label");
  label.textContent = labelText;
  label.style.display = "block";
  label.style.marginTop = "0.5rem";

  const input = document.createElement("input");
  input.type = "text";
  input.setAttribute("data-field", inputName);
  input.value = inputValue || "";
  input.style.width = "90%";

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

function createTextArea(
  labelText,
  inputName,
  inputValue
) {
  const container = document.createElement("div");
  container.style.width = "100%";

  const label = document.createElement("label");
  label.textContent = labelText;
  label.style.display = "block";
  label.style.marginTop = "0.5rem";

  const input = document.createElement("textarea");
  input.setAttribute("data-field", inputName);
  input.value = inputValue || "";
  input.style.width = "90%";
  input.style.maxWidth = "90%";

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

// Data collection functions
function collectExperienceData() {
  const experiences = [];
  const container = document.getElementById("experience-accordion");
  if (container) {
    const items = container.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const content = item.querySelector(".accordion-content");
      if (content) {
        const inputs = content.querySelectorAll("input, textarea");
        const experience = {};
        inputs.forEach((input) => {
          const fieldName = input.getAttribute("data-field");
          const value = (input ).value;
          experience[fieldName] = value;
        });
        if (experience.title) {
          experiences.push(experience);
        }
      }
    });
  }
  return experiences;
}

function collectEducationData() {
  const educations= [];
  const container = document.getElementById("education-accordion");
  if (container) {
    const items = container.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const content = item.querySelector(".accordion-content");
      if (content) {
        const inputs = content.querySelectorAll("input, textarea");
        const education = {};
        inputs.forEach((input) => {
          const fieldName = input.getAttribute("data-field");
          const value = (input).value;
          education[fieldName] = value;
        });
        educations.push(education);
      }
    });
  }
  return educations;
}

function collectCertificatesData() {
  const certificates = [];
  const container = document.getElementById("certificates-accordion");
  if (container) {
    const items = container.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const content = item.querySelector(".accordion-content");
      if (content) {
        const inputs = content.querySelectorAll("input, textarea");
        const certificate = {};
        inputs.forEach((input) => {
          const fieldName = input.getAttribute("data-field");
          const value = (input).value;
          certificate[fieldName] = value;
        });
        certificates.push(certificate);
      }
    });
  }
  return certificates;
}

function collectPortfolioLinksData() {
  const portfolioLinks= [];
  const container = document.getElementById("portfolio-links-accordion");
  if (container) {
    const items = container.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const content = item.querySelector(".accordion-content");
      if (content) {
        const inputs = content.querySelectorAll("input, textarea");
        const portfolioLink  = {};
        inputs.forEach((input) => {
          const fieldName = input.getAttribute("data-field");
          const value = (input).value;
          portfolioLink[fieldName] = value;
        });
        portfolioLinks.push(portfolioLink);
      }
    });
  }
  return portfolioLinks;
}
