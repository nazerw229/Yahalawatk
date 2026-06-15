import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Menu,
  X,
  ShoppingCart,
  Phone,
  MapPin,
  Clock,
  Star,
  Heart,
  Sparkles,
  Palette,
  Scissors,
  SprayCan,
  Package,
  ChevronLeft,
  Check,
  MessageCircle
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Category {
  id: string;
  name_ar: string;
  icon: string;
  sort_order: number;
}

interface Product {
  id: string;
  name_ar: string;
  description_ar: string;
  price: number;
  old_price: number | null;
  image_url: string;
  category_id: string;
  featured: boolean;
  in_stock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'sparkles': return Sparkles;
    case 'palette': return Palette;
    case 'scissors': return Scissors;
    case 'spray': return SprayCan;
    default: return Package;
  }
};

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('sort_order')
    ]);

    if (catRes.data) setCategories(catRes.data);
    if (prodRes.data) setProducts(prodRes.data);
    setLoading(false);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  const featuredProducts = products.filter(p => p.featured);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQty = Math.max(0, item.quantity + delta);
          return newQty === 0 ? null : { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    setShowOrderSuccess(true);
    setCart([]);
    setTimeout(() => {
      setShowOrderSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero font-tajawal">
      {/* Order Success Modal */}
      {showOrderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 mx-4 shadow-2xl text-center max-w-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">تم استلام طلبك!</h3>
            <p className="text-gray-500">سنتواصل معك قريباً لتأكيد التوصيل</p>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsCartOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">سلة المشتريات</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">سلة المشتريات فارغة</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                        <img
                          src={item.image_url}
                          alt={item.name_ar}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{item.name_ar}</h4>
                          <p className="text-pink-600 font-bold">{item.price} ر.س</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="mr-auto text-red-500 hover:text-red-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">المجموع</span>
                      <span className="text-2xl font-bold text-pink-600">{cartTotal.toFixed(2)} ر.س</span>
                    </div>
                    <button onClick={placeOrder} className="btn-primary w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600">
                      <MessageCircle className="w-5 h-5" />
                      إتمام الطلب عبر واتساب
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-primary-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">يا حلاوتك</h1>
                <p className="text-xs text-gray-500">مستحضرات تجميل فاخرة</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#products" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">المنتجات</a>
              <a href="#featured" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">المميزة</a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">تواصل معنا</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-pink-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2 pb-4">
              <a href="#products" className="block px-4 py-2 hover:bg-primary-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>المنتجات</a>
              <a href="#featured" className="block px-4 py-2 hover:bg-primary-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>المميزة</a>
              <a href="#contact" className="block px-4 py-2 hover:bg-primary-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>تواصل معنا</a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-right">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 fill-pink-500" />
                <span className="text-sm font-medium">أجود مستحضرات التجميل</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
                يا حلاوتك
                <span className="block bg-gradient-to-l from-pink-500 to-primary-500 bg-clip-text text-transparent">للجمال والأناقة</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                نقدم لك أرقى مستحضرات التجميل والعناية من أشهر الماركات العالمية
                لإبراز جمالك الطبيعي بأناقة لا تُضاهى
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="#products" className="btn-primary flex items-center gap-2">
                  تصفح المنتجات
                  <ChevronLeft className="w-5 h-5" />
                </a>
                <a href="#contact" className="btn-secondary">
                  تواصل معنا
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-primary-300 rounded-full blur-3xl opacity-40 animate-pulse" />
                <img
                  src="https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="مستحضرات تجميل فاخرة"
                  className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              الكل
            </button>
            {categories.map(cat => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {cat.name_ar}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16 px-4 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">المنتجات المميزة</h2>
            <p className="section-subtitle">أفضل المنتجات المختارة لك</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Products */}
      <section id="products" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">جميع المنتجات</h2>
            <p className="section-subtitle">تشكيلة متنوعة من أفضل مستحضرات التجميل</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">تواصل معنا</h2>
              <p className="text-gray-400 mb-8">
                نحن هنا لمساعدتك في اختيار أفضل مستحضرات التجميل
              </p>
              <div className="space-y-4">
                <a href="tel:+966574825958" className="flex items-center gap-4 hover:text-pink-400 transition-colors">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">اتصل بنا</p>
                    <p className="font-bold">0574825958</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">العنوان</p>
                    <p className="font-bold">جدة - شارع صاري - حي الروضة</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">ساعات العمل</p>
                    <p className="font-bold">يومياً من 9 صباحاً حتى 11 مساءً</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">أرسل رسالة</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم"
                  className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 focus:border-primary-400 focus:outline-none transition-colors"
                />
                <input
                  type="tel"
                  placeholder="رقم الجوال"
                  className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 focus:border-primary-400 focus:outline-none transition-colors"
                />
                <textarea
                  placeholder="رسالتك"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 focus:border-primary-400 focus:outline-none transition-colors resize-none"
                />
                <button type="submit" className="btn-primary w-full bg-pink-500 hover:bg-pink-600">
                  إرسال
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-950 text-center text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-pink-500" />
            <span className="font-bold text-white">يا حلاوتك</span>
          </div>
          <p>جميع الحقوق محفوظة {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image_url}
          alt={product.name_ar}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {product.old_price && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            خصم
          </div>
        )}
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-3 left-3 right-3 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          أضف للسلة
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2">{product.name_ar}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description_ar}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-pink-600">{product.price} ر.س</span>
            {product.old_price && (
              <span className="text-sm text-gray-400 line-through">{product.old_price} ر.س</span>
            )}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
