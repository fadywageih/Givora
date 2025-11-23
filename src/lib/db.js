/**
 * Database Simulation Layer
 * mimics Supabase functionality using localStorage
 * Structured for easy migration to Supabase later
 */

const TABLES = {
  USERS: 'givora_users',
  WHOLESALE_APPS: 'givora_wholesale_applications',
  PRODUCTS: 'givora_products',
  ORDERS: 'givora_orders',
  ORDER_ITEMS: 'givora_order_items',
  CART: 'givora_cart',
  RESET_TOKENS: 'givora_password_reset_tokens',
  CONTACT_MESSAGES: 'givora_contact_messages'
};

// Initialize DB with some data if empty
export const initDB = () => {
  if (!localStorage.getItem(TABLES.PRODUCTS)) {
    const initialProducts = [
      { 
        id: 1, 
        name: 'Premium Tissue Rolls', 
        category: 'Tissue', 
        description: 'High quality 2-ply tissue rolls suitable for commercial use.',
        sku: 'TIS-001', 
        moq: 100, 
        retail_price: 24.99, 
        wholesale_price: 18.99, 
        stock_quantity: 5000, 
        image_url: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 2, 
        name: 'Commercial Paper Towels', 
        category: 'Paper Towels', 
        description: 'Absorbent and durable paper towels for high-traffic areas.',
        sku: 'PT-002', 
        moq: 50, 
        retail_price: 32.99, 
        wholesale_price: 24.99, 
        stock_quantity: 3000, 
        image_url: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 3, 
        name: 'Nitrile Gloves Medium', 
        category: 'Gloves', 
        description: 'Powder-free nitrile exam gloves, medium size.',
        sku: 'GLV-003', 
        moq: 200, 
        retail_price: 45.99, 
        wholesale_price: 34.99, 
        stock_quantity: 10000, 
        image_url: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 4, 
        name: 'Heavy Duty Garbage Bags', 
        category: 'Garbage Bags', 
        description: 'Tear-resistant heavy duty trash bags for industrial use.',
        sku: 'GB-004', 
        moq: 150, 
        retail_price: 28.99, 
        wholesale_price: 21.99, 
        stock_quantity: 4000, 
        image_url: 'https://images.unsplash.com/photo-1622161687343-828e5422501b?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 5, 
        name: 'Disposable Underpads', 
        category: 'Underpads', 
        description: 'Highly absorbent disposable underpads for protection.',
        sku: 'UND-005', 
        moq: 100, 
        retail_price: 38.99, 
        wholesale_price: 29.99, 
        stock_quantity: 2000, 
        image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 6, 
        name: 'Paper Coffee Cups', 
        category: 'Cups', 
        description: 'Double-wall paper cups suitable for hot beverages.',
        sku: 'CUP-006', 
        moq: 300, 
        retail_price: 19.99, 
        wholesale_price: 14.99, 
        stock_quantity: 15000, 
        image_url: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 7, 
        name: 'Kraft Paper Bags Large', 
        category: 'Paper Bags', 
        description: 'Eco-friendly large kraft paper bags with handles.',
        sku: 'BAG-007', 
        moq: 200, 
        retail_price: 22.99, 
        wholesale_price: 16.99, 
        stock_quantity: 8000, 
        image_url: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 8, 
        name: 'Premium Facial Tissue', 
        category: 'Tissue', 
        description: 'Soft and gentle facial tissues in box packaging.',
        sku: 'TIS-008', 
        moq: 150, 
        retail_price: 26.99, 
        wholesale_price: 19.99, 
        stock_quantity: 4500, 
        image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(TABLES.PRODUCTS, JSON.stringify(initialProducts));
  }
};

// Generic Helpers
const getTable = (table) => JSON.parse(localStorage.getItem(table) || '[]');
const setTable = (table, data) => localStorage.setItem(table, JSON.stringify(data));

// User Operations
export const dbUsers = {
  create: (userData) => {
    const users = getTable(TABLES.USERS);
    if (users.find(u => u.email === userData.email)) throw new Error('Email already exists');
    
    const newUser = {
      id: crypto.randomUUID(),
      email: userData.email,
      password_hash: userData.password_hash,
      first_name: userData.first_name || '', 
      last_name: userData.last_name || '',
      phone: userData.phone || '',
      address: userData.address || '',
      account_type: userData.account_type || 'retail',
      is_verified: userData.is_verified || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    setTable(TABLES.USERS, users);
    return newUser;
  },
  findByEmail: (email) => getTable(TABLES.USERS).find(u => u.email === email),
  findById: (id) => getTable(TABLES.USERS).find(u => u.id === id),
  update: (id, updates) => {
    const users = getTable(TABLES.USERS);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
    setTable(TABLES.USERS, users);
    return users[index];
  },
  verifyEmail: (email) => {
    const users = getTable(TABLES.USERS);
    const user = users.find(u => u.email === email);
    if(user) {
      user.is_verified = true;
      user.updated_at = new Date().toISOString();
      setTable(TABLES.USERS, users);
      return true;
    }
    return false;
  }
};

// Password Reset Operations
export const dbPasswordReset = {
  createToken: (userId) => {
    const tokens = getTable(TABLES.RESET_TOKENS);
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    const newRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };
    tokens.push(newRecord);
    setTable(TABLES.RESET_TOKENS, tokens);
    return token;
  },
  verifyToken: (token) => {
    const tokens = getTable(TABLES.RESET_TOKENS);
    const record = tokens.find(t => t.token === token);
    if (!record) return null;
    if (new Date(record.expires_at) < new Date()) return null;
    return record;
  },
  consumeToken: (token) => {
    let tokens = getTable(TABLES.RESET_TOKENS);
    tokens = tokens.filter(t => t.token !== token);
    setTable(TABLES.RESET_TOKENS, tokens);
  }
};

// Product Operations
export const dbProducts = {
  getAll: () => getTable(TABLES.PRODUCTS),
  getById: (id) => getTable(TABLES.PRODUCTS).find(p => p.id === id),
  create: (productData) => {
    const products = getTable(TABLES.PRODUCTS);
    const newProduct = {
      id: Date.now(), // Simple ID gen for simulation
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    products.push(newProduct);
    setTable(TABLES.PRODUCTS, products);
    return newProduct;
  },
  update: (id, updates) => {
    const products = getTable(TABLES.PRODUCTS);
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, updated_at: new Date().toISOString() };
    setTable(TABLES.PRODUCTS, products);
    return products[index];
  },
  delete: (id) => {
    let products = getTable(TABLES.PRODUCTS);
    products = products.filter(p => p.id !== parseInt(id));
    setTable(TABLES.PRODUCTS, products);
  }
};

// Cart Operations
export const dbCart = {
  getByUserId: (userId) => {
    return getTable(TABLES.CART).filter(item => item.user_id === userId);
  },
  addItem: (userId, product, quantity) => {
    const cart = getTable(TABLES.CART);
    const existingItemIndex = cart.findIndex(item => item.user_id === userId && item.product_id === product.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].updated_at = new Date().toISOString();
    } else {
      cart.push({
        id: crypto.randomUUID(),
        user_id: userId,
        product_id: product.id,
        quantity,
        product: product, // Denormalization for local simulation ease
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setTable(TABLES.CART, cart);
    return dbCart.getByUserId(userId);
  },
  updateQuantity: (itemId, quantity) => {
    let cart = getTable(TABLES.CART);
    const index = cart.findIndex(item => item.id === itemId);
    if (index >= 0) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
        cart[index].updated_at = new Date().toISOString();
      }
      setTable(TABLES.CART, cart);
    }
  },
  removeItem: (itemId) => {
    let cart = getTable(TABLES.CART);
    cart = cart.filter(item => item.id !== itemId);
    setTable(TABLES.CART, cart);
  },
  clear: (userId) => {
    let cart = getTable(TABLES.CART);
    cart = cart.filter(item => item.user_id !== userId);
    setTable(TABLES.CART, cart);
  }
};

// Order Operations
export const dbOrders = {
  create: (orderData) => {
    const orders = getTable(TABLES.ORDERS);
    const orderItems = getTable(TABLES.ORDER_ITEMS);

    const newOrderId = crypto.randomUUID();
    
    // Create Order Record
    const newOrder = {
      id: newOrderId,
      user_id: orderData.user_id,
      order_date: new Date().toISOString(),
      total_amount: orderData.total_amount,
      subtotal: orderData.subtotal, // Note: DB schema request says total_amount only, but keeping for simulation
      tax_amount: orderData.tax_amount,
      shipping_cost: orderData.shipping_cost,
      shipping_method: orderData.shipping_method,
      status: 'pending', 
      payment_method: orderData.payment_method,
      stripe_payment_id: orderData.stripe_payment_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    orders.push(newOrder);

    // Create Order Items Records
    orderData.items.forEach(item => {
      orderItems.push({
        id: crypto.randomUUID(),
        order_id: newOrderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        discount_applied: 0, // Assuming 0 for now
        created_at: new Date().toISOString()
      });
    });

    setTable(TABLES.ORDERS, orders);
    setTable(TABLES.ORDER_ITEMS, orderItems);

    // Return simulated joined object
    return { ...newOrder, items: orderData.items };
  },
  getByUserId: (userId) => {
    const orders = getTable(TABLES.ORDERS).filter(o => o.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const orderItems = getTable(TABLES.ORDER_ITEMS);
    
    // Join items manually for simulation
    return orders.map(order => ({
      ...order,
      items: orderItems.filter(item => item.order_id === order.id)
    }));
  }
};

// Wholesale Application Operations
export const dbWholesale = {
  create: (appData) => {
    const apps = getTable(TABLES.WHOLESALE_APPS);
    const newApp = {
      id: crypto.randomUUID(),
      user_id: appData.user_id,
      business_name: appData.business_name,
      ein_number: appData.ein_number,
      business_type: appData.business_type,
      address: appData.address,
      city: appData.city,
      state: appData.state,
      zip: appData.zip,
      phone: appData.phone,
      approval_status: 'pending',
      total_units_ordered: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    apps.push(newApp);
    setTable(TABLES.WHOLESALE_APPS, apps);
    return newApp;
  },
  getByUserId: (userId) => getTable(TABLES.WHOLESALE_APPS).find(app => app.user_id === userId),
  getAll: () => getTable(TABLES.WHOLESALE_APPS),
  updateUnits: (userId, units) => {
    const apps = getTable(TABLES.WHOLESALE_APPS);
    const appIndex = apps.findIndex(a => a.user_id === userId);
    if (appIndex >= 0) {
      apps[appIndex].total_units_ordered += units;
      apps[appIndex].updated_at = new Date().toISOString();
      setTable(TABLES.WHOLESALE_APPS, apps);
    }
  },
  updateStatus: (appId, status) => {
    const apps = getTable(TABLES.WHOLESALE_APPS);
    const index = apps.findIndex(a => a.id === appId);
    if (index === -1) return;
    
    apps[index].approval_status = status;
    apps[index].updated_at = new Date().toISOString();
    setTable(TABLES.WHOLESALE_APPS, apps);

    // Also update the user record if approved
    if (status === 'approved') {
      dbUsers.update(apps[index].user_id, { approved: true });
    }
  }
};

// Contact Messages Operations
export const dbContactMessages = {
  create: (msgData) => {
    const msgs = getTable(TABLES.CONTACT_MESSAGES);
    const newMsg = {
      id: crypto.randomUUID(),
      name: msgData.name,
      email: msgData.email,
      subject: msgData.subject,
      message: msgData.message,
      read_status: false, // Boolean to match is_read concept
      admin_reply: null,
      created_at: new Date().toISOString()
    };
    msgs.push(newMsg);
    setTable(TABLES.CONTACT_MESSAGES, msgs);
    return newMsg;
  },
  getAll: () => getTable(TABLES.CONTACT_MESSAGES).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  markRead: (id) => {
    const msgs = getTable(TABLES.CONTACT_MESSAGES);
    const index = msgs.findIndex(m => m.id === id);
    if (index !== -1) {
      msgs[index].read_status = true;
      setTable(TABLES.CONTACT_MESSAGES, msgs);
    }
  },
  delete: (id) => {
    let msgs = getTable(TABLES.CONTACT_MESSAGES);
    msgs = msgs.filter(m => m.id !== id);
    setTable(TABLES.CONTACT_MESSAGES, msgs);
  }
};