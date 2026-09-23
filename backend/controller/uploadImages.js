import fs from 'fs';
import path from 'path';
import Resume from '../models/resumeModel.js';
import upload from '../middleware/uploadMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const uploadResumeImages = asyncHandler(async (req, res) => {
    // Configure multer to handle images
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])
    (req, res, async (err) => {
        if(err) {
            throw new AppError('File upload Failed', 400, 'UPLOAD_FAILED', err.message)
        }

        const resumeId = req.params.id;
        const resume = await Resume.findOne({_id: resumeId, userId: req.user._id});
        
        if(!resume) return new AppError('Resume not found or unauthorized', 404, 'NOT_FOUND');

        const uploadsFolder = path.join(process.cwd(), "uploads");
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.profileImage?.[0];

        if(newThumbnail) {
            if(resume.thumbnailLink) {
                const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
                if(fs.existsSync(oldThumbnail)) {
                    fs.unlinkSync(oldThumbnail)
                }
            }
            resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
        }

        // Same for profilepreview image
        if(newProfileImage) {
            if(resume.profileInfo?.profilePreviewUrl) {
                const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                if(fs.existsSync(oldProfile)) {
                    fs.unlinkSync(oldProfile)
                }
            }
            resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
        }

        await resume.save();
        res.status(200).json({
            success: true,
            message: "Image upload Successfully",
            thumbnailLink: resume.thumbnailLink,
            profilePreviewUrl: resume.profileInfo.profilePreviewUrl
        })
    })
})