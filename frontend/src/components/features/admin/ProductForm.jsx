import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProducts } from '../../../context/ProductsContext';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { baseProducts, addProduct, editProduct } = useProducts();
  
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'hotdogs',
    badge: '',
    badgeColor: 'bg-brand-yellow text-brand-black',
    image: ''
  });

  useEffect(() => {
    if (isEditing) {
      const productToEdit = baseProducts.find(p => p.id.toString() === id);
      if (productToEdit) {
        setFormData({
          name: productToEdit.name || '',
          description: productToEdit.description || '',
          price: productToEdit.price || '',
          category: productToEdit.category || 'hotdogs',
          badge: productToEdit.badge || '',
          badgeColor: productToEdit.badgeColor || 'bg-brand-yellow text-brand-black',
          image: productToEdit.image || ''
        });
      } else {
        navigate('/admin'); // Not found
      }
    }
  }, [id, baseProducts, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productPayload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      badge: formData.badge.trim() === '' ? null : formData.badge.trim()
    };

    if (isEditing) {
      editProduct(parseInt(id, 10) || id, productPayload);
    } else {
      addProduct(productPayload);
    }

    navigate('/admin');
  };

  const badgeColorOptions = [
    { value: 'bg-brand-yellow text-brand-black', label: 'Amarelo' },
    { value: 'bg-brand-red text-white', label: 'Vermelho' },
    { value: 'bg-blue-600 text-white', label: 'Azul' },
    { value: 'bg-green-600 text-white', label: 'Verde' },
    { value: 'bg-amber-500 text-white', label: 'Laranja' },
    { value: 'bg-purple-600 text-white', label: 'Roxo' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="w-10 h-10 bg-brand-gray-mid rounded-xl flex items-center justify-center text-white hover:bg-brand-gray-light transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <div>
          <h2 className="font-display font-bold text-white text-3xl">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Preencha as informações do item para seu cardápio.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-gray-dark border border-brand-gray-mid rounded-2xl p-6 md:p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-300">Nome do Produto *</label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Hot Dog Supremo"
              className="w-full bg-brand-black border border-brand-gray-mid rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Categoria *</label>
            <select 
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-brand-black border border-brand-gray-mid rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow transition-all appearance-none"
            >
              <option value="hotdogs">Hot Dogs</option>
              <option value="combos">Combos</option>
              <option value="drinks">Bebidas</option>
              <option value="extras">Adicionais</option>
            </select>
          </div>

          {/* Preço */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Preço (R$) *</label>
            <input 
              required
              type="number" 
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ex: 25.90"
              className="w-full bg-brand-black border border-brand-gray-mid rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow transition-all"
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Descrição</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Descreva os ingredientes ou detalhes do produto..."
            className="w-full bg-brand-black border border-brand-gray-mid rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow transition-all resize-none custom-scrollbar"
          />
        </div>

        <div className="border-t border-brand-gray-mid/50 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Badge */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Selo de Destaque (Badge)</label>
            <input 
              type="text" 
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="Ex: Mais Vendido, Novo!"
              className="w-full bg-brand-black border border-brand-gray-mid rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Cor do Selo</label>
            <select 
              name="badgeColor"
              value={formData.badgeColor}
              onChange={handleChange}
              disabled={!formData.badge.trim()}
              className="w-full bg-brand-black border border-brand-gray-mid rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
              {badgeColorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Imagem */}
        <div className="border-t border-brand-gray-mid/50 pt-6">
           <label className="block text-sm font-medium text-gray-300 mb-3">Imagem do Produto</label>
           <div className="flex items-center gap-6">
             <div className="w-24 h-24 bg-brand-black border-2 border-dashed border-brand-gray-mid rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
               {formData.image ? (
                 <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-3xl opacity-30">🖼️</span>
               )}
             </div>
             <div className="flex-1">
               <label className="cursor-pointer bg-brand-gray-mid hover:bg-brand-gray-light text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors inline-block mb-2">
                 Escolher Arquivo
                 <input 
                   type="file" 
                   accept="image/*"
                   className="hidden"
                   onChange={handleImageUpload}
                 />
               </label>
               <p className="text-xs text-gray-500">
                 A imagem ficará salva temporariamente na memória durante os testes (Base64).
               </p>
             </div>
           </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button type="submit" className="w-full btn-yellow py-4 text-lg font-bold">
            {isEditing ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </div>

      </form>
    </div>
  );
}
