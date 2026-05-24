const express = require("express");
const path = require("path"); 
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const detailsOrderRoutes = require("./routes/details_order.routes");

const PORT = 5000;
const api = express();

api.use(express.json());


api.use("/user", userRoutes);
api.use("/product", productRoutes);
api.use("/order", orderRoutes);
api.use("/details_order", detailsOrderRoutes);
api.use(express.static("public"));



api.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

api.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

api.listen(PORT, ()=>{
    console.log("Server running in http://localhost:5000")
});