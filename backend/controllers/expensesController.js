import expense from "../models/expensesModel.js";


//Add a new expense record 

export const addExpense = async (req,res) =>{
    try{
        //check if an expense record with the same parameters already exists 
        const existingExpense = await expense.findOne({
            amount:req.body.amount,
            month:req.body.month,
            date:req.body.date,
            category:req.body.category,
            paymentMethod:req.body.paymentMethod,
            description:req.body.description,
        });

        if (existingExpense){
            return res.status(400).json({message:"Expense with the same parameters already exists"});
        }
        const newExpense = new expense(req.body);
        const savedExpense = await newExpense.save();
        res.status(201).json({message: "Expense record added successfully",expense:savedExpense});
    }catch(error){
        res.status(500).json({message: "Error adding expense record",error:error.message});
    }

 }

 //Get all expense recods
 export const getAllExpenses = async (req,res)=>{
    try{
        const records =await expense.find().sort({UpdatedAt: -1});;;
        res.status(200).json(records);
    }catch(error){
        res.status(500).json({message:"Error retriveing expense records", error:error.message});

    }
 };

 //Get a expense record by ID
 export const getExpensesByID = async (req,res)=>{
    try{
        const record =await expense.findById(req.params.id);

        if(!record){
            return res.status(404).json({message:"Expense record not found"});
        }

        res.status(200).json(record);
    }catch (error){
        res.status(500).json({message:"Error retrieving expense item",error:error.message});
    }
 };

 //update a expense record by ID

 export const updateExpenseById = async (req,res)=>{
    try{
        //find the record by ID and update it with the new data from the request body
        const updatedRecord = await expense.findByIdAndUpdate(
            req.params.id,//the ID of the record to update
            req.body,  //the data to update the item with
            {new:true}  //return the updated item
        );

        if(!updatedRecord){
            return res.status(404).json({message:"Expense record not found"});
        }

        res.status(200).json({message:"Expense record updated successfully", expense:updatedRecord});

    }catch(error){
        res.status(500).json({message:"Error updating expense record",error:error.message});
    }
 };

 
 // Delete an expense record by ID
export const deleteExpenseRecordById = async (req, res) => {
    try {
        const deletedRecord = await expense.findByIdAndDelete(req.params.id);

        if (!deletedRecord) {
            return res.status(404).json({ message: "Expense record not found" });
        }

        res.status(200).json({ message: "Expense record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting expense record", error: error.message });
    }
};


