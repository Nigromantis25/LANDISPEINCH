// Reservations page JS
const API_BASE = 'http://localhost:3001';

async function loadReservations() {
    const tableBody = document.querySelector('#reservationsTable tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
    try {
        const res = await fetch(`${API_BASE}/api/reservas`);
        if (!res.ok) throw new Error('Error cargando reservas');
        const data = await res.json();
        tableBody.innerHTML = '';
        // También incluir reservas locales guardadas en el navegador
        const local = getClientLocalReservas();
        const merged = Array.isArray(data) ? data.concat(local) : local;
        data.forEach(r => {
            const tr = document.createElement('tr');
            const idLiteral = JSON.stringify(r.id);
            tr.innerHTML = `
                <td data-label="ID">${r.id}</td>
                <td data-label="Nombre">${r.nombre}</td>
                <td data-label="Email">${r.email}</td>
                <td data-label="Destino">${r.destino}</td>
                <td data-label="Fechas">${r.fecha_salida || ''} - ${r.fecha_retorno || ''}</td>
                <td data-label="Personas">${r.personas}</td>
                <td data-label="Acciones">
                    <div class="actions-group">
                        <button class="cta-button small secondary" title="Editar" onclick="openEditReservation(${idLiteral})"><i class="fas fa-edit"></i></button>
                        <button class="cta-button small danger" title="Eliminar" onclick="deleteReservation(${idLiteral})"><i class="fas fa-trash"></i></button>
                        <button class="cta-button small" title="Factura" onclick="openInvoiceFromReservation(${idLiteral})"><i class="fas fa-file-invoice"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        // renderizar las locales que no vinieron en data
        if (Array.isArray(local) && local.length) {
            local.forEach(r => {
                const tr = document.createElement('tr');
                const idLiteral = JSON.stringify(r.id);
                tr.innerHTML = `
                    <td data-label="ID">${r.id}</td>
                    <td data-label="Nombre">${r.nombre}</td>
                    <td data-label="Email">${r.email}</td>
                    <td data-label="Destino">${r.destino}</td>
                    <td data-label="Fechas">${r.fecha_salida || ''} - ${r.fecha_retorno || ''}</td>
                    <td data-label="Personas">${r.personas}</td>
                    <td data-label="Acciones">
                        <div class="actions-group">
                            <button class="cta-button small secondary" title="Editar" onclick="openEditReservation(${idLiteral})"><i class="fas fa-edit"></i></button>
                            <button class="cta-button small danger" title="Eliminar" onclick="deleteReservation(${idLiteral})"><i class="fas fa-trash"></i></button>
                            <span class="badge">Local</span>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error(err);
        // Si falla la llamada al servidor, intentar cargar reservas guardadas en localStorage
        const local = getClientLocalReservas();
        if (local && local.length) {
            tableBody.innerHTML = '';
            local.forEach(r => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${r.id}</td>
                    <td>${r.nombre}</td>
                    <td>${r.email}</td>
                    <td>${r.destino}</td>
                    <td>${r.fecha_salida || ''} - ${r.fecha_retorno || ''}</td>
                    <td>${r.personas}</td>
                    <td>
                        <span class="badge">Local</span>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="7">No se pudieron cargar las reservas.</td></tr>';
        }
    }
}

// Helpers localStorage (cliente) - para mostrar reservas guardadas cuando no hay servidor
function getClientLocalReservas() {
    try {
        const raw = localStorage.getItem('openworld_local_reservas') || '[]';
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error('getClientLocalReservas error', err);
        return [];
    }
}

async function deleteReservation(id) {
    if (!confirm('¿Eliminar esta reserva?')) return;
    // si es una reserva local (id string que empieza con local-), eliminar de localStorage
    try {
        if (typeof id === 'string' && id.startsWith('local-')) {
            const local = getClientLocalReservas();
            const remaining = local.filter(r => r.id !== id);
            localStorage.setItem('openworld_local_reservas', JSON.stringify(remaining));
            if (typeof showNotification === 'function') showNotification('Reserva local eliminada'); else alert('Reserva eliminada');
            loadReservations();
            return;
        }

        const res = await fetch(`${API_BASE}/api/reservas/${id}`, { method: 'DELETE' });
        if (res.ok) {
            if (typeof showNotification === 'function') showNotification('Reserva eliminada'); else alert('Reserva eliminada');
            loadReservations();
        } else {
            const e = await res.json().catch(() => ({}));
            if (typeof showNotification === 'function') showNotification(e.message || 'Error al eliminar'); else alert(e.message || 'Error al eliminar');
        }
    } catch (err) {
        console.error(err);
        if (typeof showNotification === 'function') showNotification('Error al eliminar reserva'); else alert('Error al eliminar reserva');
    }
}

async function openEditReservation(id) {
    try {
        let r = null;
        // Si es ID local, obtener desde localStorage
        if (typeof id === 'string' && id.startsWith('local-')) {
            const local = getClientLocalReservas();
            r = local.find(x => x.id === id);
            if (!r) throw new Error('Reserva local no encontrada');
        } else {
            const res = await fetch(`${API_BASE}/api/reservas/${id}`);
            if (!res.ok) throw new Error('Reserva no encontrada');
            r = await res.json();
        }

        const modal = document.getElementById('editBookingModal');
        const form = document.getElementById('editBookingForm');
        form.querySelector('input[name="nombre"]').value = r.nombre || '';
        form.querySelector('input[name="email"]').value = r.email || '';
        form.querySelector('input[name="telefono"]').value = r.telefono || '';
        form.querySelector('input[name="destino"]').value = r.destino || '';
        form.querySelector('input[name="fechaSalida"]').value = r.fecha_salida ? (r.fecha_salida.split ? r.fecha_salida.split(' ')[0] : r.fecha_salida) : '';
        form.querySelector('input[name="fechaRetorno"]').value = r.fecha_retorno ? (r.fecha_retorno.split ? r.fecha_retorno.split(' ')[0] : r.fecha_retorno) : '';
        form.querySelector('input[name="personas"]').value = r.personas || 1;
        form.querySelector('textarea[name="preferencias"]').value = r.preferencias || r.preferencias || '';
        document.getElementById('editReservaId').value = r.id;
        modal.style.display = 'flex';
        modal.classList.add('active');
    } catch (err) {
        console.error(err);
        if (typeof showNotification === 'function') showNotification('No se pudo cargar la reserva para editar'); else alert('No se pudo cargar la reserva para editar');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadReservations();

    // Edit modal handlers
    const editModal = document.getElementById('editBookingModal');
    const closeEdit = document.querySelector('.close-edit');
    if (closeEdit) closeEdit.addEventListener('click', () => { editModal.style.display = 'none'; editModal.classList.remove('active'); });
    if (editModal) editModal.addEventListener('click', function(e) { if (e.target === editModal) { editModal.style.display = 'none'; editModal.classList.remove('active'); } });

    const editForm = document.getElementById('editBookingForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const reservaId = document.getElementById('editReservaId').value;
            const nombre = editForm.querySelector('input[name="nombre"]').value;
            const email = editForm.querySelector('input[name="email"]').value;
            const telefono = editForm.querySelector('input[name="telefono"]').value;
            const destino = editForm.querySelector('input[name="destino"]').value;
            const fechaSalida = editForm.querySelector('input[name="fechaSalida"]').value;
            const fechaRetorno = editForm.querySelector('input[name="fechaRetorno"]').value;
            const personas = editForm.querySelector('input[name="personas"]').value;
            const preferencias = editForm.querySelector('textarea[name="preferencias"]').value;
            try {
                // Si es ID local, actualizar en localStorage
                if (typeof reservaId === 'string' && reservaId.startsWith('local-')) {
                    const local = getClientLocalReservas();
                    const idx = local.findIndex(x => x.id === reservaId);
                    if (idx > -1) {
                        local[idx] = Object.assign({}, local[idx], {
                            nombre, email, telefono, destino,
                            fecha_salida: fechaSalida || null,
                            fecha_retorno: fechaRetorno || null,
                            personas: personas || 1,
                            preferencias: preferencias || ''
                        });
                        localStorage.setItem('openworld_local_reservas', JSON.stringify(local));
                        if (typeof showNotification === 'function') showNotification('Reserva local actualizada'); else alert('Reserva actualizada');
                        editModal.style.display = 'none';
                        editModal.classList.remove('active');
                        loadReservations();
                        return;
                    }
                }

                const res = await fetch(`${API_BASE}/api/reservas/${reservaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias })
                });
                if (res.ok) {
                    if (typeof showNotification === 'function') showNotification('Reserva actualizada'); else alert('Reserva actualizada');
                    editModal.style.display = 'none';
                    editModal.classList.remove('active');
                    loadReservations();
                } else {
                    const e = await res.json().catch(() => ({}));
                    if (typeof showNotification === 'function') showNotification(e.message || 'Error al actualizar'); else alert(e.message || 'Error al actualizar');
                }
            } catch (err) {
                console.error(err);
                if (typeof showNotification === 'function') showNotification('Error al actualizar reserva'); else alert('Error al actualizar reserva');
            }
        });
    }

    // Invoice modal handlers
    const invoiceModal = document.getElementById('invoiceModal');
    const closeInvoiceBtn = document.querySelector('.close-invoice');
    if (closeInvoiceBtn) closeInvoiceBtn.addEventListener('click', () => { invoiceModal.style.display = 'none'; invoiceModal.classList.remove('active'); });
    if (invoiceModal) invoiceModal.addEventListener('click', function(e) { if (e.target === invoiceModal) { invoiceModal.style.display = 'none'; invoiceModal.classList.remove('active'); } });

    const invoiceForm = document.getElementById('invoiceForm');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const reservaId = document.getElementById('invoiceReservaId').value || null;
            const nombre = document.getElementById('invoiceNombre').value;
            const email = document.getElementById('invoiceEmail').value;
            const telefono = document.getElementById('invoiceTelefono').value;
            const destino = document.getElementById('invoiceDestino').value;
            const metodoPago = document.getElementById('invoicePago').value;
            try {
                const res = await fetch(`${API_BASE}/api/facturas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reservaId, nombre, email, telefono, destino, metodoPago })
                });
                if (res.ok) {
                    const data = await res.json();
                    alert('Factura generada');
                    invoiceModal.style.display = 'none';
                    invoiceModal.classList.remove('active');
                    const factura = data.factura || {};
                    const win = window.open('', '_blank');
                    win.document.write(`<pre>${JSON.stringify(factura, null, 2)}</pre>`);
                } else {
                    const err = await res.json().catch(() => ({}));
                    alert(err.message || 'Error generando factura');
                }
            } catch (err) {
                console.error(err);
                alert('Error al generar factura');
            }
        });
    }
});

function openInvoiceFromReservation(reservaId) {
    // Soporte para reservas locales y remotas
    (async function(){
        try {
            let r = null;
            if (typeof reservaId === 'string' && reservaId.startsWith('local-')) {
                const local = getClientLocalReservas();
                r = local.find(x => x.id === reservaId);
                if (!r) throw new Error('Reserva local no encontrada');
            } else {
                const res = await fetch(`${API_BASE}/api/reservas/${reservaId}`);
                if (!res.ok) throw new Error('Reserva no encontrada');
                r = await res.json();
            }

            document.getElementById('invoiceReservaId').value = r.id;
            document.getElementById('invoiceNombre').value = r.nombre || '';
            document.getElementById('invoiceEmail').value = r.email || '';
            document.getElementById('invoiceTelefono').value = r.telefono || '';
            document.getElementById('invoiceDestino').value = r.destino || '';
            const modal = document.getElementById('invoiceModal');
            modal.style.display = 'flex';
            modal.classList.add('active');
        } catch (err) {
            console.error(err);
            if (typeof showNotification === 'function') showNotification('No se pudo cargar la reserva'); else alert('No se pudo cargar la reserva');
        }
    })();
}
