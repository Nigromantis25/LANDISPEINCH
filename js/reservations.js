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
        data.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.id}</td>
                <td>${r.nombre}</td>
                <td>${r.email}</td>
                <td>${r.destino}</td>
                <td>${r.fecha_salida || ''} - ${r.fecha_retorno || ''}</td>
                <td>${r.personas}</td>
                <td>
                    <button class="cta-button secondary" onclick="openEditReservation(${r.id})">Editar</button>
                    <button class="cta-button danger" onclick="deleteReservation(${r.id})">Eliminar</button>
                    <button class="cta-button" onclick="openInvoiceFromReservation(${r.id})">Factura</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        tableBody.innerHTML = '<tr><td colspan="7">No se pudieron cargar las reservas.</td></tr>';
    }
}

async function deleteReservation(id) {
    if (!confirm('¿Eliminar esta reserva?')) return;
    try {
        const res = await fetch(`${API_BASE}/api/reservas/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Reserva eliminada');
            loadReservations();
        } else {
            const e = await res.json().catch(() => ({}));
            alert(e.message || 'Error al eliminar');
        }
    } catch (err) {
        console.error(err);
        alert('Error al eliminar reserva');
    }
}

async function openEditReservation(id) {
    try {
        const res = await fetch(`${API_BASE}/api/reservas/${id}`);
        if (!res.ok) throw new Error('Reserva no encontrada');
        const r = await res.json();
        const modal = document.getElementById('editBookingModal');
        const form = document.getElementById('editBookingForm');
        form.querySelector('input[name="nombre"]').value = r.nombre || '';
        form.querySelector('input[name="email"]').value = r.email || '';
        form.querySelector('input[name="telefono"]').value = r.telefono || '';
        form.querySelector('input[name="destino"]').value = r.destino || '';
        form.querySelector('input[name="fechaSalida"]').value = r.fecha_salida ? r.fecha_salida.split(' ')[0] : '';
        form.querySelector('input[name="fechaRetorno"]').value = r.fecha_retorno ? r.fecha_retorno.split(' ')[0] : '';
        form.querySelector('input[name="personas"]').value = r.personas || 1;
        form.querySelector('textarea[name="preferencias"]').value = r.preferencias || '';
        document.getElementById('editReservaId').value = r.id;
        modal.style.display = 'flex';
        modal.classList.add('active');
    } catch (err) {
        console.error(err);
        alert('No se pudo cargar la reserva para editar');
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
                const res = await fetch(`${API_BASE}/api/reservas/${reservaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, telefono, destino, fechaSalida, fechaRetorno, personas, preferencias })
                });
                if (res.ok) {
                    alert('Reserva actualizada');
                    editModal.style.display = 'none';
                    editModal.classList.remove('active');
                    loadReservations();
                } else {
                    const e = await res.json().catch(() => ({}));
                    alert(e.message || 'Error al actualizar');
                }
            } catch (err) {
                console.error(err);
                alert('Error al actualizar reserva');
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
    fetch(`${API_BASE}/api/reservas/${reservaId}`).then(r => r.json()).then(r => {
        document.getElementById('invoiceReservaId').value = r.id;
        document.getElementById('invoiceNombre').value = r.nombre || '';
        document.getElementById('invoiceEmail').value = r.email || '';
        document.getElementById('invoiceTelefono').value = r.telefono || '';
        document.getElementById('invoiceDestino').value = r.destino || '';
        const modal = document.getElementById('invoiceModal');
        modal.style.display = 'flex';
        modal.classList.add('active');
    }).catch(err => {
        console.error(err);
        alert('No se pudo cargar la reserva');
    });
}
