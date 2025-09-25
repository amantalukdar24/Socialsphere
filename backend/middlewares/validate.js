const Joi=require('joi');

function userSchema(req,res,next){
    const {name,email,username,password}=req.body;
    try{
        const schema=Joi.object({
        
            name:Joi.string()
                    .min(3)
                    .max(30)
                    .required()
                    .messages({
                        'string.min': 'Name must be at least 3 characters long',
              'string.max': 'Name must not exceed 30 characters',
                        'string.empty': 'Name is required',
                      }),
                   
            email:Joi.string()
                 .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                 .required()
               .messages({'string.email': 'Please enter a valid email address',
              'string.empty': 'Email is required',
              'any.required': 'Email is required',}),
            username: Joi.string()
    .pattern(/^[^0-9][^@ \t\r\n]*$/)
    .min(5)
    .max(25)
    .required()
    .messages({
      'string.pattern.base': 'Username must not start with a number and must not contain @ or spaces.',
      'string.min': 'Username must be at least 5 characters long.',
      'string.max': 'Username must be at most 40 characters long.',
      'string.empty': 'Username is required.'
    }),
            password:Joi.string()
            .min(8)
            .max(16)
            .required()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,16}$'))
            .messages({
              'string.min': 'Password must be at least 8 characters long',
              'string.max': 'Password must not exceed 16 characters long',
                'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character',
                'string.empty': 'Password is required',
              }),
                  
        
        });
         const {error} =  schema.validate({name,email,username,password}); 
        
         if(error)
         {
            return res.status(400).json({success:false,mssg:error.details[0].message,token:null})
         };
         next();
    }
    catch(err){
        return res.status(500).json({success:false,mssg:"Internal Server Error",token:null});
    }
}
function passSchema(req,res,next){
  try{
      const {password}=req.body;
      const schema=Joi.object({
            password:Joi.string()
            .min(8)
            .max(16)
            .required()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,16}$'))
            .messages({
              'string.min': 'Password must be at least 8 characters long',
              'string.max': 'Password must not exceed 16 characters long',
                'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character',
                'string.empty': 'Password is required',
              }),
      });
      const {error}=schema.validate({password});
        if(error)
         {
            return res.status(400).json({success:false,mssg:error.details[0].message})
         };
         next();
  }
  catch(err){
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
  }
}
function usernameSchema(req,res,next){
  try {
    const {username}=req.body;
    const schema=Joi.object({
                  username: Joi.string()
    .pattern(/^[^0-9][^@ \t\r\n]*$/)
    .min(5)
    .max(25)
    .required()
    .messages({
      'string.pattern.base': 'Username must not start with a number and must not contain @ or spaces.',
      'string.min': 'Username must be at least 5 characters long.',
      'string.max': 'Username must be at most 40 characters long.',
      'string.empty': 'Username is required.'
    }),
    });
        const {error} =  schema.validate({username}); 
        
         if(error)
         {
            return res.status(400).json({success:false,mssg:error.details[0].message})
         };
         next();

  } catch (err) {
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
  }
}
module.exports={
    userSchema,
    passSchema,
    usernameSchema,
}