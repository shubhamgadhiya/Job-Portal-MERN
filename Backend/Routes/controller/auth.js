const User = require("../../model/user");
const bcrypt = require("bcrypt");
const cloudinary = require('../../cloudinary/Config');
const path = require('path');
const mailer = require('../../mailer/sendmail');
const jwt = require('jsonwebtoken');
const Company = require("../../model/company");
const Job = require("../../model/job");
const Application = require("../../model/application");
const mongoose = require("mongoose");

const register = async (req, res) => {
    try {
        const data = req.body;
        const existingUser = await User.findOne({
            $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
        });

        if (existingUser) {
            const errorMessage =
                existingUser.email === data.email
                    ? 'Email already exists'
                    : 'Mobile number already exists';

            return res.status(400).json({
                data: null,
                message: errorMessage,
                success: false,
                error: true,
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(data.password, salt);
        data.password = hasedPassword;

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(path.normalize(req.file.path), {
                    folder: 'profile_pictures',
                    use_filename: true,
                });
                data.profilePicture = result.secure_url;
            } catch (error) {
                res.status(500).json({ data: error.message, message: "Cloudinary upload error. Please try again later.", success: false, error: true });
            }
        }

        const user = await User(data).save();
        res.status(200).json({ data: user, message: "User has been created successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to create user. Please try again later.", success: false, error: true });
    }
};

const login = async (req, res) => {
    try {
        const data = req.body;

        const userDetails = await User.findOne({ email: data.email })
        if (!userDetails) {
            res.status(400).json({ message: "User not found", success: false, error: true });
        }
        const validPassword = await bcrypt.compare(data.password, userDetails.password);
        if (!validPassword) {
            res.status(400).json({ message: "Invalid password", success: false, error: true });
        }
        let jwttoken = '';
        const tokendata = await jwt.sign({ userDetails }, process.env.SECRET_KEY, { expiresIn: "24h" }, (err, token) => {
            if (err) {
                return res.status(400).json({ data: err.message, message: "Token not generated", success: false, error: true });
            }
            jwttoken = token;
        });

        const mail = await mailer.loginSendMail(data.email);
        res.status(200).json({ data: userDetails, token: jwttoken, message: "User has been Login successfully.", success: true, error: false });

    } catch (error) {
        console.error(error);
        res.status(500).json({ data: error.message, message: "Failed to login user. Please try again later.", success: false, error: true });
    }
}

const userList = async (req, res) => {
    try {
        const aggregate = [
            { $match: {} },
        ];

        if (req.query.name) {
            aggregate.push({
                $match: {
                    $or: [
                        { firstName: { $regex: String(req.query.name), $options: "i" } },
                        { lastName: { $regex: String(req.query.name), $options: "i" } },
                        { email: { $regex: String(req.query.name), $options: "i" } },
                        { phoneNumber: Number(req.query.name) },
                        { role: { $in: [req.query.name] } }
                    ]
                }
            });
        }

        const userdata = await User.aggregate(aggregate);
        res.status(200).json({ data: userdata, message: "user has been fetched successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to fetch user. Please try again later.", success: false, error: true });
    }
};
const getUserById = async (req, res) => {
    try {
        const aggregate = [
            { $match: {} },
        ];

        if (req.query.name) {
            aggregate.push({
                $match: {
                    $or: [
                        { firstName: { $regex: String(req.query.name), $options: "i" } },
                        { lastName: { $regex: String(req.query.name), $options: "i" } },
                        { email: { $regex: String(req.query.name), $options: "i" } },
                        { phoneNumber: Number(req.query.name) },
                        { role: { $in: [req.query.name] } }
                    ]
                }
            });
        }
        if (req.params.id) {
            const userId = new mongoose.Types.ObjectId(req.params.id);
            aggregate.push({
                $match: { _id: userId }
            });
        }

console.log('aggregate',aggregate )
console.log('req.params.id',req.params.id )
        const userdata = await User.aggregate(aggregate);
                
        console.log('userdata',userdata )
        res.status(200).json({ data: userdata, message: "user has been fetched successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to fetch user. Please try again later.", success: false, error: true });
    }
};

const userUpdate = async (req, res) => {
    try {
        const data = req.body;

        if (req.files['profilePicture']) {
            try {
                const result = await cloudinary.uploader.upload(path.normalize(req.files['profilePicture'][0].path), {
                    folder: 'profile_pictures',
                    use_filename: true,
                });
                data.profilePicture = result.secure_url;
            } catch (error) {
                res.status(500).json({ data: error.message, message: "Cloudinary upload error. Please try again later.", success: false, error: true });
            }
        }

        if (req.files['resume']) {
            try {
                const result = await cloudinary.uploader.upload(path.normalize(req.files['resume'][0].path), {
                    folder: 'resume',
                    use_filename: true,
                });
                console.log("result", result)
                data.resume = result.secure_url;
            } catch (error) {
                res.status(500).json({ data: error.message, message: "Cloudinary upload error. Please try again later.", success: false, error: true });
            }
        }

        const user = await User.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: data },
            { new: true }
        )

        res.status(200).json({ data: user, message: "user has been updated successfully.", success: true, error: false })
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to update user. Please try again later.", success: false, error: true });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false, error: true });
        }
                
        console.log('user', user)
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiry = Date.now() + 10 * 60 * 1000;

