document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("add-application");
    const tableBody = document.querySelector("#applications-table tbody");


    loadApplications();

    addButton.addEventListener("click", () => {
        const company = document.getElementById("company-title").value.trim();
        const jobTitle = document.getElementById("job-title").value.trim();
        const dateApplied = document.getElementById("date-applied").value;
        const status = document.getElementById("status").value;

        if (!company || !jobTitle || !dateApplied || !status) {
            alert("Please fill out all fields.");
            return;
        }

        const application = {
            id: Date.now(),
            company,
            jobTitle,
            dateApplied,
            status
        };

        saveApplication(application);
        addApplicationToTable(application);
        clearForm();
    });

    function clearForm() {
        document.getElementById("company-title").value = '';
        document.getElementById("job-title").value = '';
        document.getElementById("date-applied").value = '';
        document.getElementById("status").value = 'Applied';
    }

    function saveApplication(application) {
        chrome.storage.local.get(["applications"], (result) => {
            const applications = result.applications || [];
            applications.push(application);
            chrome.storage.local.set({ applications });
        });
    }

    function loadApplications() {
        chrome.storage.local.get(["applications"], (result) => {
            const applications = result.applications || [];
            applications.forEach(addApplicationToTable);
        });
    }

    function addApplicationToTable(application) {
        const row = document.createElement("tr");


        const companyCell = document.createElement("td");
        companyCell.contentEditable = "true";
        companyCell.textContent = application.company;
        row.appendChild(companyCell);


        const jobTitleCell = document.createElement("td");
        jobTitleCell.contentEditable = "true";
        jobTitleCell.textContent = application.jobTitle;
        row.appendChild(jobTitleCell);


        const dateCell = document.createElement("td");
        dateCell.contentEditable = "true";
        dateCell.textContent = application.dateApplied;
        row.appendChild(dateCell);


        const statusCell = document.createElement("td");
        const statusSelect = document.createElement("select");
        const statuses = ["Applied", "Interviewed", "Offered", "Rejected"];
        statuses.forEach(statusOption => {
            const option = document.createElement("option");
            option.value = statusOption;
            option.textContent = statusOption;
            if (statusOption === application.status) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });
        statusCell.appendChild(statusSelect);
        row.appendChild(statusCell);


        const actionsCell = document.createElement("td");
        actionsCell.classList.add("actions");


        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.classList.add("update");
        actionsCell.appendChild(updateButton);


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete");
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        tableBody.appendChild(row);


        updateButton.addEventListener("click", () => {
            const updatedApplication = {
                id: application.id,
                company: companyCell.textContent.trim(),
                jobTitle: jobTitleCell.textContent.trim(),
                dateApplied: dateCell.textContent.trim(),
                status: statusSelect.value
            };
            updateApplication(updatedApplication);
        });


        deleteButton.addEventListener("click", () => {
            row.remove();
            deleteApplication(application.id);
        });
    }

    function updateApplication(updatedApplication) {
        chrome.storage.local.get(["applications"], (result) => {
            let applications = result.applications || [];
            applications = applications.map(app => app.id === updatedApplication.id ? updatedApplication : app);
            chrome.storage.local.set({ applications }, () => {
                alert("Application updated successfully!");
            });
        });
    }

    function deleteApplication(applicationId) {
        chrome.storage.local.get(["applications"], (result) => {
            let applications = result.applications || [];
            applications = applications.filter(app => app.id !== applicationId);
            chrome.storage.local.set({ applications });
        });
    }
});
