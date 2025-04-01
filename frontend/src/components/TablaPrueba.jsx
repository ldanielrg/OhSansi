import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';

const TablaPrueba = () => {
  const [rowData] = useState([
    { nombre: 'Juan', edad: 20 },
    { nombre: 'Ana', edad: 22 },
  ]);

  const [columnDefs] = useState([
    {
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: 'left',
      headerName: '',
    },
    { field: 'nombre', headerName: 'Nombre' },
    { field: 'edad', headerName: 'Edad' },
  ]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Prueba de Tabla</h2>
      <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
        <AgGridReact
          modules={[ClientSideRowModelModule]}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="single"
        />
      </div>
    </div>
  );
};

export default TablaPrueba;
