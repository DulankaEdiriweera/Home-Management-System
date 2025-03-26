import householdItems from "../models/householdItemModel.js";

// Add a new Household Item
export const addHouseholdItem = async (req, res) => {
  try {
    const userId = req.userId;
    // Check if an item with the same parameters already exists
    const existingItem = await householdItems.findOne({
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

    const newItem = new householdItems({
      ...req.body,
      user: userId,
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

// Get all Household items
export const getAllHouseholdItems = async (req, res) => {
  try {
    const userId = req.userId;
    const items = await householdItems
      .find({ user: userId })
      .sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving items", error: error.message });
  }
};

// Get a Household item by ID
export const getHouseholdItemById = async (req, res) => {
  try {
    const userId = req.userId;

    const item = await householdItems.findOne({
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

// Update a Household item by ID
export const updateHouseholdItemById = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the item by ID and update it with the new data from the request body
    const updatedItem = await householdItems.findOneAndUpdate(
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

// Delete a Household item by ID
export const deleteHouseholdItemById = async (req, res) => {
  try {
    const userId = req.userId;

    const deletedItem = await householdItems.findOneAndDelete({
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
