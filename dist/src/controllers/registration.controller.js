"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTeam = void 0;
const prisma_1 = require("../config/prisma");
const registerTeam = async (req, res) => {
    try {
        const { teamName, teamSize, leader, teamMembers, paymentScreenshot, pptLink, videoLink, registrationStatus, } = req.body;
        // Basic validation
        if (!paymentScreenshot) {
            return res.status(400).json({
                message: "Payment screenshot URL required",
            });
        }
        // Create Leader
        const leaderRecord = await prisma_1.prisma.participant.create({
            data: leader,
        });
        // Create Registration
        const registration = await prisma_1.prisma.registration.create({
            data: {
                teamName,
                teamSize,
                pptLink,
                videoLink,
                paymentScreenshot,
                registrationStatus,
                leaderId: leaderRecord.id,
            },
        });
        // Create Members
        for (const member of teamMembers) {
            await prisma_1.prisma.participant.create({
                data: {
                    ...member,
                    registrationMemberId: registration.id,
                },
            });
        }
        res.json({
            success: true,
            message: "Registration saved successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};
exports.registerTeam = registerTeam;
