const express = require('express');
const app = express();


let mutants = require("./mutants");

app.set('port', process.env.PORT || 3000)

app.use(express.json());

app.get('/',(req, res)=>{
    res.send(`server on port ${app.get('port')}`);
});

app.post('/mutant/',(req,res)=>{
    const {dna} = req.body;
    let status = 400;
    if(dna){
        if(mutants.validatesize(dna)){
            if(mutants.isMutant(dna)){
                status = 200;
            }else{
                status = 403;
            }
        }else{
            //esto saldra en caso de que la solucitud no cumpla con las validaciones ejm(que no sea un)
            status = 400;
        }
    }
    res.sendStatus(status);
});

app.listen(3000, ()=>{
    console.log(`server on port ${app.get('port')}`);
});