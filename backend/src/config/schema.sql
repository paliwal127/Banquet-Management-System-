BEGIN;

CREATE TABLE IF NOT EXISTS venues (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    max_capacity INT NOT NULL,
    location_type VARCHAR(20) CHECK (location_type IN ('Indoor', 'Outdoor', 'Hybrid')),
    base_rent DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'Archived'))
);

CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    company_name VARCHAR(100),
    gstin VARCHAR(15) UNIQUE,
    credit_limit DECIMAL(12,2) NOT NULL DEFAULT 50000.00,
    status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    venue_id VARCHAR(50) NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    event_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    billing_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Inquiry' CHECK (status IN ('Inquiry', 'Tentative', 'Confirmed', 'Archived')),
    CONSTRAINT chk_dates CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS beo_worksheets (
    id VARCHAR(50) PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    catering_pax INT NOT NULL DEFAULT 100,
    menu_package VARCHAR(50) DEFAULT 'Platinum',
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    setup_notes TEXT,
    client_signed BOOLEAN DEFAULT FALSE,
    finance_approved BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(50) PRIMARY KEY,
    dish_name VARCHAR(100) NOT NULL,
    category VARCHAR(20) CHECK (category IN ('Appetizer', 'Entree', 'Dessert', 'Beverage')),
    is_veg BOOLEAN DEFAULT TRUE,
    price_per_pax DECIMAL(10,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    base_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    delivery_sla_hours INT NOT NULL DEFAULT 24
);

CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL CHECK (department IN ('Kitchen', 'Banquet Ops', 'Sales', 'Finance')),
    role_title VARCHAR(50) NOT NULL,
    shift_preference VARCHAR(20) DEFAULT 'Day',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS payment_ledgers (
    id VARCHAR(50) PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(30) CHECK (payment_method IN ('Stripe', 'Bank Transfer', 'Cheque', 'Cash')),
    transaction_ref VARCHAR(100) UNIQUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(50) PRIMARY KEY,
    subject VARCHAR(150) NOT NULL,
    description TEXT,
    priority VARCHAR(15) CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO venues (id, name, max_capacity, location_type, base_rent, status)
VALUES ('V01', 'Grand Ballroom', 500, 'Indoor', 85000.00, 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO venues (id, name, max_capacity, location_type, base_rent, status)
VALUES ('V02', 'Sapphire Hall', 250, 'Indoor', 45000.00, 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO venues (id, name, max_capacity, location_type, base_rent, status)
VALUES ('V03', 'Poolside Lawn', 300, 'Outdoor', 60000.00, 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, name, company_name, gstin, credit_limit, status)
VALUES ('C01', 'Aditya Birla Group', 'ABG Corporate Services', '27AAAAA1111A1Z1', 150000.00, 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, name, company_name, gstin, credit_limit, status)
VALUES ('C02', 'Tanisha Roy', NULL, NULL, 50000.00, 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, venue_id, customer_id, event_name, start_date, end_date, billing_amount, paid_amount, status)
VALUES ('B01', 'V01', 'C01', 'ABG Annual Conclave', '2026-08-15', '2026-08-17', 245000.00, 122500.00, 'Confirmed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, venue_id, customer_id, event_name, start_date, end_date, billing_amount, paid_amount, status)
VALUES ('B02', 'V03', 'C02', 'Roy Wedding Reception', '2026-11-20', '2026-11-20', 125000.00, 0.00, 'Tentative')
ON CONFLICT (id) DO NOTHING;

INSERT INTO beo_worksheets (id, booking_id, version_number, catering_pax, menu_package, is_vegan, is_gluten_free, setup_notes, client_signed, finance_approved, last_updated)
VALUES ('BEO01', 'B01', 1, 350, 'Platinum', FALSE, FALSE, 'Set up stage box with projector at center. Round tables.', TRUE, TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO beo_worksheets (id, booking_id, version_number, catering_pax, menu_package, is_vegan, is_gluten_free, setup_notes, client_signed, finance_approved, last_updated)
VALUES ('BEO02', 'B02', 1, 150, 'Standard', TRUE, FALSE, 'Dietary swaps: Vegan entrees requested.', FALSE, FALSE, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, dish_name, category, is_veg, price_per_pax)
VALUES ('M01', 'Paneer Tikka Masala', 'Entree', TRUE, 450.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, dish_name, category, is_veg, price_per_pax)
VALUES ('M02', 'Chicken Biryani', 'Entree', FALSE, 550.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, dish_name, category, is_veg, price_per_pax)
VALUES ('M03', 'Chocolate Souffle', 'Dessert', TRUE, 250.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO vendors (id, name, category, rating, base_cost, delivery_sla_hours)
VALUES ('VND01', 'StageCraft Audio', 'AV & Sound', 5, 25000.00, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO vendors (id, name, category, rating, base_cost, delivery_sla_hours)
VALUES ('VND02', 'Flora Decorators', 'Florist & Decor', 4, 18000.00, 24)
ON CONFLICT (id) DO NOTHING;

INSERT INTO staff (id, name, department, role_title, shift_preference, is_active)
VALUES ('STF01', 'Chef Vikram', 'Kitchen', 'Head Chef', 'Day', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO staff (id, name, department, role_title, shift_preference, is_active)
VALUES ('STF02', 'Ramesh Pujari', 'Banquet Ops', 'Service Captain', 'Day', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment_ledgers (id, booking_id, amount, payment_method, transaction_ref, timestamp)
VALUES ('PAY01', 'B01', 122500.00, 'Stripe', 'ch_stripe_mock_289410', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO support_tickets (id, subject, description, priority, status, created_at)
VALUES ('TCK01', 'AV Projector flickering in Grand Ballroom', 'Need AV vendor StageCraft to check the HDMI cables.', 'High', 'Open', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

COMMIT;
