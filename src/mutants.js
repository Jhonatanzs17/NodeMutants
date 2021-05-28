const express = require('express');
const app = express();
app.use(express.json());

const MutantExp = new RegExp( /([A,T,C,G])\1{3}/ );

let isMutant = function(dna){
    if(findmutant(dna)){
        //hay mutacion horizontal
        return true;
    }else{
        //No se encontro muntante en el horizonte
        let dnav = verticalize(dna);
        if (findmutant(dnav)){
            //hay mutantes venrticalmente
            return true;
        }else{
            //no hay mutantes en el verticalzonte
            let dnaPD = primaldiagonal(dna);
            if(findmutant(dnaPD)){
                //hay mutantes en la primera diagonal!!!
                return true;
            }else{
                let dnaSD = secondarydiagonal(dna);
                if(findmutant(dnaSD)){
                    //hay mutantes en la secundaria!!!!
                    return true;                   
                }
            }
        }
    }
    //retorna false en caso de no encontrar secuencias que indiquen que es mutante
    return false;
}

//valida que lasecuencia de adn sea correcta (NxN)
let validatesize = function(dna){
    for(let i=0; i < dna.length;i++){
        if(dna.length != dna[i].length){
            return false;
        }
    }
    return true;
}

//recibe cadenas de ADN y valida si se encuentra un gen mutante (4 o mas letras repetidas)
//por la forma en la que esta pensado el codigo esta funcion es generica y se utiliza para encontrar los genes independientemente de la direccion del mismo(vertical, orizontal u oblicua)
function findmutant(dna){
    for(let i=0; i < dna.length;i++){
        if(MutantExp.test( dna[i] )) return true;
    }
}

//transforma las cadenas de adn para verticalizar el array(interpretando el array de strings como una matriz de dos dimenciones)
function verticalize(dna){
    let verticaldna = [];
    for(let i=0; i < dna.length;i++){
        if(i==0){
            for(let j=0; j < dna.length;j++){
                verticaldna.push(dna[i].charAt(j));
            }
        }else{
            for(let j=0; j < dna.length;j++){
                verticaldna[j]=verticaldna[j]+dna[i].charAt(j);
            }
        }
    }
    return verticaldna;
}

//Retorna un array de strings con el valor de todas las diagonales primarias(de dereha a izquierda ->)
function primaldiagonal(dna){
    let cont = 0;
    let diagonaldna=[];

    for (let i = 0; i < dna.length; i++) {
        let diagonalone = "";
        let diagonaltwo = "";

        for (let j = 0; j < dna.length-cont ; j++) {
            diagonalone = diagonalone + dna[j].charAt(cont+j);
            diagonaltwo = diagonaltwo + dna[cont+j].charAt(j);
        }
        if(diagonalone.length > 3) diagonaldna.push(diagonalone);
        if(diagonaltwo.length > 3) diagonaldna.push(diagonaltwo);
        
        cont++;
    }
    return diagonaldna;
}

//Retorna un array de strings con el valor de todas las diagonales secundarias(de izquierda a dereha <-)
function secondarydiagonal(dna){
    let cont = 1;
    let diagonaldna=[];
    let dnal = dna.length;
    for (let i = 0; i < dnal; i++) {
        let diagonalone = "";
        let diagonaltwo = "";

        //este for y el if siguiente, determinan las diagonales de encima y principal
        for (let j = 0; j < dnal ; j++) {
            if(dnal-cont-j >= 0)diagonalone = diagonalone + dna[j].charAt(dnal-cont-j);
        }
        if(diagonalone.length > 3) diagonaldna.push(diagonalone);

        //este for y el if siguiente, determina las diagonales por debajo de la principal
        for (let j = 0; j < dnal ; j++) {
            if(j+cont < dnal)diagonaltwo = diagonaltwo + dna[j+cont].charAt(dnal-1-j);
        }
        if(diagonaltwo.length > 3) diagonaldna.push(diagonaltwo);
        
        cont++;
    }
    return diagonaldna;
}

module.exports = {
    isMutant,
    validatesize
}