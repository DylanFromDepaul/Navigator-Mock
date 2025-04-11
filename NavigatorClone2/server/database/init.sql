-- Initialize the database schema for Navigator

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  order_number VARCHAR(4) UNIQUE NOT NULL,
  order_name VARCHAR(255) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) CHECK (status IN ('Confirmed', 'Tentative', 'Quote', 'Canceled')),
  type VARCHAR(50) CHECK (type IN ('Event', 'Internal')),
  net_total DECIMAL(10,2),
  bill_to_contact VARCHAR(255),
  sales_manager VARCHAR(255),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  job_id SERIAL PRIMARY KEY,
  job_number VARCHAR(5) UNIQUE NOT NULL,
  order_id INTEGER REFERENCES orders(order_id),
  room VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  net_due DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
  equipment_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  std_rate DECIMAL(10,2) NOT NULL,
  is_package BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Equipment Table (Junction table for many-to-many relationship)
CREATE TABLE IF NOT EXISTS job_equipment (
  job_id INTEGER REFERENCES jobs(job_id),
  equipment_id INTEGER REFERENCES equipment(equipment_id),
  quantity INTEGER NOT NULL DEFAULT 1,
  rate DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (job_id, equipment_id)
);

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
  note_id SERIAL PRIMARY KEY,
  note_type VARCHAR(50) NOT NULL,
  related_id INTEGER NOT NULL,
  note_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample equipment data
INSERT INTO equipment (name, std_rate, is_package) VALUES
  ('Meeting Room Projector Package', 74.54, TRUE),
  ('Projector', 17.04, FALSE),
  ('Tripod Screen 8''', 57.50, FALSE),
  ('HDMI Cable', 0, FALSE),
  ('Flipchart Package', 141.75, TRUE),
  ('Wi-Fi Connections 3 Mbps', 25, FALSE),
  ('LED TV - 55"', 250, FALSE),
  ('LED TV - 70"', 350, FALSE),
  ('Wireless Handheld Microphone', 85, FALSE),
  ('Basic Audio Package', 175, TRUE); 