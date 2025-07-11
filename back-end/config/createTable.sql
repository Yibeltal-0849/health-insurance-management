--federal sub city 
CREATE TABLE sub_cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Regions (top-level)
CREATE TABLE regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) UNIQUE
);

-- 2. Zones (depends on regions)
CREATE TABLE zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  region_id INT,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 3. Woredas (depends on zones)
CREATE TABLE woredas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  zone_id INT,
  sub_city_id INT,
  FOREIGN KEY (zone_id) REFERENCES zones(id),
  FOREIGN key(sub_city_id) REFERENCES sub_cities(id)
  
);

-- 4. Kebeles (depends on woredas)
CREATE TABLE kebeles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE,
  region_id INT,
  zone_id INT,
  woreda_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (zone_id) REFERENCES zones(id),
  FOREIGN KEY (worda_id) REFERENCES woredas(id)
);

-- 5. Health Facilities (needs region, zone, woreda, kebele)
CREATE TABLE health_facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type ENUM('hospital', 'health_center') NOT NULL,
  region_id INT,
  zone_id INT,
  woreda_id INT,
  kebele_id INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (zone_id) REFERENCES zones(id),
  FOREIGN KEY (woreda_id) REFERENCES woredas(id),
  FOREIGN KEY (kebele_id) REFERENCES kebeles(id)

);

-- 6. Users (needs kebele and health_facility optional)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255) NOT NULL,
  health_facility_id INT,
  role ENUM(
    'admin',
    'regional_health_bureau',
    'SubCity_health_officer',
    'woreda_health_officer',
    'hospital_health_officer',
    'zone_health_officer',
    'woreda_health_officer',  
    'customer',
    'kebele_health_officer',
    'healthCenter_officer'
  ) NOT NULL,
   customer_type ENUM('free', 'paid') DEFAULT NULL,
  region_id INT,
  zone_id INT,
  woreda_id INT,
  kebele_id INT,

  status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (health_facility_id) REFERENCES health_facilities(id),
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (zone_id) REFERENCES zones(id),
  FOREIGN KEY (woreda_id) REFERENCES woredas(id),
  FOREIGN KEY (kebele_id) REFERENCES kebeles(id)
);


-- 7. Customers (depends on users and kebeles)
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  kebele_id INT,
  woreda_id INT,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  age INT,                           
  gender ENUM('male', 'female', 'other'),
  family_size INT,
  phone_number VARCHAR(20),
  insurance_status ENUM('active', 'inactive', 'suspended') DEFAULT 'inactive',
  is_member BOOLEAN DEFAULT false,
  photo VARCHAR(255),                 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (kebele_id) REFERENCES kebeles(id),
  FOREIGN KEY (woreda_id) REFERENCES woreda_id(id)
);

--for payment to be membership to health insurance system
CREATE TABLE membership_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_reference VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_date DATETIME NULL,
  expired_date DATETIME NULL,
  chapa_response JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);


--register customer family
CREATE TABLE family_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,             
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  age INT,                             
  gender ENUM('male', 'female', 'other'),
  relationship VARCHAR(50),             
  insurance_status ENUM('active', 'inactive', 'suspended') DEFAULT 'inactive',
  photo VARCHAR(255),                   
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);


-- 8. Insurance Policies (created by users)
CREATE TABLE insurance_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  coverage TEXT NOT NULL,
  valid_from DATE,
  valid_to DATE,
  premium DECIMAL(10, 2),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);



-- 9. Claims (references customers, users, facilities)
CREATE TABLE claims (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  hospital_id INT NOT NULL,
  health_facility_id INT,
  service_description TEXT,
  amount DECIMAL(10, 2),
  status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
  approved_by INT,
  approval_date DATETIME,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (hospital_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  FOREIGN KEY (health_facility_id) REFERENCES health_facilities(id)
);

-- 10. Payments (references claims and users)
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  claim_id INT,
  approved_amount DECIMAL(10, 2),
  payment_date DATETIME,
  payment_method ENUM('bank', 'mobile', 'cash'),
  transaction_reference VARCHAR(100),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  processed_by INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (claim_id) REFERENCES claims(id),
  FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- 11. Logs (depends on users)
CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 12. Create initial admin
INSERT INTO `users` (
  id, username, first_name, last_name, email, password, role, kebele_id, status, created_at, updated_at
) VALUES (
  1, 'admin', 'Admin', 'admin', 'admin@gmail.com',
  '$2b$12$4QR2XPgKez6EWnFvuaUTROTaKzG.y1WSHYE/kw4C2WX/L022cdlVi',
  'admin', NULL, 'active', NOW(), NOW()
);



/* DELIMITER $$

CREATE TRIGGER update_family_insurance_status
AFTER UPDATE ON membership_payments
FOR EACH ROW
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE family_members
    SET insurance_status = 'active'
    WHERE customer_id = NEW.customer_id;
  END IF;
END$$

DELIMITER ;*/


---This trigger is stored in the database and will automatically run every time an UPDATE is made to the membership_payments table where the status becomes 'completed'.

/*
Steps in phpMyAdmin:
Select your database.
Click on the SQL tab.
Paste the trigger code.
Click Go
*/
