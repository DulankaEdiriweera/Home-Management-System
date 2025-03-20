import toolsAndMaintainenceItems from "../models/toolsModel.js";

// Add a new Tools & Maintainence Item
export const addToolSAndMaintanenceItem = async (req, res) => {
  try {
    // Check if an item with the same parameters already exists
    const existingItem = await toolsAndMaintainenceItems.findOne({
      itemName: req.body.itemName,
      category: req.body.category,
      expiryDate: req.body.expiryDate,
      storageTypeLocation: req.body.storageTypeLocation,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Item with the same parameters already exists" });
    }

    const newItem = new toolsAndMaintainenceItems(req.body);
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

// Get all Tools & Maintainence items
export const getAllToolSAndMaintanenceItems = async (req, res) => {
  try {
    const items = await toolsAndMaintainenceItems.find().sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving items", error: error.message });
  }
};

// Get a Tools & Maintainence item by ID
export const getToolSAndMaintanenceItemById = async (req, res) => {
  try {
    const item = await toolsAndMaintainenceItems.findById(req.params.id);

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

// Update a Tools & Maintainence item by ID
export const updateToolSAndMaintanenceItemById = async (req, res) => {
  try {
    // Find the item by ID and update it with the new data from the request body
    const updatedItem = await toolsAndMaintainenceItems.findByIdAndUpdate(
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

// Delete a Tools & Maintainence item by ID
export const deleteToolSAndMaintanenceItemById = async (req, res) => {
  try {
    const deletedItem = await toolsAndMaintainenceItems.findByIdAndDelete(req.params.id);

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
