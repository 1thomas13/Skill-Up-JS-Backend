const bcrypt = require('bcrypt');
const { User } = require('../database/models');
const { ErrorObject } = require('../helpers/error');


const hashPassword = async(password, saltRound)=>{
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(password, salt);        
}

const getUserService = async(conditions)=>{
  try{
    const user = await User.findOne({
      where: conditions
    });

    return user;
  }
  catch(err){
    throw new ErrorObject(err.message, 500, err);
  }
}

const createUserService = async(conditions, body)=>{
    const hashedPassword = await hashPassword(body.password, 10)
    const [user, created] = await User.findOrCreate({
      where: conditions,
      defaults: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        avatar: body.avatar,
        roleId: body.roleId
      }
    });

    return {user, created}
}

const checkUserExistence = async(conditions)=>{
  try{
    const userExist = await User.findOne({
      where: conditions
    });
    
    if(userExist === null){
      return false;
    }
    else{
      return true;
    }
  }
  catch(err){
    throw new ErrorObject(err.message, 500, err);
  }
}

const updatePasswordService = async(conditions, password, newPassword)=>{
  try{
    const user = await getUserService(conditions);
    if(user === null){
      return null;
    }
  
    const checkPassword = await bcrypt.compare(password, user.password)
  
    if(checkPassword){
      const hashedPassword = await hashPassword(newPassword, 10)
  
      User.update({password: hashedPassword}, {
        where: conditions,
      });
    }
   
    return checkPassword
  }
  catch(err){
    throw new ErrorObject(err.message, 500, err);
  }
}

const userUpdateService = async(conditions, body)=>{
  try{
    const useridExist = await checkUserExistence(conditions);
    if(!useridExist){
      return null;
    }

    User.update(body, {
      where: conditions,
    });

    return body;
  }
  catch(err){
    throw new ErrorObject(err.message, 500, err);
  }
}

const userDeleteService = async(conditions)=>{
  try{
    const userExist = await checkUserExistence(conditions);

    if(!userExist){
      return null;
    }
    
    const userDeleted = await User.destroy({
      where: conditions
    });

    return userDeleted;
  }
  catch(err){
    throw new ErrorObject(err.message, 500, err);
  }
}

const loginUserService = async(email, password)=>{
  try{
    let userToLogin
    try {
      userToLogin = await getUserService({ email: email })
    } catch (err) {
      return new ErrorObject(err.message, 500, err);
    }
    
    if (userToLogin && await bcrypt.compare(password, userToLogin.password)) {
      await delete userToLogin.dataValues.password;
      return userToLogin;
    }
    return false
  }
  catch(err){
    throw new ErrorObject(err.message, 401, err);
  }
}
module.exports = {
  createUserService,
  userUpdateService,
  userDeleteService,
  updatePasswordService,
  loginUserService,
  getUserService
}
