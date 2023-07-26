const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require("../models/company.model");
const Staff = require('../models/staff.model');  // both company admin and company staff share the same staff model
const responses = require("../utils/response");
const generateResetPin = require('../utils/generateResetPin');
const sendMail = require("../utils/sendMail");


    // create company account logic
async function createCompany (payload) {
    const foundName = await Company.findOne({name: payload.name});
    if(foundName) {
        return responses.buildFailureResponse("Company Name Already registered", 400)
    }
    const foundEmail = await Company.findOne({contactEmail: payload.contactEmail});
    if(foundEmail) {
        return responses.buildFailureResponse("Company email already registered", 400)
    }
    const newCompany = await Company.create(payload)
    return responses.buildSuccessResponse("Company created successfully", 201, newCompany)
}

        // create company admin logic
async function createAdmin (payload) {
  const foundEmailOrPhone = await Staff.findOne({
    $or: [
      { email: payload.email },
      { phone: payload.phone }
    ]})
    if(foundEmailOrPhone) {
        return responses.buildFailureResponse("Admin phone or email already registered", 400)
  };
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(payload.password, generatedSalt)
    payload.password = hashedPassword
    payload.role = "admin"
    const savedAdmin = await Staff.create(payload)
    return responses.buildSuccessResponse("Admin created successfully", 201, savedAdmin) 
};

  // create company staff account logic
async function createStaff (payload) {
    const foundEmailOrPhone = await Staff.findOne({$or: [
      {email: payload.email}, 
      {phone: payload.phone}
    ]})
    if(foundEmailOrPhone) {
        return responses.buildFailureResponse("Staff phone or email already registered", 400)
    }
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(payload.password, generatedSalt)
    payload.password = hashedPassword
    payload.role = "user"
    const savedStaff = await Staff.create(payload)
    return responses.buildSuccessResponse("Staff created successfully", 201, savedStaff)
    
}

// create company admin login logic
const login = async (payload) => {
    try {
        const foundUser = await Staff.findOne({ email: payload.email}).lean()
        if(!foundUser) {
            return responses.buildFailureResponse("Admin not found", 400)
        }
        if(foundUser.role !== "admin") {
            return responses.buildFailureResponse("Only Admins Allowed", 403)
        }
        const foundPassword = await bcrypt.compare(payload.password, foundUser.password)
        if (!foundPassword) {
            return responses.buildFailureResponse("password incorrect", 403)
        }

        const token = jwt.sign({email: foundUser.email, firstName: foundUser.firstName, role: foundUser.role, _id: foundUser._id}, process.env.JWT_SECRET, {
              expiresIn: '30d'
       })
       foundUser.accessToken = token
       return responses.buildSuccessResponse("Login successful", 200, foundUser)
    } catch (error) {
        return responses.buildFailureResponse("unable to login", 500)
    }
}

 // get list of companies from database          
async function getAllCompanies() {
    try {
      const companies = await Company.find();
      return responses.buildSuccessResponse('Successfully fetched all companies', 200, companies);
    } catch (error) {
      return responses.buildFailureResponse('Failed to fetch companies', 500);
    }
  }
  
  const verifyUser = async (payload)=>{
      const {user} = payload
  }
  
  // forget password logic
const forgotPassword = async (payload) => {
       
    const emailFound = await Staff.findOne({ email: payload.email })
    if (!emailFound) {
        return responses.buildFailureResponse("Email not found", 400)
    }
    const resetPin = generateResetPin()
    const updatedUser = await Staff.findByIdAndUpdate({ _id: emailFound._id }, { resetPin: resetPin }, { new: true });

    const forgotPasswordPayload = {
        to: updatedUser.email,
        subject: 'RESET PASSWORD',
        pin: resetPin,
    };
      
    sendMail.sendForgotPasswordMail(forgotPasswordPayload);
    return responses.buildSuccessResponse(
        'Forgot Password Successful',
        200,
        updatedUser
    );
};

// reset password logic
const resetPassword = async (payload) => {
   
    const foundUserAndPin = await Staff.findOne({email: payload.email,resetPin: payload.resetPin, });
    if (!foundUserAndPin) {
      return responses.buildFailureResponse('Reset Pin Invalid', 400);
    };
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds);
  
    const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);
  
    const updatedUser = await Staff.findByIdAndUpdate(
      { _id: foundUserAndPin._id },
      { password: hashedPassword, resetPin: null },
      { new: true }
    );
  
    return responses.buildSuccessResponse(
      'Password Reset Successful',
      200,
      updatedUser
    );
  };

  // search for company staff from database          

async function searchStaff(query) {
  try {
    const searchedStaff = query.search
      ? {
        $or: [
          { firstName: { $regex:query.search, $options: "i" } },
          { lastName: { $regex:query.search, $options: "i" } },
          { phone: { $regex:query.search, $options: "i" } },
        ],
        Company: query.Company,
      }
      : {};
    const foundStaff = await Staff.find(searchedStaff);
    return responses.buildSuccessResponse('Successfully fetched staff', 200, foundStaff);
  } catch (error) {
    return responses.buildFailureResponse('Failed to fetch staff', 500);
  }
}
  
  module.exports = {
    createCompany,
    createAdmin,
    login,
    createStaff,
    getAllCompanies,
    forgotPassword,
    resetPassword,
    searchStaff,
  };
