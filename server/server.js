require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const incomeRoutes = require("./routes/income.route");
const expenseRoutes = require("./routes/expense.route");
const budgetRoutes = require("./routes/budget.route");
const dashboardRoutes = require("./routes/dashboard.route");

const app = express();

// 🔹 Global Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);



// 🔹 Health Check
app.get("/", (req, res) => {
    res.send("Expense Tracker API is running");
});

// 🔹 MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(" MongoDB connection failed", error);
        process.exit(1);
    }
};

// 🔹 Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
    });
});