console.log('otp', otp)
console.log('expiry', expiry)
        const mail = await mailer.forgotPasswordSendMail(email, otp);
        const data = await User.updateOne({ email }, { $set: { otp, expiry } });
        res.status(200).json({ data: data, message: "OTP has been sent to your email.", success: true, error: false });
} catch (error) {
        
    console.log('rerror', error)
    res.status(500).json({ data: error.message, message: "Failed to send mail. Please try again later.", success: false, error: true });
}
};   

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email});
                
        console.log('user', user)
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false, error: true });
        }
 
        if (user.otp !== Number(otp)) {
            return res.status(400).json({ message: "Invalid OTP", success: false, error: true });
        }
        if (user.expiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired", success: false, error: true });
        }
        res.status(200).json({ message: "OTP verified successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to verify OTP. Please try again later.", success: false, error: true });
    }
}
const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false, error: true });
        }         
        console.log('user',user )
        const salt = await bcrypt.genSalt(10);

        const hasedPassword = await bcrypt.hash(password, salt);
                
        console.log('hasedPassword', hasedPassword)
        const data = await User.findOneAndUpdate({ email }, { $set: { password: hasedPassword } }, { new: true });
        res.status(200).json({ data: data, message: "Password has been reset successfully.", success: true, error: false });
} catch (error) {
    res.status(500).json({ data: error.message, message: "Failed to reset password. Please try again later.", success: false, error: true });
}
};

const company = async (req, res) => {
    try {
        const aggregate = [
            { $match: {} },
        ];
        if (req.query.name) {
            aggregate.push({
                $match: {
                    name: { $regex: String(req.query.name), $options: "i" }
                }
            });
        }

        const company = await Company.aggregate(aggregate);
        res.status(200).json({ data: company, message: "Company has been fetched successfully.", success: true, error: false });


    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to fetch Company. Please try again later.", success: false, error: true });
    }
};


const companyAdd = async (req, res) => {
    try {
        const data = req.body;
        const existingUser = await Company.findOne({
            $or: [{ name: data.name }, { website: data.website }],
        });

        if (existingUser) {
            const errorMessage =
                existingUser.name === data.name
                    ? 'name already exists'
                    : 'website already exists';

            return res.status(400).json({
                data: null,
                message: errorMessage,
                success: false,
                error: true,
            });
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(path.normalize(req.file.path), {
                    folder: 'logo',
                    use_filename: true,
                });
                data.logo = result.secure_url;
            } catch (error) {
                res.status(500).json({ data: error.message, message: "Cloudinary upload error. Please try again later.", success: false, error: true });
            }
        }

        const company = await Company(data).save();
        res.status(200).json({ data: company, message: "Company has been created successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to create Company. Please try again later.", success: false, error: true });
    }
};

const companyUpdate = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(path.normalize(req.file.path), {
                    folder: 'logo',
                    use_filename: true,
                });
                data.logo = result.secure_url;
            } catch (error) {
                res.status(500).json({ data: error.message, message: "Cloudinary upload error. Please try again later.", success: false, error: true });
            }
        }

        const company = await Company.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: data },
            { new: true }
        )

        res.status(200).json({ data: company, message: "Company has been updated successfully.", success: true, error: false })
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to update Company. Please try again later.", success: false, error: true });
    }
}



