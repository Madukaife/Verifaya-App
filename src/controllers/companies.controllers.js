const companyServices = require("../services/companies.services")

// Create company account function
const createAccount = async (req, res) => {
  const data = await companyServices.createCompany(req.body)
  res.status(data.statusCode).json(data)
};
//create admin function
const createAdmin = async (req, res) => {
  try {
    const data = await companyServices.createAdmin(req.body);
    res.status(data.statusCode).json(data);
  } catch (error) {
    res.status(500).json({
      message: error?.message || 'Unable to Create Admin',
      status: error?.status || 'failure',
    });
  }
};

// create staff function
const createStaff = async (req, res) => {
  const data = await companyServices.createStaff(req.body)
  res.status(data.statusCode).json(data)
};

// login function
const login = async (req, res) => {
  const data = await companyServices.login(req.body)
  res.status(data.statusCode).json(data)
};

//get companies function
const getAllCompanies = async (req, res) => {
  const data = await companyServices.getAllCompanies();
  res.status(data.statusCode).json(data);
};

//forgot Password function
const forgotPassword = async (req, res) => {
  const data = await companyServices.forgotPassword(req.body);
  res.status(data.statusCode).json(data);
};
// reset password function
const resetPassword = async (req, res) => {
  const data = await companyServices.resetPassword(req.body);
  res.status(data.statusCode).json(data);
};

//search companies staff function
const searchStaff = async (req, res) => {
  const data = await companyServices.searchStaff(req.query);
  res.status(data.statusCode).json(data);
};

module.exports = {
  createAccount,
  createAdmin,
  login,
  createStaff,
  getAllCompanies,
  forgotPassword,
  resetPassword,
  searchStaff,
};




