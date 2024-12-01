document.addEventListener("DOMContentLoaded", () => {
    const companyName = document.getElementById("companyName").textContent;
    const jobTitle = document.getElementById("jobTitle").textContent;
    const coverLetter = document.getElementById("#cover-letter");
    const generateCoverLetter = async (jobTitle, companyName) => {
      const prompt = `Write a professional cover letter applying for the position of ${jobTitle} at ${companyName}. Highlight my relevant skills and experience.`;
  
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
          "X-RapidAPI-Host": "ai-text-generator1.p.rapidapi.com",
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.7,
        }),
      };
  
      try {
        const response = await fetch(
          "https://ai-text-generator1.p.rapidapi.com/text/generation",
          options
        );
        const data = await response.json();
  
        if (response.ok) {
          coverLetter.innerText = data.text;
          console.log("Generated Cover Letter:\n", data.text);
        } else {
          console.error("API Error:", data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    document
      .querySelector("button")
      .addEventListener("click", generateCoverLetter(jobTitle, companyName));
  });
  