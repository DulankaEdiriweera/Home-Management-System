import personalCare from "../models/personalCareModel.js";

// Add a new Personal Care Item
export const addPersonalCareItem = async (req, res) => {
  try {
    // Check if an item with the same parameters already exists
    const existingItem = await personalCare.findOne({
      itemName: req.body.itemName,
      category: req.body.category,
      weightVolume: req.body.weightVolume,
      unitOfMeasure: req.body.unitOfMeasure,
      expiryDate: req.body.expiryDate,
      storageTypeLocation: req.body.storageTypeLocation,
      minimumLevel: req.body.minimumLevel,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Item with the same parameters already exists" });
    }

    const newItem = new personalCare(req.body);
    const savedItem = await newItem.save();
    res
      .status(201)
      .json({
        message: "Personal Care item added successfully",
        item: savedItem,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error adding Personal Care item",
        error: error.message,
      });
  }
};

// Get all Personal Care items
export const getAllPersonalCareItems = async (req, res) => {
  try {
    const items = await personalCare.find().sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving Personal Care items",
        error: error.message,
      });
  }
};

// Get a Personal Care item by ID
export const getPersonalCareItemById = async (req, res) => {
  try {
    const item = await personalCare.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Personal Care item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving Personal Care item",
        error: error.message,
      });
  }
};

// Update a Personal Care item by ID
export const updatePersonalCareItemById = async (req, res) => {
  try {
    // Find the item by ID and update it with the new data from the request body
    const updatedItem = await personalCare.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Personal Care item not found" });
    }

    res
      .status(200)
      .json({
        message: "Personal Care item updated successfully",
        item: updatedItem,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating Personal Care item",
        error: error.message,
      });
  }
};

// Delete a Personal Care item by ID
export const deletePersonalCareItemById = async (req, res) => {
  try {
    const deletedItem = await personalCare.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Personal Care item not found" });
    }

    res
      .status(200)
      .json({ message: "Personal Care item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting Personal Care item",
        error: error.message,
      });
  }
};

// Get low stock Personal Care items
export const getLowStockPersonalCareItems = async (req, res) => {
  try {
    // Find items where quantity is less than or equal to minimumLevel
    const lowStockItems = await personalCare.find({
      $expr: { $lte: ["$quantity", "$minimumLevel"] }, // Compare quantity and minimumLevel
    });

    if (lowStockItems.length === 0) {
      return res.status(404).json({ message: "No low stock items found" });
    }

    res.status(200).json(lowStockItems); // Return the low stock items
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving low stock Personal Care items",
        error: error.message,
      });
  }
};

// Get items that are close to expiring (within 3 days)
export const getItemsCloseToExpiryPersonalCare = async (req, res) => {
  try {
    const currentDate = new Date(); // Current date
    const threeDaysFromNow = new Date(currentDate);
    threeDaysFromNow.setDate(currentDate.getDate() + 3); // Set the date to 3 days ahead

    // Find items where the expiryDate is less than or equal to 3 days from now
    const itemsCloseToExpiry = await personalCare.find({
      expiryDate: { $lte: threeDaysFromNow }, // Expiry date is within the next 3 days
    });

    if (itemsCloseToExpiry.length === 0) {
      return res
        .status(404)
        .json({ message: "No items close to expiry found" });
    }

    res.status(200).json(itemsCloseToExpiry); // Return the items close to expiry
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving items close to expiry",
        error: error.message,
      });
  }
};
