// src/controllers/financieroController.js
const ReportesFinancieros = require('../models/ReportesFinancieros');

// Reporte de ingresos por período
exports.getIngresosPorPeriodo = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, tipoPeriodo = 'dia' } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    const reportes = await ReportesFinancieros.getIngresosPorPeriodo(
      fechaInicio,
      fechaFin,
      tipoPeriodo
    );

    res.json({
      success: true,
      data: reportes,
      parametros: { fechaInicio, fechaFin, tipoPeriodo },
      totalRegistros: reportes.length
    });
  } catch (err) {
    console.error('Error en getIngresosPorPeriodo:', err);
    res.status(500).json({
      error: 'Error al generar reporte de ingresos por período'
    });
  }
};

// Reporte de ingresos por tatuador
exports.getIngresosPorTatuador = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    const reportes = await ReportesFinancieros.getIngresosPorTatuador(
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: reportes,
      parametros: { fechaInicio, fechaFin },
      totalRegistros: reportes.length
    });
  } catch (err) {
    console.error('Error en getIngresosPorTatuador:', err);
    res.status(500).json({
      error: 'Error al generar reporte de ingresos por tatuador'
    });
  }
};

// Reporte de servicios más populares
exports.getServiciosMasPopulares = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    const reportes = await ReportesFinancieros.getServiciosMasPopulares(
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: reportes,
      parametros: { fechaInicio, fechaFin },
      totalRegistros: reportes.length
    });
  } catch (err) {
    console.error('Error en getServiciosMasPopulares:', err);
    res.status(500).json({
      error: 'Error al generar reporte de servicios populares'
    });
  }
};

// Reporte de ganancias netas
exports.getGananciasNetas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    const reporte = await ReportesFinancieros.getGananciasNetas(
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: reporte,
      parametros: { fechaInicio, fechaFin }
    });
  } catch (err) {
    console.error('Error en getGananciasNetas:', err);
    res.status(500).json({
      error: 'Error al generar reporte de ganancias netas'
    });
  }
};

// Reporte de métricas generales
exports.getMetricasGenerales = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    const metricas = await ReportesFinancieros.getMetricasGenerales(
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: metricas,
      parametros: { fechaInicio, fechaFin }
    });
  } catch (err) {
    console.error('Error en getMetricasGenerales:', err);
    res.status(500).json({
      error: 'Error al generar métricas generales'
    });
  }
};

// Reporte de tendencias de citas
exports.getTendenciasCitas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    const tendencias = await ReportesFinancieros.getTendenciasCitas(
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: tendencias,
      parametros: { fechaInicio, fechaFin },
      totalRegistros: tendencias.length
    });
  } catch (err) {
    console.error('Error en getTendenciasCitas:', err);
    res.status(500).json({
      error: 'Error al generar reporte de tendencias'
    });
  }
};

// Reporte de pagos por método
exports.getPagosPorMetodo = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    const pagos = await ReportesFinancieros.getPagosPorMetodo(
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: pagos,
      parametros: { fechaInicio, fechaFin },
      totalRegistros: pagos.length
    });
  } catch (err) {
    console.error('Error en getPagosPorMetodo:', err);
    res.status(500).json({
      error: 'Error al generar reporte de pagos por método'
    });
  }
};

// Reporte de citas por estado
exports.getCitasPorEstado = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    const estados = await ReportesFinancieros.getCitasPorEstado(
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: estados,
      parametros: { fechaInicio, fechaFin },
      totalRegistros: estados.length
    });
  } catch (err) {
    console.error('Error en getCitasPorEstado:', err);
    res.status(500).json({
      error: 'Error al generar reporte de citas por estado'
    });
  }
};

// Dashboard financiero resumen
exports.getDashboardFinanciero = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros fechaInicio y fechaFin son requeridos'
      });
    }

    // Ejecutar múltiples consultas en paralelo para mejor rendimiento
    const [
      metricasGenerales,
      ingresosPorPeriodo,
      serviciosPopulares,
      gananciasNetas,
      pagosPorMetodo
    ] = await Promise.all([
      ReportesFinancieros.getMetricasGenerales(fechaInicio, fechaFin),
      ReportesFinancieros.getIngresosPorPeriodo(fechaInicio, fechaFin, 'dia'),
      ReportesFinancieros.getServiciosMasPopulares(fechaInicio, fechaFin),
      ReportesFinancieros.getGananciasNetas(fechaInicio, fechaFin),
      ReportesFinancieros.getPagosPorMetodo(fechaInicio, fechaFin)
    ]);

    res.json({
      success: true,
      data: {
        metricasGenerales,
        ingresosPorPeriodo,
        serviciosPopulares,
        gananciasNetas,
        pagosPorMetodo
      },
      parametros: { fechaInicio, fechaFin }
    });
  } catch (err) {
    console.error('Error en getDashboardFinanciero:', err);
    res.status(500).json({
      error: 'Error al generar dashboard financiero'
    });
  }
};

// Exportar reporte a CSV
exports.exportarReporteCSV = async (req, res) => {
  try {
    const { tipo, fechaInicio, fechaFin } = req.query;

    if (!tipo || !fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Los parámetros tipo, fechaInicio y fechaFin son requeridos'
      });
    }

    let data = [];
    let headers = [];
    let filename = '';

    switch (tipo) {
      case 'ingresos-periodo':
        data = await ReportesFinancieros.getIngresosPorPeriodo(fechaInicio, fechaFin);
        headers = ['Período', 'Total Citas', 'Ingresos Totales', 'Ingresos Pagados', 'Ingresos Pendientes', 'Promedio por Cita'];
        filename = `ingresos-por-periodo-${fechaInicio}-a-${fechaFin}.csv`;
        break;

      case 'ingresos-tatuador':
        data = await ReportesFinancieros.getIngresosPorTatuador(fechaInicio, fechaFin);
        headers = ['Tatuador Email', 'Tatuador Nombre', 'Total Citas', 'Ingresos Totales', 'Ingresos Pagados', 'Promedio por Cita', 'Citas Pagadas', 'Citas Pendientes'];
        filename = `ingresos-por-tatuador-${fechaInicio}-a-${fechaFin}.csv`;
        break;

      case 'servicios-populares':
        data = await ReportesFinancieros.getServiciosMasPopulares(fechaInicio, fechaFin);
        headers = ['Servicio', 'Descripción', 'Veces Solicitado', 'Ingresos Totales', 'Precio Promedio', 'Precio Base'];
        filename = `servicios-populares-${fechaInicio}-a-${fechaFin}.csv`;
        break;

      case 'metricas-generales':
        data = [await ReportesFinancieros.getMetricasGenerales(fechaInicio, fechaFin)];
        headers = ['Total Citas', 'Clientes Únicos', 'Tatuadores Activos', 'Ingresos Brutos', 'Promedio por Cita', 'Primera Cita', 'Última Cita', 'Citas Solicitud', 'Citas Programadas', 'Citas Confirmadas', 'Citas Realizadas', 'Citas Canceladas'];
        filename = `metricas-generales-${fechaInicio}-a-${fechaFin}.csv`;
        break;

      default:
        return res.status(400).json({ error: 'Tipo de reporte no válido' });
    }

    // Crear CSV
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header.toLowerCase().replace(/ /g, '_')] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',');
    });

    const csv = [csvHeaders, ...csvRows].join('\n');

    // Configurar headers de respuesta
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.send('\ufeff' + csv); // BOM para UTF-8
  } catch (err) {
    console.error('Error en exportarReporteCSV:', err);
    res.status(500).json({
      error: 'Error al generar archivo CSV'
    });
  }
};
