const cron = require("node-cron");
const axios = require("axios");
const cheerio = require("cheerio");
const Job = require("../models/Job");

exports.jobScraper = () => {
  // schedule the job to run every 12 hours
  cron.schedule("0 */12 * * *", async () => {
    console.log(
      `🔄 Running daily job scraper... at ${new Date().toLocaleString()}`
    );

    try {
      const url = "https://internshala.com/fresher-jobs/web-development-jobs";
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const jobs = [];
      let count = 0;

      // Iterate through each individual job posting
      $("#internship_list_container_1 .individual_internship").each(
        (index, element) => {
          // if count is 15 then break the loop
          if (count === 15) return false;

          const job = {
            title: $(element).find(".job-title-href").text().trim(),
            jobLink:
              "https://internshala.com" +
              $(element).find(".job-title-href").attr("href"),
            companyName: $(element).find(".company-name").text().trim(),
            location: $(element)
              .find(".row-1-item.locations span")
              .text()
              .trim(),
            salary: $(element).find(".mobile").text().trim(),
          };

          // if job details is not present then continue
          if (job.title === "") return;

          jobs.push(job);
          count++;
        }
      );

      // delete all jobs from the database
      await Job.deleteMany();

      // insert the jobs into the database
      await Job.insertMany(jobs);

      console.log("✅ Daily job scraper completed.");
    } catch (error) {
      console.error("❌ Error in job scraper:", error.message);
    }
  });
};
