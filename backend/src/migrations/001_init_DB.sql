

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer', ---(customer,employee)
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_addresses (
    user_address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(10),
    is_default BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 6. Categories
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    slug VARCHAR(150),
    parent_id UUID REFERENCES categories(category_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(category_id),
    name VARCHAR(150) UNIQUE NOT NULL,
    slug VARCHAR(150),
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    discount_price NUMERIC(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE product_variants (
    product_variant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    size VARCHAR(5) NOT NULL,
    color VARCHAR(20),
    sku VARCHAR(255),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    product_image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE product_reviews (
    product_review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rating FLOAT NOT NULL,
    comment TEXT,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shopping_carts (
    shopping_cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    cart_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quantity INTEGER NOT NULL,
    shopping_cart_id UUID NOT NULL REFERENCES shopping_carts(shopping_cart_id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES product_variants(product_variant_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    order_status VARCHAR(20) NOT NULL,
    issue_date DATE NOT NULL,
    delivered_date DATE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    billing_address_id UUID NOT NULL REFERENCES user_addresses(user_address_id) ON DELETE CASCADE,
    shipping_address_id UUID NOT NULL REFERENCES user_addresses(user_address_id) ON DELETE CASCADE

);

CREATE TABLE order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES product_variants(product_variant_id) ON DELETE CASCADE

);






CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE,  -- 'privacy', 'cookie', 'terms'
    title VARCHAR(255) NOT NULL,       -- e.g., "Privacy Policy"
    content TEXT NOT NULL,             -- full policy text (can be long)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial rows
INSERT INTO policies (type, title, content)
VALUES 
('privacy', 'Privacy Policy', 'Your privacy policy content here...'),
('cookie', 'Cookie Policy', 'Your cookie policy content here...'),
('terms', 'Terms of Service', 'Your terms of service content here...');




CREATE TABLE discount_or_coupon_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    discount_type VARCHAR(50) NOT NULL, --percentage/fixed
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_value NUMERIC(10,2) NOT NULL,
    expiry_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE website_settings (
    id SERIAL PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);