const job = async (req, res) => {
    try {
        const aggregate = [
            { $match: {} },
        ];
        aggregate.push({
            $lookup: {
                from: "companies",
                localField: "company",
                foreignField: "_id",
                as: "company",
            },
        });

        console.log('req.query.role', req.query.role)
        
        if (req.query.role) {
            const rolesArray = req.query.role.split(',');
            aggregate.push({
                $match: {
                    role: { $in: rolesArray.map(role => new RegExp(role, "i")) } 
                }
            });
        }

        if (req.query.locations) {
            const locationsArray = req.query.locations.split(','); 
            aggregate.push({
                $match: {
                    "company.locations": { $in: locationsArray.map(location => new RegExp(location, "i")) } 
                }
            });
        }
        if (req.query.salaryRange) {
            const salaryRange = req.query.salaryRange;

            let matchCondition = {};

            switch (salaryRange) {
                case 'Below 9k':
                    matchCondition = { salary: { $lt: 9000 } };
                    break;
                case '10k - 29k':
                    matchCondition = { salary: { $gte: 10000, $lte: 29000 } };
                    break;
                case '30k - 59k':
                    matchCondition = { salary: { $gte: 30000, $lte: 59000 } };
                    break;
                case 'Above 60k':
                    matchCondition = { salary: { $gt: 60000 } };
                    break;
                default:
                    break;
            }

            if (Object.keys(matchCondition).length > 0) {
                aggregate.push({
                    $match: matchCondition,
                });
            }
        }
        console.log('aggregate', aggregate)
        const jobs = await Job.aggregate(aggregate);
        const applications = await Application.find({ job: { $in: jobs.map(job => job._id) } });

       
        const jobdetails = jobs.map(job => {
            const isApplied = applications.some(app => app.job.equals(job._id));
            return { ...job, applied: isApplied };
        });

        res.status(200).json({ data: jobdetails, message: "Job has been fetched successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to fetch Job. Please try again later.", success: false, error: true });
    }
};


const jobAdd = async (req, res) => {
    try {
        const data = req.body;
        const company = await Job(data).save();
        res.status(200).json({ data: company, message: "Job has been created successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to create Job. Please try again later.", success: false, error: true });
    }
};
const jobUpdate = async (req, res) => {
    try {
        const data = req.body;

        const job = await Job.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: data },
            { new: true }
        )

        res.status(200).json({ data: job, message: "job has been updated successfully.", success: true, error: false })
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to job Company. Please try again later.", success: false, error: true });
    }
}

const jobRole = async (req, res) => {
    try {
        const job = await Job.distinct("role");
        const location = await Company.distinct("locations");
        res.status(200).json({ data: { job, location }, message: "Job has been fetched successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to fetch Job. Please try again later.", success: false, error: true });
    }
}

const applicationCreate = async (req, res) => {
    try {
        const data = req.body;
        const application = await Application(data).save();
        res.status(200).json({ data: application, message: "Application has been created successfully.", success: true, error: false });
    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to create Application. Please try again later.", success: false, error: true });
    }

}

const applicationList = async (req, res) => {
    try {
        const aggregate = [
            { $match: {} },
        ];
        aggregate.push({
            $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "job",
            },
        })
        aggregate.push({
            $lookup: {
                from: "companies",
                localField: "company",
                foreignField: "_id",
                as: "company",
            },
        })
        aggregate.push({
            $unwind: {
                path: "$job",
                preserveNullAndEmptyArrays: true,
            },
        });
        aggregate.push({
            $unwind: {
                path: "$company",
                preserveNullAndEmptyArrays: true,
            },
        });


        console.log('req.params.id', req.params.id)
        if (req.params.id) {
            const userId = new mongoose.Types.ObjectId(req.params.id);
            aggregate.push({
                $match: { user: userId }
            });
        }
        const application = await Application.aggregate(aggregate);
        res.status(200).json({ data: application, message: "Application has been fetched successfully.", success: true, error: false });


    } catch (error) {
        res.status(500).json({ data: error.message, message: "Failed to fetch Application. Please try again later.", success: false, error: true });
    }
}

module.exports = { register, login, userList, getUserById,forgotPassword,verifyOtp,resetPassword, userUpdate, company, companyAdd, companyUpdate, job, jobAdd, jobUpdate, jobRole, applicationCreate, applicationList };