-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "categories_select" ON categories FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "categories_insert" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "categories_update" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "categories_delete" ON categories FOR DELETE TO authenticated USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "products_select" ON products FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "products_delete" ON products FOR DELETE TO authenticated USING (true);

-- Insert categories
INSERT INTO categories (name_ar, icon, sort_order) VALUES
('حلويات شرقية', 'cookie', 1),
('بسبوسة وكنافة', 'cake', 2),
('تشيزكيك', 'pie-chart', 3),
('حلويات غربية', 'ice-cream', 4);

-- Insert sample products
INSERT INTO products (name_ar, description_ar, price, old_price, image_url, category_id, featured, sort_order) VALUES
('بقلاوة تركية', 'بقلاوة طازجة محشوة بالفستق الحلبي الفاخر', 45.00, 55.00, 'https://images.pexels.com/photos/1170664/pexels-photo-1170664.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'حلويات شرقية'), true, 1),
('كنافة بالقشطة', 'كنافة ناعمة محشوة بالقشطة الطازجة ومقلية بالسمن البلدي', 35.00, NULL, 'https://images.pexels.com/photos/4687348/pexels-photo-4687348.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'بسبوسة وكنافة'), true, 2),
('تشيزكيك فراولة', 'تشيزكيك كريمي مع صوص الفراولة الطازجة', 55.00, 65.00, 'https://images.pexels.com/photos/1114138/pexels-photo-1114138.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'تشيزكيك'), true, 3),
('معمول بالتمر', 'معمول فاخر محشو بالتمر الفاخر', 25.00, NULL, 'https://images.pexels.com/photos/6293214/pexels-photo-6293214.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'حلويات شرقية'), false, 4),
('بسبوسة بالقشطة', 'بسبوسة طازجة مع طبقة كريمية من القشطة', 30.00, NULL, 'https://images.pexels.com/photos/4687350/pexels-photo-4687350.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'بسبوسة وكنافة'), false, 5),
('تي راميسو', 'تي راميسو إيطالي أصلي بالقهوة والماسكاربوني', 50.00, NULL, 'https://images.pexels.com/photos/5745334/pexels-photo-5745334.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'حلويات غربية'), true, 6),
('تشوكليت فوندان', 'كيكة شوكولاتة دافئة مع قلب سائل', 45.00, NULL, 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'حلويات غربية'), false, 7),
('بالظريفير', 'حلوى فرنسية راقية بالكريمة والفواكه', 60.00, NULL, 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'حلويات غربية'), false, 8);