const db = require("../db");
const { todosTable, usersTable } = require("../models");
const { eq, sql } = require("drizzle-orm");
// getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo

const getAllTodos = async (req, res) => {
  try {
    const q = req.query.q;
    if (q) {
      // Way to search todos by title (case-insensitive) using ilike, which will non performant on large datasets(1 lakhs+ records)
      // const todos = await db.select().from(todosTable).where(ilike(todosTable.title, `%${q}%`));
      // Better way is to index search using GIN index
      // Format the search query properly - replace spaces with & for AND operation
      const searchQuery = q.trim().split(/\s+/);
      const todos = await db.select().from(todosTable).where(
          sql`to_tsvector('english', ${todosTable.title}) @@ to_tsquery('english', ${searchQuery})`
        );
      return res.status(200).json({
        message: "todos searched with " + q + " successfully",
        data: todos,
        pagination: {},
      });
    }
    const todos = await db.select().from(todosTable);
    return res.status(200).json({
      message: "todos fetched successfully",
      data: todos,
      pagination: {},
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
};

const getTodoById = async (req, res) => {
  const id = req.params.id;
  const todo = await db
    .select()
    .from(todosTable)
    .where((table) => eq(table.id, id))
    .limit(1);
  if (todo.length === 0) {
    return res.status(404).json({ error: "Todo not found." });
  }
  res.status(200).json({
    message: "todo fetched successfully",
    data: todo[0],
  });
};
const createTodo = async (req, res) => {
  const { title, description, userId } = req.body;
  const newTodo = {
    title: title,
    description: description,
    userId: userId,
  };
  if (!title || title === "") {
    return res.status(400).json({ error: "Title is required." });
  }
  const userExists = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (userExists.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid userId. User does not exist." });
  }
  const [result] = await db
    .insert(todosTable)
    .values(newTodo)
    .returning({ id: todosTable.id });
  return res.status(201).json({
    message: "todo created successfully",
    id: result?.id,
  });
};
const updateTodo = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const todo = await db
    .update(todosTable)
    .set(body)
    .where((table) => eq(table.id, id))
    .returning();
  if (todo.length === 0) {
    return res.status(404).json({ error: "Todo not found." });
  }
  return res.status(200).json({
    message: "todo updated successfully",
    result: todo[0],
  });
};
const deleteTodo = async (req, res) => {
  const id = req.params.id;
  const deletedCount = await db
    .delete(todosTable)
    .where(eq(todosTable.id, id))
    .returning();
  if (deletedCount.length === 0) {
    return res.status(404).json({ error: "Todo not found." });
  }
  return res.status(200).json({
    message: "todo deleted successfully",
  });
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
