import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { DamagedPart } from '../types/survey';

interface DamagedPartsTableProps {
  parts: DamagedPart[];
  onUpdate: (id: string, updates: Partial<DamagedPart>) => void;
  onRemove: (id: string) => void;
}

export const DamagedPartsTable: React.FC<DamagedPartsTableProps> = ({
  parts,
  onUpdate,
  onRemove,
}) => {
  if (parts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No damaged parts added yet. Click "Add Part" to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
              Part Name
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
              Damage Type
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
              Part Cost (₹)
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
              Labor Cost (₹)
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
              Total (₹)
            </th>
            <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, index) => (
            <motion.tr
              key={part.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="hover:bg-gray-50"
            >
              <td className="border border-gray-300 px-4 py-3">
                <input
                  type="text"
                  value={part.partName}
                  onChange={(e) => onUpdate(part.id, { partName: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter part name"
                />
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <select
                  value={part.damageType}
                  onChange={(e) => onUpdate(part.id, { damageType: e.target.value as 'Replace' | 'Repair' })}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Replace">Replace</option>
                  <option value="Repair">Repair</option>
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <input
                  type="number"
                  value={part.partCost}
                  onChange={(e) => onUpdate(part.id, { partCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <input
                  type="number"
                  value={part.laborCost}
                  onChange={(e) => onUpdate(part.id, { laborCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </td>
              <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                ₹{(part.partCost + part.laborCost).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                <motion.button
                  type="button"
                  onClick={() => onRemove(part.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-semibold">
            <td colSpan={2} className="border border-gray-300 px-4 py-3 text-right">
              Total:
            </td>
            <td className="border border-gray-300 px-4 py-3">
              ₹{parts.reduce((sum, part) => sum + part.partCost, 0).toLocaleString()}
            </td>
            <td className="border border-gray-300 px-4 py-3">
              ₹{parts.reduce((sum, part) => sum + part.laborCost, 0).toLocaleString()}
            </td>
            <td className="border border-gray-300 px-4 py-3">
              ₹{parts.reduce((sum, part) => sum + part.partCost + part.laborCost, 0).toLocaleString()}
            </td>
            <td className="border border-gray-300 px-4 py-3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};