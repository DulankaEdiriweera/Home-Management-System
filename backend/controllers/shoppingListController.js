import ShoppingList from "../models/shoppingListModel.js";

// Add a new shopping list item
export const addShoppingListItem = async (req, res) => {
  try {
    const existingItem = await ShoppingList.findOne({
      itemName: req.body.itemName,
      store: req.body.store,
    });

    if (existingItem) {
      return res.status(400).json({ message: "Item already exists in the shopping list for this store" });
    }

    const newItem = new ShoppingList(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding shopping list item", error: error.message });
  }
};

// Get all shopping list items
export const getAllShoppingListItems = async (req, res) => {
  try {
    const items = await ShoppingList.find().sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shopping list items", error: error.message });
  }
};

// Get a specific shopping list item by ID
export const getShoppingListItemById = async (req, res) => {
  try {
    const item = await ShoppingList.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving item", error: error.message });
  }
};

// Get high-priority shopping list items
export const getHighPriorityShoppingItems = async (req, res) => {
  try {
    const items = await ShoppingList.find({ priority: "High" }).sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving high-priority items", error: error.message });
  }
};

// Get shopping list items by store
export const getShoppingItemsByStore = async (req, res) => {
  try {
    const storeName = req.params.store;
    const items = await ShoppingList.find({ store: storeName }).sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving items by store", error: error.message });
  }
};

// Update a shopping list item by ID
export const updateShoppingListItemById = async (req, res) => {
  try {
    const updatedItem = await ShoppingList.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating shopping list item", error: error.message });
  }
};

// Delete a shopping list item by ID
export const deleteShoppingListItemById = async (req, res) => {
  try {
    await ShoppingList.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Shopping list item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shopping list item", error: error.message });
  }
};
