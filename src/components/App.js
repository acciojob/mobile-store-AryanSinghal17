
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
    {
      id: 1,
      name: "iPhone 16",
      price: 79999,
      description: "Apple iPhone with powerful A18 chip.",
      image: "https://placehold.co/300x200?text=iPhone+16"
    },
    {
      id: 2,
      name: "Samsung Galaxy S25",
      price: 74999,
      description: "Samsung flagship smartphone.",
      image: "https://placehold.co/300x200?text=Samsung+S25"
    },
    {
      id: 3,
      name: "OnePlus 13",
      price: 69999,
      description: "OnePlus phone with fast performance.",
      image: "https://placehold.co/300x200?text=OnePlus+13"
    }
  ]);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
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

      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />

            <h2>{product.name}</h2>
            <p>₹{product.price}</p>

            <Link to={`/products/${product.id}`}>
              View Details
            </Link>
          </div>
        ))}
      </div>
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
        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Product Details</h1>

      <img src={product.image} alt={product.name} />

      <h2>{product.name}</h2>
      <h3>₹{product.price}</h3>
      <p>{product.description}</p>

      <button onClick={() => navigate("/")}>
        Back to Home
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

  const handleEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setProducts(
      products.map((product) =>
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

    setEditId(null);
    setName("");
    setPrice("");
    setDescription("");
    setImage("");
  };

  const handleDelete = (id) => {
    setProducts(
      products.filter((product) => product.id !== id)
    );
  };

  return (
    <div>
      <h1>Admin Panel</h1>

      {editId !== null && (
        <form onSubmit={handleUpdate}>
          <h2>Edit Product</h2>

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />

          <button type="submit">Update Product</button>

          <button
            type="button"
            onClick={() => setEditId(null)}
          >
            Cancel
          </button>
        </form>
      )}

      <div>
        {products.map((product) => (
          <div key={product.id} className="admin-card">
            <h2>{product.name}</h2>
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
    </div>
  );
}

export default App;
