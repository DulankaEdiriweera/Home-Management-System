import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema(
{
    amount:{
        type: Number,
        required:true,
    },

    date:{
        type: Date,
        required:true,
    },

    category:{
        type: String,
        required:true,
    },

    paymentMethod:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:true,
    },
    image:{
        type: String,
        
    },

},
);

const expense = mongoose.model("Expense",expensesSchema);

export default expense;