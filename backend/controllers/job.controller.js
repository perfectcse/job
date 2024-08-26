import { Job } from "../models/job.model.js";
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    // Check for missing fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      // Log which field is missing
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!description) missingFields.push("description");
      if (!requirements) missingFields.push("requirements");
      if (!salary) missingFields.push("salary");
      if (!location) missingFields.push("location");
      if (!jobType) missingFields.push("jobType");
      if (!experience) missingFields.push("experience");
      if (!position) missingFields.push("position");
      if (!companyId) missingFields.push("companyId");

      return res.status(400).json({
        message: `Missing fields: ${missingFields.join(", ")}`,
        success: false,
      });
    }

    //  Check if a job with the same title and companyId already exists
    const existingJob = await Job.findOne({ title, company: companyId });
    if (existingJob) {
      return res.status(400).json({
        message:
          "A job with this title already exists for the specified company.",
        success: false,
      });
    }

    // Create the new job
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(",").map((req) => req.trim()), // Ensure no extra spaces in requirements
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({
      message: "An error occurred while creating the job.",
      success: false,
    });
  }
};

// -----------------------------------------------------------------------------------------------------------

// student k liye
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// update jobs

export const updateJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const jobId = req.params.id;
    const userId = req.id;

    // Check for missing fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      // Log which field is missing
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!description) missingFields.push("description");
      if (!requirements) missingFields.push("requirements");
      if (!salary) missingFields.push("salary");
      if (!location) missingFields.push("location");
      if (!jobType) missingFields.push("jobType");
      if (!experience) missingFields.push("experience");
      if (!position) missingFields.push("position");
      if (!companyId) missingFields.push("companyId");

      return res.status(400).json({
        message: `Missing fields: ${missingFields.join(", ")}`,
        success: false,
      });
    }

    // Find the job to update
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Check if the job is owned by the current user
    if (job.created_by.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized to update this job.",
        success: false,
      });
    }

    // Update the job
    job.title = title;
    job.description = description;
    job.requirements = requirements.split(",").map((req) => req.trim());
    job.salary = Number(salary);
    job.location = location;
    job.jobType = jobType;
    job.experienceLevel = experience;
    job.position = position;
    job.company = companyId;

    // Save the updated job
    await job.save();

    return res.status(200).json({
      message: "Job updated successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({
      message: "An error occurred while updating the job.",
      success: false,
    });
  }
};
