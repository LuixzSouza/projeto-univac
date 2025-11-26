// Helper para facilitar o log no frontend
export async function logAction(acao: string, recurso: string, detalhe: string, autor: string) {
    try {
        await fetch('/api/auditoria', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ acao, recurso, detalhe, autor })
        });
    } catch (e) {
        console.error("Falha silenciosa ao logar", e);
    }
}