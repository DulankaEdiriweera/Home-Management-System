import foodAndBeverages from "../models/foodAndBeveragesModel.js";

// Add a new Food and Beverage Item
export const addFoodAndBeverage = async (req, res) => {
  try {
    const userId = req.userId;
    // Check if an item with the same parameters already exists
    const existingItem = await foodAndBeverages.findOne({
      itemName: req.body.itemName,
      category: req.body.category,
      weightVolume: req.body.weightVolume,
      unitOfMeasure: req.body.unitOfMeasure,
      expiryDate: req.body.expiryDate,
      storageTypeLocation: req.body.storageTypeLocation,
      minimumLevel: req.body.minimumLevel,
      user: userId,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Item with the same parameters already exists" });
    }

    const newItem = new foodAndBeverages({
      ...req.body,
      user: userId,
    });
    const savedItem = await newItem.save();
    res.status(201).json({
      message: "Food and beverage item added successfully",
      item: savedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding food and beverage item",
      error: error.message,
    });
  }
};

// Get all food and beverage items
export const getAllFoodAndBeverages = async (req, res) => {
  try {
    const userId = req.userId;
    const items = await foodAndBeverages
      .find({ user: userId })
      .sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving food and beverage items",
      error: error.message,
    });
  }
};

// Get a food and beverage item by ID
export const getFoodAndBeverageById = async (req, res) => {
  try {
    const userId = req.userId;
    const item = await foodAndBeverages.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (!item) {
      return res
        .status(404)
        .json({ message: "Food and beverage item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving food and beverage item",
      error: error.message,
    });
  }
};

// Update a food and beverage item by ID
export const updateFoodAndBeverageById = async (req, res) => {
  try {
    const userId = req.userId;
    // Find the item by ID and update it with the new data from the request body
    const updatedItem = await foodAndBeverages.findOneAndUpdate(
      { _id: req.params.id, user: userId }, // Ensure the item belongs to the user
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ message: "Food and beverage item not found" });
    }

    res.status(200).json({
      message: "Food and beverage item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating food and beverage item",
      error: error.message,
    });
  }
};

// Delete a food and beverage item by ID
export const deleteFoodAndBeverageById = async (req, res) => {
  try {
    const userId = req.userId;
    const deletedItem = await foodAndBeverages.findOneAndDelete({
      _id: req.params.id,
      user: userId, // Ensure the item belongs to the user
    });

    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Food and beverage item not found" });
    }

    res
      .status(200)
      .json({ message: "Food and beverage item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting food and beverage item",
      error: error.message,
    });
  }
};

// Get low stock food and beverage items
export const getLowStockFoodAndBeverages = async (req, res) => {
  try {
    const userId = req.userId;
    // Find items where quantity is less than or equal to minimumLevel
    const lowStockItems = await foodAndBeverages.find({
      user: userId,
      $expr: { $lte: ["$quantity", "$minimumLevel"] }, // Compare quantity and minimumLevel
    });

    if (lowStockItems.length === 0) {
      return res.status(404).json({ message: "No low stock items found" });
    }

    res.status(200).json(lowStockItems); // Return the low stock items
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving low stock food and beverage items",
      error: error.message,
    });
  }
};

// Get items that are close to expiring (within 3 days)
export const getItemsCloseToExpiry = async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date(); // Current date
    const threeDaysFromNow = new Date(currentDate);
    threeDaysFromNow.setDate(currentDate.getDate() + 3); // Set the date to 3 days ahead

    // Find items where the expiryDate is less than or equal to 3 days from now
    const itemsCloseToExpiry = await foodAndBeverages.find({
      user: userId,
      expiryDate: { $lte: threeDaysFromNow }, // Expiry date is within the next 3 days
    });

    if (itemsCloseToExpiry.length === 0) {
      return res
        .status(404)
        .json({ message: "No items close to expiry found" });
    }

    res.status(200).json(itemsCloseToExpiry); // Return the items close to expiry
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving items close to expiry",
      error: error.message,
    });
  }
};
