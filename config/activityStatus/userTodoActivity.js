
class Messages{
    constructor(code, message) {
        this.code = code;
        this.message = message;
        return code, message;
    }
}


function erro_changer (req,res,next) {

  res.success =  new Messages(200,"success");
   res.failure =  new Messages(400,"failled");
    //console.log(success, failure);
    next(null,{success:res.success,failure:res.failure})
}

module.exports ={
    Messages: Messages,
     erro_changer : erro_changer
}