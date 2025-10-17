const Cliente = require('../models/Clientes');

exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.getAll();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.getById(id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCliente = async (req, res) => {
  try {
    const { email, clave, ...clienteData } = req.body;
    if (!email || !clave || !clienteData.nombre) {
      return res.status(400).json({ error: 'Email, clave y nombre son requeridos' });
    }
    const result = await Cliente.createWithUser({ email, clave }, clienteData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.getById(id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    await Cliente.update(id, req.body);
    res.json({ message: 'Cliente actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.getById(id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    await Cliente.delete(id);
    res.json({ message: 'Cliente desactivado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};