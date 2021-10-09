const exprss = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./db");


require('dotenv').config();
const app = exprss();

app.use(cors({
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Wellcom to IOT API .... ');
});
app.get('/write',async (req, res) => {
    try{
        let { heart_beats , noise , lighting , pollution  } = req.query;
        console.log(heart_beats , noise , lighting , pollution );
        const date = new Date();

        await db.query(`INSERT INTO WESAM_DATA( heart_beats , noise , lighting , pollution,date)
        VALUES ($1, $2, $3,$4,$5)`,[heart_beats , noise , lighting , pollution, date]);
        res.status(200).send("OK");
    }catch(err){
        console.log(err)
    }
   
});
app.get('/read', async(req, res) => {
    const data =await db.query(`Select * from WESAM_DATA ORDER BY date ASC`);
    console.log(data);
    res.send(data.rows);
});
app.get('/readLast', async(req, res) => {
    const data =await db.query(`Select * from WESAM_DATA ORDER BY date DESC LIMIT 1`);
    console.log(data);
    res.send(data.rows[0]);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {

    console.log("your server is running on port " + port);
})