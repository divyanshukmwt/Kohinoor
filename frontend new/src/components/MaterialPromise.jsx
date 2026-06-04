import React from 'react';

export const MaterialPromise = ({ materials = [], care = "" }) => {
  return (
    <div className="space-y-4 py-4">
      <ul className="space-y-3">
        {materials.map((material, idx) => (
          <li key={idx} className="flex items-center gap-3 text-body-md text-on-surface-variant">
            {/* Soft Gold vertical line as divider/bullet */}
            <div className="w-1 h-6 bg-gold-accent flex-shrink-0"></div>
            <span>{material}</span>
          </li>
        ))}
      </ul>
      {care && (
        <div className="mt-4 italic text-sm text-on-surface-variant bg-surface-container-low p-3 border-l-2 border-gold-accent">
          <strong>Care Promise:</strong> {care}
        </div>
      )}
    </div>
  );
};
