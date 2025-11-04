import React from 'react';
import type { ProductCategory } from '../types';
import { PRODUCTS_CONFIG } from '../constants';

interface ProductSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ selectedIds, onSelectionChange }) => {

  const handleSelection = (id: string, category: ProductCategory) => {
    if (category.selectionType === 'single') {
      onSelectionChange([id]);
    } else {
      const newSelection = selectedIds.includes(id)
        ? selectedIds.filter(selectedId => selectedId !== id)
        : [...selectedIds, id];
      
      // If user selects an a la carte item, deselect any package
      const packageIds = PRODUCTS_CONFIG.find(c => c.selectionType === 'single')?.products.map(p => p.id) || [];
      const filteredSelection = newSelection.filter(sid => !packageIds.includes(sid));

      onSelectionChange(filteredSelection);
    }
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  return (
    <div className="space-y-6">
      {PRODUCTS_CONFIG.map((category) => (
        <div key={category.name}>
          <h3 className="text-lg font-semibold text-slate-200">{category.name}</h3>
          <p className="text-sm text-slate-400 mb-3">{category.description}</p>
          <div className="space-y-3">
            {category.products.map((product) => (
              <label
                key={product.id}
                htmlFor={product.id}
                className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${isSelected(product.id) ? 'bg-cyan-900/50 border-cyan-700' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}
              >
                <input
                  type={category.selectionType === 'single' ? 'radio' : 'checkbox'}
                  id={product.id}
                  name={category.selectionType === 'single' ? 'package' : product.id}
                  checked={isSelected(product.id)}
                  onChange={() => handleSelection(product.id, category)}
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-600 focus:ring-cyan-500"
                />
                <div className="ml-3 text-sm">
                  <span className="font-medium text-slate-200">{product.name}</span>
                  <p className="text-slate-400">{product.description}</p>
                  <p className="font-semibold text-cyan-400 mt-1">
                    {product.priceOneTime > 0 && <span>${product.priceOneTime.toLocaleString()} one-time</span>}
                    {product.priceOneTime > 0 && product.priceMonthly > 0 && <span className="mx-1">+</span>}
                    {product.priceMonthly > 0 && <span>${product.priceMonthly.toLocaleString()}/mo</span>}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};