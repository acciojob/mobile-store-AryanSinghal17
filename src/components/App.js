
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from "react-router-dom";

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "iPhone 16", price: 79999, description: "Apple iPhone 16", image: "https://placehold.co/300x200?text=iPhone+16" },
    { id: 2, name: "Samsung S25", price: 74999, description: "Samsung Galaxy S25", image: "https://placehold.co/300x200?text=Samsung+S25" },
    { id: 3, name: "OnePlus 13", price: 69999, description: "OnePlus flagship phone", image: "https://placehold.co/300x200?text=OnePlus+13" },
    { id: 4, name: "Google Pixel 9", price: 59999, description: "Google Pixel smartphone", image: "https://placehold.co/300x200?text=Pixel+9" },
    { id: 5, name: "iPhone 15", price: 64999, description: "Apple iPhone 15", image: "https://placehold.co/300x200?text=iPhone+15" },
    { id: 6, name: "Samsung A55", price: 39999, description: "Samsung Galaxy A55", image: "https://placehold.co/300x200?text=Samsung+A55" },
    { id: 7, name: "Nothing Phone 2", price: 44999, description: "Nothing Phone 2", image: "https://placehold.co/300x200?text=Nothing+Phone" },
    { id: 8, name: "Redmi Note 14", price: 19999, description: "Redmi Note smartphone", image: "https://placehold.co/300x200?text=Redmi+Note" }
  ]);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>{" | "}
        <Link to="/admin">Admin Panel</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<ProductList products={products} />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails products={products} />}
        />

        <Route
          path="/admin"
          element={
            <AdminPanel
              products={products}
              setProducts={setProducts}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function ProductList({ products }) {
  return (
    <div>
      <h1>Mobile Store</h1>

      <h3>Total Products: {products.length}</h3>

      {products.map((product) => (
        <div key={product.id}>
          <img src={product.image} alt={product.name} width="150" />
          <h2>{product.name}</h2>
          <p>₹{product.price}</p>
          <Link to={`/products/${product.id}`}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

function ProductDetails({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div>
        <h2>Product Not Found</h2>
        <button onClick={() => navigate("/")}>Back Home</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Product Details</h1>

      <img src={product.image} alt={product.name} width="250" />

      <h2>{product.name}</h2>
      <h3>₹{product.price}</h3>
      <p>{product.description}</p>

      <button onClick={() => navigate("/")}>
        Back Home
      </button>
    </div>
  );
}

function AdminPanel({ products, setProducts }) {
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setDescription("");
    setImage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !price || Number(price) <= 0 || !description.trim() || !image.trim()) {
      return;
    }

    if (editId !== null) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editId
            ? {
                ...product,
                name,
                price: Number(price),
                description,
                image
              }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Math.max(0, ...products.map((p) => p.id)) + 1,
        name,
        price: Number(price),
        description,
        image
      };

      setProducts((prev) => [...prev, newProduct]);
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setDescription(product.description);
    setImage(product.image);
  };

  const handleDelete = (id) => {
    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );

    if (editId === id) {
      resetForm();
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>

      <h2>Total Products: {products.length}</h2>

      <form onSubmit={handleSubmit}>
        <h2>{editId !== null ? "Edit Product" : "Add Product"}</h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="1"
          required
        />

        <input
          type="text"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Product Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        <button type="submit">
          {editId !== null ? "Update Product" : "Add Product"}
        </button>

        {editId !== null && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h2>Manage Products</h2>

      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>

          <button onClick={() => handleEdit(product)}>
            Edit
          </button>

          <button onClick={() => handleDelete(product.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
