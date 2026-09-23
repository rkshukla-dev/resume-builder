import Resume from "../models/resumeModel.js";
import path from 'path';
import fs from 'fs';
import { defaultResumeData } from "../templates/defaultResumeData.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createResume = asyncHandler(async (req, res) => {
    const { title } = req.body;

    const newResume = await Resume.create({
        ...defaultResumeData,
        ...req.body,
        title,
        userId: req.user._id,
    });
    res.status(201).json({
        success: true,
        message: 'Resume Created Successfully',
        data: newResume
    });
});

export const getUserResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ usedId: req.user._id }).sort({ updatedAt: -1 });

    res.status(200).json({
        success: true,
        message: 'User Resumes fetched Successfully',
        data: resumes
    })
}); 

export const getResumeById = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id })
    if(!resume) throw new AppError('Resume not found', 404, 'RESUME_NOT_FOUND');

    res.status(200).json({
        success: true,
        message: 'Resume Feched Successfully',
        data: resume
    })
});

export const updateResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id
    })
    if(!resume) throw new AppError('Resume not found or not authorized', 404, 'NOT_FOUND');

    // Update only allowed resume fields
    Object.assign(resume, req.body);

    // Never allow userId to be changed
    resume.userId = req.user._id;

    const savedResume = await resume.save();
    res.status(200).json({
        success: true,
        message: 'Resume Updated Successfully',
        data: savedResume
    })
})

export const deleteResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id
    })
    if(!resume) throw new AppError('Resume not found or not authorized', 404, 'NOT_FOUND');
    
    const deleted = await resume.deleteOne();
    if(!deleted) throw new AppError('Resume not found or not authorized', 404, 'NOT_FOUND');

    // Uplods folder
    const uploadsFolder = path.join(process.cwd(), 'uploads');

    // Delete thumnail
    if(resume.thumbnailLink) {
        const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
        if(fs.existsSync(oldThumbnail)) {
            fs.unlinkSync(oldThumbnail)
        }
    }

    // Delete Profile Image
    if(resume.profileInfo?.profilePreviewUrl) {
        const oldProfile = path.join(
            uploadsFolder,
            path.basename(resume.profileInfo.profilePreviewUrl)
        )
        if(fs.existsSync(oldProfile)) {
            fs.unlinkSync(oldProfile)
        }
    }

    return res.status(200).json({
        success: true,
        message: 'Resume Deleted Successfully',
        data: null,
    })
});