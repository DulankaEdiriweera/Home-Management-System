import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema(
{
    amount:{
        type: Number,
        required:true,
    },

    month:{
        type: String,
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", 
        required: true,
      },
},
);

const expense = mongoose.model("Expense",expensesSchema);

export default expense;