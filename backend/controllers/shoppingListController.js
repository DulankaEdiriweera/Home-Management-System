import ShoppingList from "../models/shoppingListModel.js";

// Add a new shopping list item
export const addShoppingListItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemName, store, unit, quantity } = req.body;

    // Validate that the provided unit is in the allowed enum
    if (!["kg", "l", "ml", "g", "pieces"].includes(unit)) {
      return res.status(400).json({ 
        message: "Invalid unit of measure. Allowed values: kg, l, ml, g, pieces" 
      });
    }

    const existingItem = await ShoppingList.findOne({
      itemName: itemName,
      store: store,
      user: userId,
    });

    if (existingItem) {
      return res.status(400).json({ message: "Item already exists in the shopping list for this store" });
    }

    const newItem = new ShoppingList({
      ...req.body,
      user: userId, // Associate the item with the user
    });
    
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding shopping list item", error: error.message });
  }
};

// Get all shopping list items
export const getAllShoppingListItems = async (req, res) => {
  try {
    const userId = req.userId;
    const items = await ShoppingList.find({ user: userId }).sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shopping list items", error: error.message });
  }
};

// Get a specific shopping list item by ID
export const getShoppingListItemById = async (req, res) => {
  try {
    const userId = req.userId;
    const item = await ShoppingList.findOne({
      _id: req.params.id,
      user: userId, // Check if the item belongs to the user
    });
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
    const userId = req.userId;
    const items = await ShoppingList.find({ priority: "High", user: userId }).sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving high-priority items", error: error.message });
  }
};

// Get shopping list items by store
export const getShoppingItemsByStore = async (req, res) => {
  try {
    const userId = req.userId;
    const storeName = req.params.store;
    const items = await ShoppingList.find({ 
      store: storeName,
      user: userId // Ensure we only return items for the current user
    }).sort({ updatedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving items by store", error: error.message });
  }
};

// Get shopping list items by category
export const getShoppingItemsByCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const category = req.params.category;
    
    // Validate that the provided category is in the allowed enum
    if (!["Groceries", "Household", "Electronics", "Personal Care", "Furniture", "Other"].includes(category)) {
      return res.status(400).json({ 
        message: "Invalid category. Allowed values: Groceries, Household, Electronics, Personal Care, Furniture, Other" 
      });
    }
    
    const items = await ShoppingList.find({ 
      category: category,
      user: userId 
    }).sort({ updatedAt: -1 });
    
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving items by category", error: error.message });
  }
};

// Update a shopping list item by ID
export const updateShoppingListItemById = async (req, res) => {
  try {
    const userId = req.userId;
    
    // If unit is being updated, validate it
    if (req.body.unit && !["kg", "l", "ml", "g", "pieces"].includes(req.body.unit)) {
      return res.status(400).json({ 
        message: "Invalid unit of measure. Allowed values: kg, l, ml, g, pieces" 
      });
    }
    
    // If category is being updated, validate it
    if (req.body.category && 
        !["Groceries", "Household", "Electronics", "Personal Care", "Furniture", "Other"].includes(req.body.category)) {
      return res.status(400).json({ 
        message: "Invalid category. Allowed values: Groceries, Household, Electronics, Personal Care, Furniture, Other" 
      });
    }
    
    // If priority is being updated, validate it
    if (req.body.priority && !["Low", "Medium", "High"].includes(req.body.priority)) {
      return res.status(400).json({ 
        message: "Invalid priority. Allowed values: Low, Medium, High" 
      });
    }
    
    const updatedItem = await ShoppingList.findOneAndUpdate(
      { _id: req.params.id, user: userId }, // Ensure the item belongs to the user
      req.body,
      { new: true, runValidators: true }
    );

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
    const userId = req.userId;
    const result = await ShoppingList.findOneAndDelete({
      _id: req.params.id,
      user: userId, // Ensure the item belongs to the user
    });
    
    if (!result) {
      return res.status(404).json({ message: "Item not found or you don't have permission to delete it" });
    }
    
    res.status(200).json({ message: "Shopping list item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shopping list item", error: error.message });
  }
};
