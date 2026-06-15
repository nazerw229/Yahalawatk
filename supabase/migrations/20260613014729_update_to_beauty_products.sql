-- Clear existing data
DELETE FROM products;
DELETE FROM categories;

-- Insert beauty categories
INSERT INTO categories (name_ar, icon, sort_order) VALUES
('العناية بالبشرة', 'sparkles', 1),
('المكياج', 'palette', 2),
('العناية بالشعر', 'scissors', 3),
('العطور', 'spray', 4);

-- Insert beauty products
INSERT INTO products (name_ar, description_ar, price, old_price, image_url, category_id, featured, sort_order) VALUES
('كريم مرطب بالصبار', 'كريم مرطب غني بمستخلص الصبار الطبيعي لترطيب البشرة بعمق', 89.00, 120.00, 'https://images.pexels.com/photos/3685563/pexels-photo-3685563.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'العناية بالبشرة'), true, 1),
('سيروم فيتامين سي', 'سيروم مركز لمعان البشرة وتوحيد لونها مع فيتامين سي النقي', 149.00, NULL, 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'العناية بالبشرة'), true, 2),
('لوحة ظلال عيون احترافية', 'لوحة ظلال عيون بـ ١٨ لون متنوع بألوان راقية وثبات عالي', 199.00, 250.00, 'https://images.pexels.com/photos/2586381/pexels-photo-2586381.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'المكياج'), true, 3),
('أحمر شفات ذو ثبات طويل', 'أحمر شفات كريمي بثبات يدوم ١٢ ساعة بألوان جذابة', 79.00, NULL, 'https://images.pexels.com/photos/2614328/pexels-photo-2614328.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'المكياج'), false, 4),
('ماسكارا تكثيف الرموش', 'ماسكارا لتكثيف وإطالة الرموش بفرشاة مبتكرة', 65.00, NULL, 'https://images.pexels.com/photos/2614237/pexels-photo-2614237.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'المكياج'), false, 5),
('شامبو بالأرغان', 'شامبو بالزيت المغربي الأصلي لشعر صحي ولامع', 95.00, 130.00, 'https://images.pexels.com/photos/4039175/pexels-photo-4039175.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'العناية بالشعر'), true, 6),
('ماسك للشعر بالكيراتين', 'ماسك مغذٍ بالكيراتين لإصلاح الشعر التالف', 120.00, NULL, 'https://images.pexels.com/photos/4038677/pexels-photo-4038677.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'العناية بالشعر'), false, 7),
('عطر نسائي فاخر', 'عطر برائحة زهورية فاخرة تدوم طويلاً', 299.00, 350.00, 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'العطور'), true, 8),
('كريم عيون مضاد للتجاعيد', 'كريم للعناية بمنطقة العين ومحاربة الخطوط الرفيعة', 180.00, NULL, 'https://images.pexels.com/photos/4041399/pexels-photo-4041399.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'العناية بالبشرة'), false, 9),
('بخاخ حماية من الشمس', 'بخاخ واقي شمسي SPF 50+ حماية قصوى من الأشعة', 75.00, NULL, 'https://images.pexels.com/photos/3990378/pexels-photo-3990378.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE name_ar = 'العناية بالبشرة'), false, 10);