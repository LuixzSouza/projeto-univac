import React from 'react';

// --- Interfaces para permitir atributos HTML padrão ---

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

// --- Components ---

// Componente principal da Tabela
export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg bg-bg-base shadow-md border border-border">
      <table 
        className={`w-full min-w-full divide-y divide-border ${className || ''}`} 
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

// Cabeçalho da Tabela
export function TableHeader({ children, className, ...props }: TableSectionProps) {
  return (
    <thead className={`bg-bg-surface ${className || ''}`} {...props}>
      {children}
    </thead>
  );
}

// Corpo da Tabela
export function TableBody({ children, className, ...props }: TableSectionProps) {
  return (
    <tbody className={`divide-y divide-border bg-bg-base ${className || ''}`} {...props}>
      {children}
    </tbody>
  );
}

// Linha da Tabela
export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr 
      // Juntamos a classe padrão com a classe que vem de fora (className)
      className={`hover:bg-border transition-colors ${className || ''}`} 
      {...props} 
    >
      {children}
    </tr>
  );
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