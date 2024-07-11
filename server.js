const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 4000;
const apiKey = '8qXKc3A0y+YsXHFDwLKqjg==L4spbvnoEygTek0G';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

class DataStore {
    read() {
        const rawData = fs.readFileSync('./data/db.json');
        return JSON.parse(rawData);
    }

    write(data) {
        const dataStr = JSON.stringify(data, null, 2);
        fs.writeFileSync('./data/db.json', dataStr);
    }
}

const dataStore = new DataStore();

app.get('/process', (req, res) => {
    const data = dataStore.read();
    res.send(data.process);
});

app.put('/process/:processName', (req, res) => {
    const processName = req.params.processName;
    const data = dataStore.read();
    const processIndex = data.process.findIndex(p => p.process === processName);

    if (processIndex !== -1) {
        data.process[processIndex].numberRequisition += 1;
        dataStore.write(data);
        res.send(data.process[processIndex]);
    } else {
        res.status(404).send({ message: 'Process not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});