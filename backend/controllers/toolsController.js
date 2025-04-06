import toolsAndMaintainenceItems from "../models/toolsModel.js";

// Add a new Tools & Maintainence Item
export const addToolSAndMaintanenceItem = async (req, res) => {
  try {
    const userId = req.userId;
    // Check if an item with the same parameters already exists
    const existingItem = await toolsAndMaintainenceItems.findOne({
      itemName: req.body.itemName,
      category: req.body.category,
      expiryDate: req.body.expiryDate,
      storageTypeLocation: req.body.storageTypeLocation,
      user: userId,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Item with the same parameters already exists" });
    }

    const newItem = new toolsAndMaintainenceItems({
      ...req.body,
      user: userId, // Associate the item with the user
    });
    const savedItem = await newItem.save();
    res
      .status(201)
      .json({ message: "Item added successfully", item: savedItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding item", error: error.message });
  }
};

// Get all Tools & Maintainence items for a specific user
export const getAllToolSAndMaintanenceItems = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the userId is set in req.userId after authentication

    // Fetch items only for the logged-in user
    const items = await toolsAndMaintainenceItems
      .find({ user: userId }) // Filter by userId
      .sort({ updatedAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving items", error: error.message });
  }
};

// Get a Tools & Maintainence item by ID for a specific user
export const getToolSAndMaintanenceItemById = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the userId is set in req.userId after authentication

    const item = await toolsAndMaintainenceItems.findOne({
      _id: req.params.id,
      user: userId, // Check if the item belongs to the user
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving item", error: error.message });
  }
};

// Update a Tools & Maintainence item by ID for a specific user
export const updateToolSAndMaintanenceItemById = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the userId is set in req.userId after authentication

    const updatedItem = await toolsAndMaintainenceItems.findOneAndUpdate(
      { _id: req.params.id, user: userId }, // Ensure the item belongs to the user
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Item", error: error.message });
  }
};

// Delete a Tools & Maintainence item by ID for a specific user
export const deleteToolSAndMaintanenceItemById = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the userId is set in req.userId after authentication

    const deletedItem = await toolsAndMaintainenceItems.findOneAndDelete({
      _id: req.params.id,
      user: userId, // Ensure the item belongs to the user
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Item", error: error.message });
  }
};
