const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate } = require('jsonschema');
const Staff = require('../staffSchema');



// Create account function
async function createAdmin (payload) {


    // const foundEmail = await staff.findOne({email: payload.email});
    // if(foundEmail) {
    //     return {
    //         message: "Staff email already registered",
    //         statusCode: 400,
    //         status: "failure"
    //     }
    // }
    
    // const foundPhone = await staff.findOne({phone: payload.phone});
    // if(foundPhone) {
    //     return {
    //         message: "Staff phone already registered",
    //         statusCode: 400,
    //         status: "failure"
    //     }
    // }

    const foundEmailOrPhone = await Staff.findOne({$or: [
      {email: payload.email}, 
      {phone: payload.phone}
    ]})
    if(foundEmailOrPhone) {
      return {
            message: "Staff phone or email duplicate",
            statusCode: 400,
            status: "failure"
        }
    }
    // hashing the password here
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(payload.password, generatedSalt)

    payload.password = hashedPassword
    payload.role = "admin"

    const savedStaff = await Staff.create(payload)
    return {
            message: "Staff created successfully",
            statusCode: 201,
            status: "success",
            data: savedStaff
        }
    
}

module.exports = {
  createAdmin
}

// Login function
// const login = (req, res) => {
//   // Extract email and password from the request body
//   const { email, password } = req.body;

//   // Find the staff by email
//   const staff = staff.findOne((staff) => staff.email === email);

//   // Check if staff exists
//   if (!staff) {
//     return res.status(401).json({ error: 'Invalid email or password' });
//   }

//   // Compare the provided password with the stored hash
//   bcrypt.compare(password, staff.password, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error logging in' });
//     }

//     if (result) {
//       // Generate a JSON Web Token (JWT) for authentication
//       const token = jwt.sign({ staffId: staff.id }, 'secret_key');

//       // Return the token as a response
//       return res.status(200).json({ token });
//     }

//     return res.status(401).json({ error: 'Invalid email or password' });
//   });
// }
  

// module.exports = { createAccount, login }
