import React from 'react';

// --- Interfaces to allow standard HTML attributes ---

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

// --- Components ---

// Componente principal da Tabela
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-bg-base shadow-md border border-border">
      <table className="w-full min-w-full divide-y divide-border">
        {children}
      </table>
    </div>
  );
}

// Cabeçalho da Tabela
export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-bg-surface">{children}</thead>;
}

// Corpo da Tabela
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border bg-bg-base">{children}</tbody>;
}

// Linha da Tabela
export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-border transition-colors">{children}</tr>;
}

// Célula de Cabeçalho
export function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted ${className || ''}`}
      {...props}
    >
      {children}
    </th>
  );
}

// Célula de Dados
export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={`px-6 py-4 text-sm text-text-base ${className || ''}`}
      {...props}
    >
      {children}
    </td>
  );
}