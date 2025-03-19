import householdItems from "../models/householdItemModel.js";

// Add a new Household Item
export const addHouseholdItem = async (req, res) => {
  try {
    // Check if an item with the same parameters already exists
    const existingItem = await householdItems.findOne({
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

    const newItem = new householdItems(req.body);
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
    const items = await householdItems.find().sort({ updatedAt: -1 });
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
    const item = await householdItems.findById(req.params.id);

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
    // Find the item by ID and update it with the new data from the request body
    const updatedItem = await householdItems.findByIdAndUpdate(
      req.params.id,
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
    const deletedItem = await householdItems.findByIdAndDelete(req.params.id);

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
