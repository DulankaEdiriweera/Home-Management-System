import personalCare from "../models/personalCareModel.js";

// Add a new Personal Care Item
export const addPersonalCareItem = async (req, res) => {
  try {
    const userId = req.userId;
    // Check if an item with the same parameters already exists
    const existingItem = await personalCare.findOne({
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

    const newItem = new personalCare({
      ...req.body,
      user: userId, // Associate the item with the user
    });
    const savedItem = await newItem.save();
    res.status(201).json({
      message: "Personal Care item added successfully",
      item: savedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding Personal Care item",
      error: error.message,
    });
  }
};

// Get all Personal Care items
export const getAllPersonalCareItems = async (req, res) => {
  try {
    const userId = req.userId;
    const items = await personalCare
      .find({ user: userId })
      .sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving Personal Care items",
      error: error.message,
    });
  }
};

// Get a Personal Care item by ID
export const getPersonalCareItemById = async (req, res) => {
  try {
    const userId = req.userId;
    const item = await personalCare.findOne({
      _id: req.params.id,
      user: userId, // Check if the item belongs to the user
    });

    if (!item) {
      return res.status(404).json({ message: "Personal Care item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving Personal Care item",
      error: error.message,
    });
  }
};

// Update a Personal Care item by ID
export const updatePersonalCareItemById = async (req, res) => {
  try {
    const userId = req.userId;
    // Find the item by ID and update it with the new data from the request body
    const updatedItem = await personalCare.findOneAndUpdate(
      { _id: req.params.id, user: userId }, // Ensure the item belongs to the user
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Personal Care item not found" });
    }

    res.status(200).json({
      message: "Personal Care item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Personal Care item",
      error: error.message,
    });
  }
};

// Delete a Personal Care item by ID
export const deletePersonalCareItemById = async (req, res) => {
  try {
    const userId = req.userId;
    const deletedItem = await personalCare.findOneAndDelete({
      _id: req.params.id,
      user: userId, // Ensure the item belongs to the user
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Personal Care item not found" });
    }

    res
      .status(200)
      .json({ message: "Personal Care item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Personal Care item",
      error: error.message,
    });
  }
};

// Get low stock Personal Care items
export const getLowStockPersonalCareItems = async (req, res) => {
  try {
    const userId = req.userId;
    // Find items where quantity is less than or equal to minimumLevel
    const lowStockItems = await personalCare.find({
      user: userId,
      $expr: { $lte: ["$quantity", "$minimumLevel"] }, // Compare quantity and minimumLevel
    });

    if (lowStockItems.length === 0) {
      return res.status(404).json({ message: "No low stock items found" });
    }

    res.status(200).json(lowStockItems); // Return the low stock items
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving low stock Personal Care items",
      error: error.message,
    });
  }
};

// Get items that are close to expiring (within 3 days)
export const getItemsCloseToExpiryPersonalCare = async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date(); // Current date
    const threeDaysFromNow = new Date(currentDate);
    threeDaysFromNow.setDate(currentDate.getDate() + 3); // Set the date to 3 days ahead

    // Find items where the expiryDate is less than or equal to 3 days from now
    const itemsCloseToExpiry = await personalCare.find({
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
