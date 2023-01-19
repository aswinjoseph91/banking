var mongoose  =  require('mongoose');  
   
var statementSchema = new mongoose.Schema({  
    date:{  
        type:Date
    },  
    narration:{  
        type:String  
    },  
    withdrawal:{  
        type:mongoose.Schema.Types.Decimal128  
    },  
    deposit:{  
        type:mongoose.Schema.Types.Decimal128   
    },  
    closing_balance:{  
        type:mongoose.Schema.Types.Decimal128   
    }   
});  

statementSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.withdrawal = ret.withdrawal.toString();
    ret.deposit = ret.deposit.toString();
    ret.closing_balance = ret.closing_balance.toString();
    ret.id=ret._id;
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});
   
module.exports = mongoose.model('statements', statementSchema);


