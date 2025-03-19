import cleaningSupplies from "../models/cleaningSuppliesModel.js";

// Add a new Cleaning Supplies Item
export const addCleaningSupplies = async (req, res) => {
  try {
    // Check if an item with the same parameters already exists
    const existingItem = await cleaningSupplies.findOne({
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

    const newItem = new cleaningSupplies(req.body);
    const savedItem = await newItem.save();
    res
      .status(201)
      .json({
        message: "Cleaning supply item added successfully",
        item: savedItem,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error adding cleaning supply item",
        error: error.message,
      });
  }
};

// Get all cleaning supply items
export const getAllCleaningSupllies = async (req, res) => {
  try {
    const items = await cleaningSupplies.find().sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving cleaning supply items",
        error: error.message,
      });
  }
};

// Get a cleaning supply item by ID
export const getCleaningSupplyById = async (req, res) => {
  try {
    const item = await cleaningSupplies.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ message: "Cleaning Supply item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving cleaning supply item",
        error: error.message,
      });
  }
};

// Update a cleaning supply item by ID
export const updateCleaningSupplyById = async (req, res) => {
  try {
    // Find the item by ID and update it with the new data from the request body
    const updatedItem = await cleaningSupplies.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ message: "Cleaning Supply item not found" });
    }

    res
      .status(200)
      .json({
        message: "Cleaning Supply item updated successfully",
        item: updatedItem,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating Cleaning Supply item",
        error: error.message,
      });
  }
};

// Delete a food and beverage item by ID
export const deleteCleaningSupplyById = async (req, res) => {
  try {
    const deletedItem = await cleaningSupplies.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Cleaning Supply item not found" });
    }

    res
      .status(200)
      .json({ message: "Cleaning Supply item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting Cleaning Supply item",
        error: error.message,
      });
  }
};

// Get low stock food and beverage items
export const getLowStockCleaningSupplies = async (req, res) => {
  try {
    // Find items where quantity is less than or equal to minimumLevel
    const lowStockItems = await cleaningSupplies.find({
      $expr: { $lte: ["$quantity", "$minimumLevel"] },
    });

    if (lowStockItems.length === 0) {
      return res.status(404).json({ message: "No low stock items found" });
    }

    res.status(200).json(lowStockItems);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving low stock cleaning supply items",
        error: error.message,
      });
  }
};

// Get items that are close to expiring (within 3 days)
export const getItemsCloseToExpiryCleaningSupplies = async (req, res) => {
  try {
    const currentDate = new Date(); // Current date
    const threeDaysFromNow = new Date(currentDate);
    threeDaysFromNow.setDate(currentDate.getDate() + 3); // Set the date to 3 days ahead

    // Find items where the expiryDate is less than or equal to 3 days from now
    const itemsCloseToExpiry = await cleaningSupplies.find({
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
