
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
      name: "iPhone 15",
      price: 79999,
      description: "Apple iPhone 15 with A16 Bionic chip and 128GB storage.",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      price: 74999,
      description: "Samsung Galaxy S24 with powerful performance and AMOLED display.",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"
    },
    {
      id: 3,
      name: "OnePlus 12",
      price: 64999,
      description: "OnePlus 12 with Snapdragon processor and fast charging.",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"
    },
    {
      id: 4,
      name: "Google Pixel 9",
      price: 79999,
      description: "Google Pixel 9 with an advanced camera and Google AI features.",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"
    }
  ]);

  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>Mobile Store</Link>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/admin" style={styles.navLink}>Admin Panel</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ProductList products={products} />} />
        <Route path="/products/:id" element={<ProductDetails products={products} />} />
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
    <div style={styles.container}>
      <h1>Our Mobile Collection</h1>

      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <h2>{product.name}</h2>
            <h3>₹{product.price.toLocaleString("en-IN")}</h3>
            <Link to={`/products/${product.id}`} style={styles.button}>
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

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div style={styles.container}>
        <h2>Product Not Found</h2>
        <button style={styles.button} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.detailCard}>
        <img src={product.image} alt={product.name} style={styles.detailImage} />
        <div>
          <h1>{product.name}</h1>
          <h2>₹{product.price.toLocaleString("en-IN")}</h2>
          <p>{product.description}</p>
          <button style={styles.button} onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ products, setProducts }) {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const handleEdit = (product) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setProducts((prev) =>
      prev.map((product) =>
        product.id === editId
          ? {
              ...product,
              ...formData,
              price: Number(formData.price)
            }
          : product
      )
    );

    setEditId(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      image: ""
    });
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    if (editId === id) {
      setEditId(null);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Admin Panel</h1>

      {editId !== null && (
        <form onSubmit={handleUpdate} style={styles.form}>
          <h2>Edit Product</h2>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            style={styles.input}
          />

          <input
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            style={styles.input}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            style={styles.input}
          />

          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Update Product
          </button>

          <button
            type="button"
            style={styles.deleteButton}
            onClick={() => setEditId(null)}
          >
            Cancel
          </button>
        </form>
      )}

      {products.map((product) => (
        <div key={product.id} style={styles.adminCard}>
          <img src={product.image} alt={product.name} style={styles.adminImage} />

          <div style={{ flex: 1 }}>
            <h3>{product.name}</h3>
            <p>₹{product.price.toLocaleString("en-IN")}</p>
          </div>

          <button
            style={styles.button}
            onClick={() => handleEdit(product)}
          >
            Edit
          </button>

          <button
            style={styles.deleteButton}
            onClick={() => handleDelete(product.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    background: "#1e293b"
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px"
  },
  container: {
    padding: "30px",
    maxWidth: "1100px",
    margin: "auto"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "25px"
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center"
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "contain"
  },
  detailCard: {
    display: "flex",
    gap: "40px",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "40px"
  },
  detailImage: {
    width: "300px",
    height: "300px",
    objectFit: "contain"
  },
  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
    textDecoration: "none",
    display: "inline-block"
  },
  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px"
  },
  adminCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginTop: "15px",
    flexWrap: "wrap"
  },
  adminImage: {
    width: "80px",
    height: "80px",
    objectFit: "contain"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "500px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    margin: "20px 0"
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px"
  }
};

export default App;
