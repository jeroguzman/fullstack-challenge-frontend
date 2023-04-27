import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import {
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TextField
} from '@mui/material';

function App() {

  const [data, setData] = useState(null);

  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('archivo', file);
    await axios.post('http://127.0.0.1:8000/csvjson/', formData)
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  }

  const totalDuplicates = (data) => {
    let total = 0;
    data.forEach((item) => {
      if (item.nombre === '') {
        total++;
      }
      if (data.filter((item2) => item2.nombre === item.nombre).length > 1) {
        total++;
      }
      if (data.filter((item2) => item2.email === item.email).length > 1) {
        total++;
      }
      if (data.filter((item2) => item2.telefono === item.telefono).length > 1) {
        total++;
      }
    });
    return total;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth="md">
          <Stack spacing={2}>
            <Typography variant="h4" component="div" gutterBottom>
              CSV to JSON
            </Typography>
            <Typography variant="body1" gutterBottom>
              Convierte un archivo CSV a JSON y elimina duplicados
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  id="file"
                  label="Archivo CSV"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button variant="contained" type="submit">Convertir</Button>
              </Stack>
            </form>
            {data &&
              <>
              <TableContainer component={Paper}>
              <Typography variant="body1" gutterBottom>
                Total de personas {data.length}
              </Typography>
                
              <Typography variant="body1" gutterBottom>
                Total de duplicados {totalDuplicates(data)}
              </Typography>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell align="right">Email</TableCell>
                      <TableCell align="right">Telefono</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow
                        key={row.nombre}
                        sx={ validateEmail(row.email) && validatePhone(row.telefono) ? { bgcolor: '#fff' } : { bgcolor: '#fff000' } }
                      >
                        <TableCell component="th" scope="row" sx={ data.filter((item) => item.nombre === row.nombre).length > 1 ? { color: '#ff0000' } : {} }>
                          {row.nombre}
                        </TableCell>
                        <TableCell align="right" sx={ data.filter((item) => item.email === row.email).length > 1 ? { color: '#ff0000' } : {} }>{row.email}</TableCell>
                        <TableCell align="right" sx={ data.filter((item) => item.telefono === row.telefono).length > 1 ? { color: '#ff0000' } : {} }>{row.telefono}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </>
            }
          </Stack>
        </Container>
      </header>
    </div>
  );
}

export default App;

