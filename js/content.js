// const nameDiv = document.querySelector(".npiJhzMllNjLdTFwgmXZfuEGFbcQxAxMiJE");
// const nameh1 = nameDiv.querySelector("h1");

// if (nameh1) {
//   const accountName = nameh1.textContent.trim();

//   chrome.runtime.sendMessage({ action: "SET_ACCOUNT_NAME", accountName });
// } else {
//   console.error(
//     "Account name not found. Make sure this is a LinkedIn profile page."
//   );
// }

window.onload = function () {
    const currentUrl = window.location.href;
  
    const profileUrlRegex =
      /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  
    if (profileUrlRegex.test(currentUrl)) {
      setTimeout(() => {
        const profileName = document.querySelector("h1")?.textContent;
  
        // experience
        const experinces = getExperienceList();
  
        const educations = getEducationList();
  
        // final data
        const linkedinInformation = {
          fullName: profileName || "",
          education: [],
          experinece: experinces,
          skills: [],
        };
  
        console.log(linkedinInformation);
      }, 3000);
    }
  };
  
  function getEducationList() {
    const educations = [];
    return educations;
  }
  
  function getExperienceList() {
    const experiences = [];
    const experienceElements =
      document.querySelector("#experience")?.parentElement?.lastElementChild
        ?.firstElementChild;
  
    const listItems = experienceElements?.querySelectorAll(":scope > li");
  
    listItems?.forEach((li) => {
      const isMulti =
        li.firstElementChild?.firstElementChild?.nextElementSibling
          ?.firstElementChild?.firstElementChild?.tagName === "A";
  
      if (isMulti) {
        const multiJobsList = li
          .querySelector(".pvs-entity__sub-components")
          ?.firstElementChild?.querySelectorAll(":scope > li");
  
        const pvsEntity = li.querySelector(
          ".pvs-entity__sub-components"
        )?.previousElementSibling;
  
        const companyTitle = pvsEntity?.querySelector("span")?.textContent || "";
  
        const t14Box = pvsEntity?.querySelectorAll(".t-14");
  
        const typeAndDuration = t14Box?.[0]
          ?.querySelector("span")
          ?.textContent?.split(" · ");
  
        const type = typeAndDuration?.[0];
        const duration = typeAndDuration?.[1];
  
        const locationAndType = t14Box?.[1]
          ?.querySelector("span")
          ?.textContent?.split(" · ");
  
        const location = locationAndType?.[0];
        const locationType = locationAndType?.[1];
  
        multiJobsList?.forEach((li) => {
          const t14 = li.querySelector(".t-14");
          const title =
            t14?.previousElementSibling?.querySelector("span")?.textContent;
          const dates = t14?.querySelector("span")?.textContent?.split(" - ");
          const startDates = dates?.[0];
          const endDatesAndDuration = dates?.[1];
          const endDates = endDatesAndDuration?.split(" · ");
  
          const description = li
            .querySelector("ul")
            ?.querySelector("span")?.textContent;
  
          const job = {
            company: companyTitle,
            title: title || "",
            description: description || undefined,
            endDateMonth:
              endDates?.[0] == "Present"
                ? undefined
                : endDates?.[0].split(" ")[0],
            location: location,
            endDateYear:
              endDates?.[0] == "Present"
                ? undefined
                : endDates?.[0].split(" ")[1],
            locationType: locationType,
            employmentType: type || "",
            startDateMonth: startDates?.split(" ")[0] || "",
            startDateYear: startDates?.split(" ")[1] || "",
            duration: duration || "",
          };
  
          experiences.push(job);
        });
      } else {
        const spanContainer = li.querySelectorAll(".t-14");
        const title =
          spanContainer[0].previousElementSibling?.querySelector("span")
            ?.textContent || "";
  
        const companyAndType =
          spanContainer[0].firstElementChild?.textContent?.split(" · ");
        const company = companyAndType?.[0] || "";
        const employmentType = companyAndType?.[1] || "";
  
        const dates =
          spanContainer[1].firstElementChild?.textContent?.split(" - ");
        const startDate = dates?.[0];
        const endDate = dates?.[1].split(" · ")[0];
        const duration = dates?.[1].split(" · ")[1];
  
        const locationAndType =
          spanContainer[2].firstElementChild?.textContent?.split(" · ");
        const location = locationAndType?.[0];
        const locationType = locationAndType?.[1];
  
        const description = li
          .querySelector("ul")
          ?.querySelector("span")?.textContent;
  
        const experience = {
          company,
          employmentType,
          title,
          startDateMonth: startDate?.split(" ")[0] || "",
          startDateYear: startDate?.split(" ")[1] || "",
          endDateMonth: endDate == "Present" ? undefined : endDate?.split(" ")[0],
          endDateYear: endDate == "Present" ? undefined : endDate?.split(" ")[1],
          duration: duration || "",
          location,
          locationType,
          description: description || undefined,
        };
  
        experiences.push(experience);
      }
    });
    return experiences;
  }
  