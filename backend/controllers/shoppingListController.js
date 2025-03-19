import ShoppingList from "../models/shoppinglistModel.js";

// Add a new shopping list item
export const addShoppingListItem = async (req, res) => {
  try {
    // Check if an item with the same name and store already exists
    const existingItem = await ShoppingList.findOne({
      itemName: req.body.itemName,
      store: req.body.store,
    });

    if (existingItem) {
      return res.status(400).json({ message: "Item already exists in the shopping list for this store" });
    }

    const newItem = new ShoppingList(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({ message: "Shopping list item added successfully", item: savedItem });
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

// Get a shopping list item by ID
export const getShoppingListItemById = async (req, res) => {
  try {
    const item = await ShoppingList.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shopping list item", error: error.message });
  }
};

// Update a shopping list item by ID
export const updateShoppingListItemById = async (req, res) => {
  try {
    const updatedItem = await ShoppingList.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }

    res.status(200).json({ message: "Shopping list item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating shopping list item", error: error.message });
  }
};

// Delete a shopping list item by ID
export const deleteShoppingListItemById = async (req, res) => {
  try {
    const deletedItem = await ShoppingList.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }

    res.status(200).json({ message: "Shopping list item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shopping list item", error: error.message });
  }
};

// Get high-priority shopping list items
export const getHighPriorityShoppingItems = async (req, res) => {
  try {
    const highPriorityItems = await ShoppingList.find({ priority: "High" });

    if (highPriorityItems.length === 0) {
      return res.status(404).json({ message: "No high-priority shopping list items found" });
    }

    res.status(200).json(highPriorityItems);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving high-priority shopping list items", error: error.message });
  }
};

// Get shopping list items by store
export const getShoppingItemsByStore = async (req, res) => {
  try {
    const storeName = req.params.store;
    const storeItems = await ShoppingList.find({ store: storeName });

    if (storeItems.length === 0) {
      return res.status(404).json({ message: `No items found for store: ${storeName}` });
    }

    res.status(200).json(storeItems);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shopping list items by store", error: error.message });
  }
};